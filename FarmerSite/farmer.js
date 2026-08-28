const API_URL = "http://localhost:3000/api";

const $ = x => document.getElementById(x);

// PAGE ROUTING & DOM INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if ($("loginForm")) {
    initLogin();
  }
  if ($("regForm")) {
    initRegister();
  }
  if ($("farmerDashboard")) {
    initDashboard();
  }
});

// --------------------------------------------------
// FARMER LOGIN PAGE
// --------------------------------------------------
function initLogin() {
  $("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const phone = $("phone").value;
    const password = $("password").value;
    const messageDiv = $("message");
    
    try {
      const r = await fetch(`${API_URL}/farmer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const d = await r.json();
      
      if (!r.ok) {
        messageDiv.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      localStorage.setItem("farmer", JSON.stringify(d.farmer));
      messageDiv.innerHTML = `<div class="success">Login successful! Redirecting...</div>`;
      setTimeout(() => {
        location.href = "farmer-dashboard.html";
      }, 800);
    } catch (err) {
      messageDiv.innerHTML = `<div class="error">Unable to connect to backend server.</div>`;
    }
  };

  // Bind forgot password actions
  $("btnForgot").onclick = () => {
    $("forgot").classList.remove("hidden");
    $("fphone").value = $("phone").value;
  };
  
  $("btnSendCode").onclick = async () => {
    const phone = $("fphone").value;
    const messageDiv = $("message");
    if (!phone) {
      messageDiv.innerHTML = `<div class="error">Please enter mobile number in the reset box.</div>`;
      return;
    }
    
    try {
      const r = await fetch(`${API_URL}/farmer/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const d = await r.json();
      
      if (!r.ok) {
        messageDiv.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      $("codeBox").classList.remove("hidden");
      $("demoCode").textContent = `DEMO reset code: ${d.demoCode}`;
      messageDiv.innerHTML = `<div class="success">${d.message}</div>`;
    } catch (err) {
      messageDiv.innerHTML = `<div class="error">Error requesting password reset.</div>`;
    }
  };

  $("btnResetPassword").onclick = async () => {
    const phone = $("fphone").value;
    const code = $("rcode").value;
    const newPassword = $("newpass").value;
    const messageDiv = $("message");
    
    if (!phone || !code || !newPassword) {
      messageDiv.innerHTML = `<div class="error">All fields are required to reset password.</div>`;
      return;
    }
    
    try {
      const r = await fetch(`${API_URL}/farmer/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, newPassword })
      });
      const d = await r.json();
      
      messageDiv.innerHTML = `<div class="${r.ok ? 'success' : 'error'}">${d.message}</div>`;
      if (r.ok) {
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    } catch (err) {
      messageDiv.innerHTML = `<div class="error">Error resetting password.</div>`;
    }
  };
}

// --------------------------------------------------
// FARMER REGISTRATION PAGE
// --------------------------------------------------
function initRegister() {
  $("regForm").onsubmit = async (e) => {
    e.preventDefault();
    const msgDiv = $("msg");
    
    const password = $("password").value;
    const confirm = $("confirm").value;
    if (password !== confirm) {
      msgDiv.innerHTML = `<div class="error">Passwords do not match.</div>`;
      return;
    }
    
    const data = {
      name: $("name").value,
      phone: $("phone").value,
      idNumber: $("idNumber").value,
      crop: $("crop").value,
      quantity: $("quantity").value,
      distance: $("distance").value,
      perishable: $("perishable").checked,
      password: password
    };
    
    try {
      const r = await fetch(`${API_URL}/farmer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const d = await r.json();
      
      if (!r.ok) {
        msgDiv.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      localStorage.setItem("farmer", JSON.stringify(d.farmer));
      msgDiv.innerHTML = `<div class="success">Registration successful. Your Farmer ID is <b>${d.farmer.id}</b>.</div>`;
      setTimeout(() => {
        location.href = "farmer-dashboard.html";
      }, 1500);
    } catch (err) {
      msgDiv.innerHTML = `<div class="error">Connection failed. Make sure backend is running.</div>`;
    }
  };
}

// --------------------------------------------------
// FARMER DASHBOARD PAGE
// --------------------------------------------------
let globalFarmer = null;

function initDashboard() {
  globalFarmer = JSON.parse(localStorage.getItem("farmer") || "null");
  if (!globalFarmer) {
    location.href = "farmer-login.html";
    return;
  }
  
  // Bind simple user details
  $("fname").textContent = globalFarmer.name;
  $("fid").textContent = globalFarmer.id;
  $("fcrop").textContent = globalFarmer.crop;
  $("fqty").textContent = `${globalFarmer.quantity} kg`;
  $("fmobile").textContent = globalFarmer.phone;
  
  // Set date input constraints (today onwards)
  const todayStr = new Date().toISOString().slice(0, 10);
  $("date").min = todayStr;
  $("date").value = todayStr;
  
  // Bind slot loader listeners
  $("centre").onchange = loadSlots;
  $("date").onchange = loadSlots;
  
  // Bind book form
  $("bookForm").onsubmit = async (e) => {
    e.preventDefault();
    const bookMsg = $("bookMsg");
    bookMsg.innerHTML = "";
    
    try {
      const r = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: globalFarmer.id,
          centre: $("centre").value,
          date: $("date").value,
          slot: $("slot").value
        })
      });
      const d = await r.json();
      
      if (!r.ok) {
        bookMsg.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      bookMsg.innerHTML = `
        <div class="success">
          Slot Booked successfully!<br>
          <b>Application ID:</b> ${d.booking.id}<br>
          <b>Queue Position:</b> #${d.queuePosition}<br>
          <b>Estimated Waiting Time:</b> ~${d.estimatedWait} minutes
        </div>
      `;
      
      loadDashboardData();
      loadSlots();
    } catch (err) {
      bookMsg.innerHTML = `<div class="error">Could not process booking request.</div>`;
    }
  };

  // Bind logout button
  $("btnLogout").onclick = () => {
    localStorage.removeItem("farmer");
    location.href = "farmer-login.html";
  };
  
  // Initial loads
  loadDashboardData();
  loadSlots();
  
  // Auto-refresh every 5 seconds
  setInterval(() => {
    loadDashboardData();
  }, 5000);
}

async function loadSlots() {
  const centre = $("centre").value;
  const date = $("date").value;
  if (!date) return;
  
  try {
    const r = await fetch(`${API_URL}/slots?centre=${encodeURIComponent(centre)}&date=${date}`);
    const slotsList = await r.json();
    
    if (!r.ok) {
      $("slot").innerHTML = `<option value="">Error loading slots</option>`;
      return;
    }
    
    $("slot").innerHTML = `
      <option value="">Choose a slot</option>
      ${slotsList.map(s => `
        <option value="${s.slot}" ${s.full ? 'disabled' : ''}>
          ${s.slot} — ${s.full ? 'FULL' : `${s.available} available`}
        </option>
      `).join("")}
    `;
  } catch (err) {
    $("slot").innerHTML = `<option value="">Choose a slot</option>`;
  }
}

async function cancelApplication(appId) {
  if (!confirm(`Are you sure you want to cancel booking application ${appId}?`)) return;
  
  try {
    const r = await fetch(`${API_URL}/bookings/${appId}/cancel`, {
      method: "PUT"
    });
    const d = await r.json();
    alert(d.message);
    loadDashboardData();
    loadSlots();
  } catch (err) {
    alert("Failed to cancel application.");
  }
}

async function loadDashboardData() {
  if (!globalFarmer) return;
  
  try {
    // 1. Fetch applications
    const r = await fetch(`${API_URL}/bookings/farmer/${globalFarmer.id}`);
    const bookings = await r.json();
    
    const appsDiv = $("apps");
    if (!bookings || bookings.length === 0) {
      appsDiv.innerHTML = `<div class="empty">No applications yet. Book your first slot above.</div>`;
    } else {
      appsDiv.innerHTML = bookings.map(b => {
        const statuses = ["Slot Booked", "Arrived", "Produce Weighed", "Produce Graded", "Payment Processed"];
        const currentIndex = statuses.indexOf(b.status);
        const progressPct = ((currentIndex + 1) / statuses.length) * 100;
        
        // Build checklist indicators
        const stepsHTML = statuses.map((statusName, index) => {
          let stepClass = "";
          let checkMark = "○";
          if (index < currentIndex) {
            stepClass = "completed";
            checkMark = "✓";
          } else if (index === currentIndex) {
            stepClass = "active";
            checkMark = "●";
          }
          return `
            <div class="status-step ${stepClass}">
              <div class="bullet">${checkMark}</div>
              <span>${statusName}</span>
            </div>
          `;
        }).join("");
        
        const isCancelable = b.status !== "Cancelled" && b.status !== "Payment Processed";
        
        return `
          <article class="application">
            <div class="app-top">
              <div>
                <b>${b.id}</b>
                <p>${b.centre} • ${b.date} • ${b.slot}</p>
              </div>
              <span class="pill" style="background:${b.status === 'Cancelled' ? '#ffe0e0' : b.status === 'Payment Processed' ? '#ebf8e5' : '#e9f5df'}; color:${b.status === 'Cancelled' ? '#c84d4d' : b.status === 'Payment Processed' ? '#236b3b' : '#24683a'}">
                ${b.status}
              </span>
            </div>
            
            <div class="app-grid">
              <div>
                <small>QUEUE POSITION</small>
                <strong>${(b.status === "Cancelled" || b.status === "Payment Processed") ? "—" : `#${b.queuePosition}`}</strong>
              </div>
              <div>
                <small>EST. WAIT TIME</small>
                <strong>${(b.status === "Cancelled" || b.status === "Payment Processed") ? "—" : `${b.estimatedWait} min`}</strong>
              </div>
              <div>
                <small>CROP TYPE</small>
                <strong>${b.crop} (${b.quantity} kg)</strong>
              </div>
              <div>
                <small>PRIORITY STATUS</small>
                <strong>${b.priorityReason}</strong>
              </div>
            </div>
            
            ${b.status !== "Cancelled" ? `
              <div class="status-tracker">
                ${stepsHTML}
              </div>
              <div class="bar">
                <span style="width: ${progressPct}%"></span>
              </div>
            ` : ''}
            
            ${isCancelable ? `
              <button class="cancel" onclick="cancelApplication('${b.id}')">Cancel Active Slot</button>
            ` : ''}
          </article>
        `;
      }).join("");
    }
    
    // 2. Fetch notifications
    const r2 = await fetch(`${API_URL}/notifications/${globalFarmer.phone}`);
    const notices = await r2.json();
    
    $("ncount").textContent = notices.length;
    const noticesDiv = $("notifications");
    
    if (!notices || notices.length === 0) {
      noticesDiv.innerHTML = `<div class="empty">No SMS alerts received yet.</div>`;
    } else {
      noticesDiv.innerHTML = notices.slice(0, 10).map(n => `
        <div class="notice">
          <b>📱 SMS MOCK</b>
          <span>${n.message}</span>
          <small>${new Date(n.createdAt).toLocaleTimeString()} (${new Date(n.createdAt).toLocaleDateString()})</small>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Error loading dashboard data", err);
  }
}
