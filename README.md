# AgriQueue – Farmer Procurement Management System (SIH 2026)

AgriQueue is a queue management and procurement automation platform built for farmers and government procurement centres. This project is structured with two completely separate frontends and a unified shared backend.

---

## Directory Structure

```
AgriQueue/
│
├── FarmerSite/                # Completely separate farmer portal
│   ├── farmer-login.html      # Farmer authentication (Mobile + Password)
│   ├── farmer-register.html   # New farmer registration
│   ├── farmer-dashboard.html  # Slot booking, live queue, progress tracker
│   ├── farmer.css             # Earthy green responsive design stylesheet
│   └── farmer.js              # Client script calling backend APIs
│
├── StaffSite/                 # Completely separate admin/staff portal
│   ├── staff-login.html       # Staff login portal (admin/admin123)
│   ├── staff-dashboard.html   # Procurement management table & stats
│   ├── staff.css              # Corporate blue styling sheet
│   └── staff.js               # Client script calling backend APIs
│
├── Backend/                   # Central API server
│   ├── server.js              # Express app with priority and slot queue logic
│   ├── package.json           # Node dependencies configuration
│   └── data/
│       └── db.json            # Persistent JSON database (Mock database)
│
└── README.md                  # Startup instruction guide
```

---

## Technical Features

1. **Decoupled Architecture**: Frontends run as static portals communicating with a central Node.js backend (`http://localhost:3000`) via REST APIs.
2. **Rule-Based Priority Logic**:
   - **Priority 1 (Normal)**: Normal farmer.
   - **Priority 2**: Farmers travelling 30 km or more OR perishable crop type.
   - **Priority 3**: Farmers travelling 30 km or more AND perishable crop type.
   - **Tie-Breaker**: Chronological booking timestamp (earlier booking gets priority).
3. **Slot-Scoped Queue positions**: Queue numbers are calculated separately for each combination of **Procurement Centre + Date + Time Slot**, preventing conflict between different schedules.
4. **Live Dashboard Updates**: Auto-refresh cycles of 5 seconds dynamically load booking status updates, waiting times, and activity feed without requiring page refreshes.
5. **New Application Alerts**: Staff receives an immediate notification banner on the dashboard when a new booking is submitted in real time.
6. **Payment Complete / Paid action**: Staff can update status through `Weighed` -> `Graded` -> `Paid` (sets status to `Payment Processed` in database).

---

## How to Run the Project

### Step 1: Start the Backend Server

Open your terminal in VS Code and execute the following commands to install dependencies and run the Node.js + Express backend server:

```bash
cd Backend
npm install
node server.js
```
The backend server will launch and listen on:
`http://localhost:3000`

---

### Step 2: Launch the Farmer Portal (FarmerSite)

1. Open a new terminal or open the directory in VS Code.
2. Right-click on `FarmerSite/farmer-login.html` and select **Open with Live Server**.
3. If Live Server runs on port `5500`, the page will load at:
   `http://127.0.0.1:5500/FarmerSite/farmer-login.html` (or `http://localhost:5500/FarmerSite/farmer-login.html`)

*(Note: There are absolutely no links to the staff portal on this site.)*

---

### Step 3: Launch the Staff Portal (StaffSite)

1. Right-click on `StaffSite/staff-login.html` and select **Open with Live Server**.
2. If Live Server runs on port `5500` (or `5501` if port `5500` is occupied), the page will load at:
   `http://127.0.0.1:5501/StaffSite/staff-login.html` (or `http://localhost:5501/StaffSite/staff-login.html`)

*(Note: Staff credentials: Username `admin`, Password `admin123`. There are absolutely no links to the farmer portal on this site.)*
