const API_URL = "http://localhost:3000/api";

const $ = x => document.getElementById(x);

// PAGE ROUTING & DOM INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if ($("loginForm")) {
    initLogin();
  }
  if ($("staffDashboard")) {
    initDashboard();
  }
});

// --------------------------------------------------
// STAFF LOGIN PAGE
// --------------------------------------------------
function initLogin() {
  $("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const username = $("username").value;
    const password = $("password").value;
    const msgDiv = $("msg");
    
    try {
      const r = await fetch(`${API_URL}/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const d = await r.json();
      
      if (!r.ok) {
        msgDiv.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      sessionStorage.setItem("staff", "1");
      msgDiv.innerHTML = `<div class="success">Login successful! Redirecting...</div>`;
      setTimeout(() => {
        location.href = "staff-dashboard.html";
      }, 800);
    } catch (err) {
      msgDiv.innerHTML = `<div class="error">Unable to connect to backend server.</div>`;
    }
  };
}

// --------------------------------------------------
// STAFF DASHBOARD PAGE
// --------------------------------------------------
let knownApplicationIds = new Set();
let isInitialLoad = true;

function initDashboard() {
  if (sessionStorage.getItem("staff") !== "1") {
    location.href = "staff-login.html";
    return;
  }
  
  // Set date input to today
  $("date").value = new Date().toISOString().slice(0, 10);
  
  // Bind events
  $("centre").onchange = loadAll;
  $("date").onchange = loadAll;
  $("btnRefresh").onclick = loadAll;
  
  $("btnLogout").onclick = () => {
    sessionStorage.removeItem("staff");
    location.href = "staff-login.html";
  };
  
  // Initial loads
  loadAll();
  
  // Auto refresh stats, queue, feed every 5 seconds
  setInterval(() => {
    loadAll();
  }, 5000);
}

async function loadAll() {
  await Promise.all([
    loadStats(),
    loadQueue(),
    loadActivityFeed()
  ]);
}

async function loadStats() {
  try {
    const r = await fetch(`${API_URL}/staff/stats`);
    const d = await r.json();
    if (r.ok) {
      $("farmers").textContent = d.farmers;
      $("applications").textContent = d.applications;
      $("waiting").textContent = d.waiting;
      $("served").textContent = d.served;
      $("arrived").textContent = d.arrived;
    }
  } catch (err) {
    console.error("Error loading stats", err);
  }
}

async function loadQueue() {
  const centre = $("centre").value;
  const date = $("date").value;
  if (!date) return;
  
  try {
    const r = await fetch(`${API_URL}/staff/applications?centre=${encodeURIComponent(centre)}&date=${date}`);
    const applications = await r.json();
    
    if (!r.ok) {
      $("table").innerHTML = `<div class="error">Error loading queue data.</div>`;
      return;
    }
    
    // Check for new applications (added while dashboard is open)
    const currentIds = new Set(applications.map(app => app.id));
    if (!isInitialLoad) {
      for (const app of applications) {
        if (!knownApplicationIds.has(app.id)) {
          showNewApplicationBanner(app);
        }
      }
    }
    knownApplicationIds = currentIds;
    isInitialLoad = false;
    
    // Render applications table
    const tableDiv = $("table");
    if (!applications || applications.length === 0) {
      tableDiv.innerHTML = `<div class="empty">No live active applications for this centre/date. When a farmer books a slot, it will appear here.</div>`;
      return;
    }
    
    tableDiv.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>QUEUE #</th>
              <th>FARMER DETAILS</th>
              <th>APPLICATION ID</th>
              <th>TIME SLOT</th>
              <th>CROP & QTY</th>
              <th>STATUS</th>
              <th>PRIORITY STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${applications.map(b => {
              // Classify priority styles
              let prioClass = "priority-normal";
              if (b.priorityScore === 3) prioClass = "priority-high";
              else if (b.priorityScore === 2) prioClass = "";
              
              // Set up status pills
              let statusPillColor = "#e9f2ff";
              let statusTextColor = "#285f9b";
              if (b.status === "Arrived") {
                statusPillColor = "#fef9c3";
                statusTextColor = "#854d0e";
              } else if (b.status === "Produce Weighed") {
                statusPillColor = "#dbeafe";
                statusTextColor = "#1e40af";
              } else if (b.status === "Produce Graded") {
                statusPillColor = "#f3e8ff";
                statusTextColor = "#6b21a8";
              }
              
              return `
                <tr>
                  <td>
                    <strong class="q">#${b.queuePosition}</strong>
                    <small>~${b.estimatedWait} min wait</small>
                  </td>
                  <td>
                    <b>${b.farmerName}</b>
                    <small>ID: ${b.farmerId}</small>
                    <small>Ph: ${b.phone}</small>
                  </td>
                  <td>
                    <b>${b.id}</b>
                    <small>${b.centre}</small>
                  </td>
                  <td>
                    <b>${b.slot}</b>
                    <small>Date: ${b.date}</small>
                  </td>
                  <td>
                    <b>${b.crop}</b>
                    <small>${b.quantity} kg</small>
                  </td>
                  <td>
                    <span class="pill" style="background: ${statusPillColor}; color: ${statusTextColor};">
                      ${b.status}
                    </span>
                  </td>
                  <td>
                    <span class="priority-badge ${prioClass}">
                      ${b.priorityReason}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      ${b.status === "Slot Booked" ? `
                        <button class="btn-call" onclick="callFarmer('${b.id}')">📢 Call</button>
                      ` : ''}
                      <button onclick="updateStatus('${b.id}', 'Produce Weighed')">Weighed</button>
                      <button onclick="updateStatus('${b.id}', 'Produce Graded')">Graded</button>
                      <button class="btn-pay" onclick="updateStatus('${b.id}', 'Payment Processed')">💰 Paid</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Error loading queue", err);
  }
}

async function loadActivityFeed() {
  try {
    const r = await fetch(`${API_URL}/staff/notifications`);
    const notifications = await r.json();
    const feedDiv = $("feed");
    
    if (!r.ok || !notifications || notifications.length === 0) {
      feedDiv.innerHTML = `<div class="empty">No events in the activity feed.</div>`;
      return;
    }
    
    feedDiv.innerHTML = notifications.slice(0, 10).map(n => `
      <div class="feed">
        <b>📱 SMS MOCK</b>
        <span>Phone: ${n.phone}</span>
        <p>${n.message}</p>
        <small>${new Date(n.createdAt).toLocaleTimeString()}</small>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading activity feed", err);
  }
}

function showNewApplicationBanner(app) {
  const container = $("alertBannerContainer");
  
  // Check if banner for this app already exists to prevent duplicate banners
  if ($(`banner_${app.id}`)) return;
  
  const banner = document.createElement("div");
  banner.id = `banner_${app.id}`;
  banner.className = "notification-banner";
  banner.innerHTML = `
    <div>
      <strong>✨ NEW APPLICATION RECEIVED:</strong>
      Farmer <b>${app.farmerName}</b> | 
      Application: <b>${app.id}</b> | 
      Slot: <b>${app.slot}</b> | 
      Queue: <b>#${app.queuePosition}</b> | 
      Crop: <b>${app.crop}</b> (${app.quantity} kg) | 
      Status: <span class="pill" style="background:#e0f2fe;color:#0369a1;padding:2px 6px;font-size:9px">${app.status}</span>
    </div>
    <button onclick="this.parentElement.remove()" style="margin-left: 20px;">Dismiss</button>
  `;
  container.appendChild(banner);
  
  // Auto-remove banner after 15 seconds
  setTimeout(() => {
    if (banner && banner.parentElement) {
      banner.remove();
    }
  }, 15000);
}

async function callFarmer(bookingId) {
  try {
    const r = await fetch(`${API_URL}/staff/applications/${bookingId}/call`, {
      method: "PUT"
    });
    const d = await r.json();
    alert(d.message);
    loadAll();
  } catch (err) {
    alert("Failed to call farmer.");
  }
}

async function updateStatus(bookingId, status) {
  try {
    const r = await fetch(`${API_URL}/staff/applications/${bookingId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const d = await r.json();
    
    if (!r.ok) {
      alert(d.message);
      return;
    }
    
    loadAll();
  } catch (err) {
    alert("Failed to update status.");
  }
}
