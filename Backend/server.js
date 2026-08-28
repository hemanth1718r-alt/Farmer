const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultDB = { farmers: [], bookings: [], notifications: [] };

function db() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return JSON.parse(JSON.stringify(defaultDB));
  }
}

function save(x) {
  fs.writeFileSync(DB_FILE, JSON.stringify(x, null, 2));
}

function newId(prefix) {
  return prefix + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
}

function notify(phone, message) {
  const d = db();
  d.notifications.push({
    id: newId("NT"),
    phone,
    message,
    createdAt: new Date().toISOString(),
    channel: "SMS-MOCK"
  });
  save(d);
}

// Priority logic
function calculatePriority(distance, perishable) {
  const isLongDistance = Number(distance || 0) >= 30;
  const isPerishable = !!perishable;
  
  if (isLongDistance && isPerishable) {
    return { score: 3, reason: "High: long distance + perishable" };
  } else if (isLongDistance) {
    return { score: 2, reason: "Priority: long distance" };
  } else if (isPerishable) {
    return { score: 2, reason: "Priority: perishable crop" };
  } else {
    return { score: 1, reason: "Normal" };
  }
}

// Queue sorting logic
function getSlotMinutes(slotStr) {
  if (!slotStr) return 0;
  const match = slotStr.match(/^(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hrs = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hrs !== 12) hrs += 12;
  if (ampm === "AM" && hrs === 12) hrs = 0;
  return hrs * 60 + mins;
}

// FIX 1: Only count "Slot Booked" as actively waiting in the queue
function activeForSlot(d, centre, date, slot) {
  return d.bookings.filter(
    x =>
      x.centre === centre &&
      x.date === date &&
      x.slot === slot &&
      x.status === "Slot Booked"
  );
}

function queueFor(d, centre, date, slot) {
  return activeForSlot(d, centre, date, slot).sort((a, b) => {
    if (Number(a.priorityScore) !== Number(b.priorityScore)) {
      return Number(b.priorityScore) - Number(a.priorityScore);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

function position(d, b) {
  const q = queueFor(d, b.centre, b.date, b.slot);
  const i = q.findIndex(x => x.id === b.id);
  return i < 0 ? 0 : i + 1;
}

function wait(pos) {
  return Math.max(0, (pos - 1) * 7);
}

function safeFarmer(f) {
  const x = { ...f };
  delete x.password;
  delete x.resetCode;
  delete x.resetExpires;
  return x;
}

// FARMER ENDPOINTS

// Register
app.post("/api/farmer/register", (req, res) => {
  const { name, phone, password, perishable } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ message: "Enter a valid 10-digit mobile number." });
  }
  const d = db();
  if (d.farmers.some(f => f.phone === phone)) {
    return res.status(409).json({ message: "This mobile number is already registered." });
  }
  
  const farmer = {
    id: newId("FRM"),
    name,
    phone,
    password,
    idNumber: "",
    crop: "",
    quantity: 0,
    distance: 0,
    perishable: !!perishable,
    createdAt: new Date().toISOString()
  };
  
  d.farmers.push(farmer);
  save(d);
  
  notify(phone, `Welcome ${name}. Your Farmer ID is ${farmer.id}.`);
  res.status(201).json({ message: "Registration successful", farmer: safeFarmer(farmer) });
});

// Login
app.post("/api/farmer/login", (req, res) => {
  const { phone, password } = req.body;
  const d = db();
  const f = d.farmers.find(x => x.phone === phone);
  if (!f || f.password !== password) {
    return res.status(401).json({ message: "Invalid mobile number or password." });
  }
  res.json({ message: "Login successful", farmer: safeFarmer(f) });
});

// Forgot Password Request
app.post("/api/farmer/forgot", (req, res) => {
  const { phone } = req.body;
  const d = db();
  const f = d.farmers.find(x => x.phone === phone);
  if (!f) {
    return res.status(404).json({ message: "No farmer account found for this mobile number." });
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  f.resetCode = code;
  f.resetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  save(d);
  
  notify(phone, `AgriQueue password reset code: ${code}. Valid for 10 minutes.`);
  res.json({
    message: "Reset code generated successfully. For testing, it is printed below.",
    demoCode: code
  });
});

// Password Reset
app.post("/api/farmer/reset", (req, res) => {
  const { phone, code, newPassword } = req.body;
  const d = db();
  const f = d.farmers.find(x => x.phone === phone);
  if (!f || f.resetCode !== code || Date.now() > Number(f.resetExpires)) {
    return res.status(400).json({ message: "Invalid or expired reset code." });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }
  
  f.password = newPassword;
  delete f.resetCode;
  delete f.resetExpires;
  save(d);
  
  notify(phone, "Your AgriQueue account password has been reset successfully.");
  res.json({ message: "Password changed successfully. Please login." });
});

// Get profile
app.get("/api/farmer/:id", (req, res) => {
  const d = db();
  const f = d.farmers.find(x => x.id === req.params.id);
  if (!f) return res.status(404).json({ message: "Farmer not found." });
  res.json(safeFarmer(f));
});

// SLOTS ENDPOINT
app.get("/api/slots", (req, res) => {
  const centre = req.query.centre || "Main Procurement Centre";
  const date = req.query.date;
  if (!date) return res.status(400).json({ message: "Date parameter is required." });
  
  const d = db();
  const slots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM"
  ];
  
  res.json(slots.map(slot => {
    // FIX 4: Paid/Completed farmers do not take up capacity
    const booked = d.bookings.filter(
      b => b.centre === centre && b.date === date && b.slot === slot && b.status !== "Cancelled" && b.status !== "Payment Processed"
    ).length;
    return {
      slot,
      capacity: 10,
      booked,
      available: Math.max(0, 10 - booked),
      full: booked >= 10
    };
  }));
});

// BOOKINGS ENDPOINTS

// Create Booking
app.post("/api/bookings", (req, res) => {
  const { farmerId, centre, date, slot, crop, quantity, distance } = req.body;
  
  // FIX 5: Validate Centre, Slot, and Past Dates
  const validCentres = [
    "Main Procurement Centre",
    "North Village Centre",
    "Market Yard Centre"
  ];
  const validSlots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM"
  ];

  if (!validCentres.includes(centre)) {
    return res.status(400).json({ message: "Invalid procurement centre." });
  }
  if (!validSlots.includes(slot)) {
    return res.status(400).json({ message: "Invalid time slot." });
  }
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return res.status(400).json({ message: "Booking date cannot be in the past." });
  }

  const d = db();
  const f = d.farmers.find(x => x.id === farmerId);
  if (!f) return res.status(404).json({ message: "Farmer not found." });
  
  const activeBooking = d.bookings.find(
    b => b.farmerId === farmerId && b.status !== "Cancelled" && b.status !== "Payment Processed"
  );
  if (activeBooking) {
    return res.status(409).json({
      message: "You already have an active application. Please complete or cancel it before booking again.",
      booking: activeBooking
    });
  }
  
  // FIX 4 (Consistency): Paid/Completed do not take up booking capacity
  const count = d.bookings.filter(
    b => b.centre === centre && b.date === date && b.slot === slot && b.status !== "Cancelled" && b.status !== "Payment Processed"
  ).length;
  
  if (count >= 10) {
    return res.status(409).json({ message: "Selected time slot is already full." });
  }
  
  const bookingDistance = Number(distance !== undefined ? distance : (f.distance || 0));
  const p = calculatePriority(bookingDistance, f.perishable);
  const booking = {
    id: newId("APP"),
    farmerId: f.id,
    farmerName: f.name,
    phone: f.phone,
    crop: crop || f.crop || "Paddy",
    quantity: Number(quantity !== undefined ? quantity : (f.quantity || 100)),
    centre,
    date,
    slot,
    priorityScore: p.score,
    priorityReason: p.reason,
    status: "Slot Booked",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  d.bookings.push(booking);
  save(d);
  
  const pos = position(d, booking);
  notify(
    f.phone,
    `Your AgriQueue slot booking ${booking.id} is confirmed. Centre: ${centre}, Date: ${date}, Time: ${slot}. Queue Position: #${pos}.`
  );
  
  res.status(201).json({
    booking,
    queuePosition: pos,
    estimatedWait: wait(pos)
  });
});

// Get farmer bookings
app.get("/api/bookings/farmer/:id", (req, res) => {
  const d = db();
  const arr = d.bookings
    .filter(b => b.farmerId === req.params.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(b => {
      const active = b.status !== "Cancelled" && b.status !== "Payment Processed";
      const pos = active ? position(d, b) : 0;
      return {
        ...b,
        queuePosition: pos,
        estimatedWait: active ? wait(pos) : 0
      };
    });
  res.json(arr);
});

// Cancel Booking
app.put("/api/bookings/:id/cancel", (req, res) => {
  const d = db();
  const b = d.bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ message: "Application not found." });
  
  // FIX 6: Restrict cancellation strictly to "Slot Booked"
  if (b.status !== "Slot Booked") {
    return res.status(400).json({ message: "This application can no longer be cancelled." });
  }
  
  b.status = "Cancelled";
  b.updatedAt = new Date().toISOString();
  save(d);
  
  notify(b.phone, `Your AgriQueue application ${b.id} has been cancelled.`);
  res.json({ message: "Application cancelled successfully." });
});

// Get Notification History
app.get("/api/notifications/:phone", (req, res) => {
  const d = db();
  const arr = d.notifications
    .filter(n => n.phone === req.params.phone)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(arr);
});


// STAFF ENDPOINTS

// Login
app.post("/api/staff/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.json({ message: "Staff login successful" });
  }
  res.status(401).json({ message: "Invalid staff credentials." });
});

// Applications list for specific centre + date (active only, sorted by slot and priority)
app.get("/api/staff/applications", (req, res) => {
  const { centre, date } = req.query;
  if (!centre || !date) {
    return res.status(400).json({ message: "Centre and date are required." });
  }
  const d = db();
  
  let arr = d.bookings.filter(
    b => b.centre === centre && 
         b.date === date && 
         b.status !== "Cancelled" && 
         b.status !== "Payment Processed"
  );
  
  arr.sort((a, b) => {
    const timeA = getSlotMinutes(a.slot);
    const timeB = getSlotMinutes(b.slot);
    if (timeA !== timeB) return timeA - timeB;
    if (Number(a.priorityScore) !== Number(b.priorityScore)) {
      return Number(b.priorityScore) - Number(a.priorityScore);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  
  res.json(arr.map(b => {
    const pos = position(d, b);
    return {
      ...b,
      queuePosition: pos,
      estimatedWait: wait(pos)
    };
  }));
});

// Stats
app.get("/api/staff/stats", (req, res) => {
  const d = db();
  res.json({
    farmers: d.farmers.length,
    applications: d.bookings.length,
    waiting: d.bookings.filter(b => b.status === "Slot Booked" || b.status === "Arrived" || b.status === "Produce Weighed" || b.status === "Produce Graded").length,
    served: d.bookings.filter(b => b.status === "Payment Processed").length,
    arrived: d.bookings.filter(b => b.status !== "Cancelled" && b.status !== "Slot Booked" && b.status !== "Payment Processed").length
  });
});

// Call Farmer
app.put("/api/staff/applications/:id/call", (req, res) => {
  const d = db();
  const b = d.bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ message: "Application not found." });
  
  if (b.status !== "Slot Booked") {
    return res.status(400).json({ message: "Can only call farmers with 'Slot Booked' status." });
  }

  b.status = "Arrived";
  b.updatedAt = new Date().toISOString();
  save(d);
  
  notify(b.phone, `Your turn is now. Please proceed to the procurement counter.`);
  res.json({ message: `Farmer ${b.farmerName} called successfully. Status set to Arrived.`, booking: b });
});

// Update Status
app.put("/api/staff/applications/:id/status", (req, res) => {
  const { status } = req.body;
  const d = db();
  const b = d.bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ message: "Application not found." });
  
  // FIX 3: Enforce Strict Pipeline Workflow
  const nextStatus = {
    "Slot Booked": "Arrived",
    "Arrived": "Produce Weighed",
    "Produce Weighed": "Produce Graded",
    "Produce Graded": "Payment Processed"
  };

  if (nextStatus[b.status] !== status) {
    return res.status(400).json({
      message: `Invalid workflow. Current status is "${b.status}". Next allowed status is "${nextStatus[b.status] || "None"}".`
    });
  }
  
  b.status = status;
  b.updatedAt = new Date().toISOString();
  save(d);
  
  let msg = `Your application ${b.id} status has been updated to: ${status}.`;
  if (status === "Produce Weighed") {
    msg = `Your produce for booking ${b.id} has been weighed successfully.`;
  } else if (status === "Produce Graded") {
    msg = `Your produce for booking ${b.id} has been graded.`;
  } else if (status === "Payment Processed") {
    msg = `Payment of your procurement application ${b.id} has been processed successfully.`;
  }
  notify(b.phone, msg);
  
  res.json({ message: `Application status updated to ${status}.`, booking: b });
});

// Activity/SMS Feed
app.get("/api/staff/notifications", (req, res) => {
  const d = db();
  res.json(
    d.notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100)
  );
});

app.listen(PORT, () => {
  console.log(`AgriQueue backend API server running at http://localhost:${PORT}`);
});