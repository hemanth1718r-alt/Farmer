const API_URL = "http://localhost:3000/api";

const $ = x => document.getElementById(x);

// --- TRANSLATIONS DICTIONARY ---
const TRANSLATIONS = {
  en: {
    logo_title: "🌾 AgriQueue",
    farmer_portal: "FARMER PORTAL",
    farmer_login: "Farmer Login",
    login_sub: "Sign in using your mobile number and password to access the slot booking system.",
    mobile_lbl: "Mobile Number",
    pass_lbl: "Password",
    signin_btn: "Sign In",
    forgot_link: "Forgot Password?",
    new_farmer: "New Farmer? Register Here",
    already_account: "Already have an account? Login",
    forgot_title: "Reset Password",
    forgot_sub: "Enter your registered mobile number to receive a verification reset code.",
    send_code: "Send Reset Code",
    otp_lbl: "6-Digit Reset Code (OTP)",
    new_pass_lbl: "New Password",
    confirm_pass_lbl: "Confirm New Password",
    reset_btn: "Reset Password",
    back_to_login: "Back to Farmer Login",
    
    // Register
    reg_title: "Create Farmer Account",
    reg_sub: "Please enter your information to register. This allows booking queue slots for procurement.",
    name_lbl: "Full Name",
    perishable_lbl: "My crop is perishable / requires urgent procurement",
    create_btn: "Create Farmer Account",
    
    // Dashboard
    f_account: "FARMER ACCOUNT",
    hello: "Hello,",
    dash_desc: "Book a procurement slot, track your queue status, and monitor your payment progress live.",
    f_id: "Farmer ID",
    reg_crop: "REGISTERED CROP",
    prod_qty: "PRODUCE QUANTITY",
    mob_num: "MOBILE NUMBER",
    sms_notif: "SMS NOTIFICATIONS",
    slot_booking: "01 • SLOT BOOKING",
    book_title: "Book Procurement Slot",
    centre_lbl: "Procurement Centre",
    date_lbl: "Select Date",
    time_lbl: "Available Time Slots",
    submit_req: "Submit Procurement Request",
    my_apps: "02 • MY APPLICATIONS & STATUS",
    apps_title: "My Live Applications",
    apps_desc: "Calculated automatically. Active applications will refresh every 5 seconds.",
    sms_history: "03 • SMS LOG HISTORY",
    sms_title: "Notifications & SMS History",
    sms_desc: "Mock SMS history sent to your registered mobile number.",
    logout_btn: "Logout",
    
    // Additional fields in dashboard booking form
    crop_lbl: "Crop Type",
    qty_lbl: "Produce Quantity (kg)",
    dist_lbl: "Travel Distance (km)",
    
    // Status Tracker
    status_booked: "Slot Booked",
    status_arrived: "Arrived",
    status_weighed: "Produce Weighed",
    status_graded: "Produce Graded",
    status_paid: "Payment Processed",
    status_cancelled: "Cancelled",
    
    // Booking Form Options
    opt_choose_slot: "Choose a slot",
    opt_select_date: "Select date first",
    
    // Table headers / tags
    queue_pos: "QUEUE POSITION",
    est_wait: "EST. WAIT TIME",
    crop_type: "CROP TYPE",
    priority_status: "PRIORITY STATUS",
    cancel_btn: "Cancel Active Slot",
    
    // Dynamic text strings / Placeholders
    placeholder_phone: "Enter 10-digit mobile number",
    placeholder_pass: "Enter your password",
    placeholder_name: "Farmer's full name",
    placeholder_newpass: "Enter at least 6 characters",
    placeholder_confpass: "Re-enter new password",
    placeholder_otp: "Enter reset code"
  },
  kn: {
    logo_title: "🌾 ಅಗ್ರಿಕ್ಯೂ (AgriQueue)",
    farmer_portal: "ರೈತರ ಪೋರ್ಟಲ್",
    farmer_login: "ರೈತರ ಲಾಗಿನ್",
    login_sub: "ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ವ್ಯವಸ್ಥೆಯನ್ನು ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    mobile_lbl: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    pass_lbl: "ಪಾಸ್‌ವರ್ಡ್",
    signin_btn: "ಸೈನ್ ಇನ್",
    forgot_link: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    new_farmer: "ಹೊಸ ರೈತರೇ? ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
    already_account: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ",
    forgot_title: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    forgot_sub: "ಪರಿಶೀಲನೆ ಮರುಹೊಂದಿಸುವ ಕೋಡ್ ಪಡೆಯಲು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    send_code: "ಕೋಡ್ ಕಳುಹಿಸಿ",
    otp_lbl: "6-ಅಂಕಿಯ ಕೋಡ್ (OTP)",
    new_pass_lbl: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
    confirm_pass_lbl: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ",
    reset_btn: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    back_to_login: "ಮರಳಿ ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಿ",
    
    // Register
    reg_title: "ರೈತರ ಖಾತೆ ರಚಿಸಿ",
    reg_sub: "ನೋಂದಾಯಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ. ಇದು ಸಂಗ್ರಹಣೆಗಾಗಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಮಾಡಲು ಅನುಮತಿಸುತ್ತದೆ.",
    name_lbl: "ಪೂರ್ಣ ಹೆಸರು",
    perishable_lbl: "ನನ್ನ ಬೆಳೆ ಬೇಗನೆ ಹಾಳಾಗುವಂತದ್ದು / ತುರ್ತು ಸಂಗ್ರಹಣೆ ಅಗತ್ಯವಿದೆ",
    create_btn: "ರೈತರ ಖಾತೆ ರಚಿಸಿ",
    
    // Dashboard
    f_account: "ರೈತರ ಖಾತೆ",
    hello: "ನಮಸ್ಕಾರ,",
    dash_desc: "ಸಂಗ್ರಹಣೆ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ, ನಿಮ್ಮ ಕ್ಯೂ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಪಾವತಿ ಪ್ರಗತಿಯನ್ನು ಲೈವ್ ಆಗಿ ವೀಕ್ಷಿಸಿ.",
    f_id: "ರೈತರ ಐಡಿ",
    reg_crop: "ನೋಂದಾಯಿತ ಬೆಳೆ",
    prod_qty: "ಉತ್ಪನ್ನದ ಪ್ರಮಾಣ",
    mob_num: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    sms_notif: "ಎಸ್ಎಂಎಸ್ ಅಧಿಸೂಚನೆಗಳು",
    slot_booking: "01 • ಸ್ಲಾಟ್ ಬುಕಿಂಗ್",
    book_title: "ಸಂಗ್ರಹಣೆ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
    centre_lbl: "ಖರೀದಿ ಕೇಂದ್ರ",
    date_lbl: "ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
    time_lbl: "ಲಭ್ಯವಿರುವ ಸಮಯದ ಸ್ಲಾಟ್‌ಗಳು",
    submit_req: "ಖರೀದಿ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ",
    my_apps: "02 • ನನ್ನ ಅರ್ಜಿಗಳು ಮತ್ತು ಸ್ಥಿತಿ",
    apps_title: "ನನ್ನ ಲೈವ್ ಅರ್ಜಿಗಳು",
    apps_desc: "ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ. ಸಕ್ರಿಯ ಅರ್ಜಿಗಳು ಪ್ರತಿ 5 ಸೆಕೆಂಡಿಗೆ ನವೀಕರಣಗೊಳ್ಳುತ್ತವೆ.",
    sms_history: "03 • ಎಸ್ಎಂಎಸ್ ಇತಿಹಾಸ",
    sms_title: "ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಎಸ್ಎಂಎಸ್ ಇತಿಹಾಸ",
    sms_desc: "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾದ ಮಾದರಿ ಎಸ್ಎಂಎಸ್ ಇತಿಹಾಸ.",
    logout_btn: "ಲಾಗ್ ಔಟ್",
    
    // Additional fields in dashboard booking form
    crop_lbl: "ಬೆಳೆ ಪ್ರಕಾರ",
    qty_lbl: "ಬೆಳೆ ಪ್ರಮಾಣ (ಕೆಜಿ)",
    dist_lbl: "ಪ್ರಯಾಣದ ದೂರ (ಕಿಮೀ)",
    
    // Status Tracker
    status_booked: "ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಲಾಗಿದೆ",
    status_arrived: "ಆಗಮಿಸಲಾಗಿದೆ",
    status_weighed: "ತೂಕ ಮಾಡಲಾಗಿದೆ",
    status_graded: "ಗ್ರೇಡಿಂಗ್ ಮಾಡಲಾಗಿದೆ",
    status_paid: "ಪಾವತಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
    status_cancelled: "ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ",
    
    // Booking Form Options
    opt_choose_slot: "ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ",
    opt_select_date: "ಮೊದಲು ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
    
    // Table headers / tags
    queue_pos: "ಕ್ಯೂ ಸ್ಥಾನ",
    est_wait: "ಅಂದಾಜು ಕಾಯುವ ಸಮಯ",
    crop_type: "ಬೆಳೆ ಪ್ರಕಾರ",
    priority_status: "ಆದ್ಯತೆಯ ಸ್ಥಿತಿ",
    cancel_btn: "ಸಕ್ರಿಯ ಸ್ಲಾಟ್ ರದ್ದುಮಾಡಿ",
    
    // Dynamic text strings / Placeholders
    placeholder_phone: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    placeholder_pass: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    placeholder_name: "ರೈತರ ಪೂರ್ಣ ಹೆಸರು",
    placeholder_newpass: "ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ",
    placeholder_confpass: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮರು-ನಮೂದಿಸಿ",
    placeholder_otp: "ಕೋಡ್ ನಮೂದಿಸಿ"
  },
  hi: {
    logo_title: "🌾 एग्रीक्यू (AgriQueue)",
    farmer_portal: "किसान पोर्टल",
    farmer_login: "किसान लॉगिन",
    login_sub: "स्लॉट बुकिंग प्रणाली तक पहुंचने के लिए अपने मोबाइल नंबर और पासवर्ड का उपयोग करके साइन इन करें.",
    mobile_lbl: "मोबाइल नंबर",
    pass_lbl: "पासवर्ड",
    signin_btn: "साइन इन करें",
    forgot_link: "पासवर्ड भूल गए?",
    new_farmer: "नए किसान? यहाँ पंजीकरण करें",
    already_account: "पहले से खाता है? लॉगिन करें",
    forgot_title: "पासवर्ड रीसेट करें",
    forgot_sub: "सत्यापन रीसेट कोड प्राप्त करने के लिए अपना पंजीकृत मोबाइल नंबर दर्ज करें.",
    send_code: "रीसेट कोड भेजें",
    otp_lbl: "6-अंकों का रीसेट कोड (OTP)",
    new_pass_lbl: "नया पासवर्ड",
    confirm_pass_lbl: "नया पासवर्ड पुष्टि करें",
    reset_btn: "पासवर्ड रीसेट करें",
    back_to_login: "किसान लॉगिन पर वापस जाएं",
    
    // Register
    reg_title: "किसान खाता बनाएं",
    reg_sub: "पंजीकरण करने के लिए कृपया अपनी जानकारी दर्ज करें. यह खरीद के लिए स्लॉट बुकिंग की अनुमति देता है.",
    name_lbl: "पूरा नाम",
    perishable_lbl: "मेरी फसल जल्द खराब होने वाली है / तत्काल खरीद की आवश्यकता है",
    create_btn: "किसान खाता बनाएं",
    
    // Dashboard
    f_account: "किसान खाता",
    hello: "नमस्ते,",
    dash_desc: "खरीद स्लॉट बुक करें, अपनी कतार की स्थिति ट्रैक करें, और अपने भुगतान की प्रगति को लाइव देखें.",
    f_id: "किसान आईडी",
    reg_crop: "पंजीकृत फसल",
    prod_qty: "उत्पाद मात्रा",
    mob_num: "मोबाइल नंबर",
    sms_notif: "एसएमएस सूचनाएं",
    slot_booking: "01 • स्लॉट बुकिंग",
    book_title: "खरीद स्लॉट बुक करें",
    centre_lbl: "खरीद केंद्र",
    date_lbl: "दिनांक चुनें",
    time_lbl: "उपलब्ध समय स्लॉट",
    submit_req: "खरीद अनुरोध सबमिट करें",
    my_apps: "02 • मेरे आवेदन और स्थिति",
    apps_title: "मेरे लाइव आवेदन",
    apps_desc: "स्वचालित रूप से गणना की जाती है. सक्रिय आवेदन हर 5 सेकंड में अपडेट होंगे.",
    sms_history: "03 • एसएमएस इतिहास",
    sms_title: "सूचनाएं और एसएमएस इतिहास",
    sms_desc: "आपके पंजीकृत मोबाइल नंबर पर भेजे गए मॉक एसएमएस का इतिहास.",
    logout_btn: "लॉग आउट",
    
    // Additional fields in dashboard booking form
    crop_lbl: "फसल प्रकार",
    qty_lbl: "फसल की मात्रा (किग्रा)",
    dist_lbl: "यात्रा की दूरी (किमी)",
    
    // Status Tracker
    status_booked: "स्लॉट बुक किया गया",
    status_arrived: "पहुंच गए",
    status_weighed: "उपज तौली गई",
    status_graded: "ग्रेडिंग की गई",
    status_paid: "भुगतान संसाधित",
    status_cancelled: "रद्द किया गया",
    
    // Booking Form Options
    opt_choose_slot: "एक स्लॉट चुनें",
    opt_select_date: "पहले तारीख चुनें",
    
    // Table headers / tags
    queue_pos: "कतार में स्थान",
    est_wait: "अनुमानित प्रतीक्षा समय",
    crop_type: "फसल का प्रकार",
    priority_status: "प्राथमिकता स्थिति",
    cancel_btn: "सक्रिय स्लॉट रद्द करें",
    
    // Dynamic text strings / Placeholders
    placeholder_phone: "10-अंकों का मोबाइल नंबर दर्ज करें",
    placeholder_pass: "अपना पासवर्ड दर्ज करें",
    placeholder_name: "किसान का पूरा नाम",
    placeholder_newpass: "कम से कम 6 अक्षर दर्ज करें",
    placeholder_confpass: "नया पासवर्ड पुन: दर्ज करें",
    placeholder_otp: "रीसेट कोड दर्ज करें"
  }
};

let currentLang = localStorage.getItem("farmerLang") || "en";

// --- DYNAMIC TRANSLATION ENGINE ---
function applyLanguage() {
  const dictionary = TRANSLATIONS[currentLang];
  if (!dictionary) return;
  
  // Update select element value if selector exists
  const langSelect = $("langSelect");
  if (langSelect) {
    langSelect.value = currentLang;
  }
  
  // Translate text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dictionary[key] !== undefined) {
      el.textContent = dictionary[key];
    }
  });
  
  // Translate input placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dictionary[key] !== undefined) {
      el.placeholder = dictionary[key];
    }
  });
}

function changeLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    localStorage.setItem("farmerLang", lang);
    applyLanguage();
    
    // If on dashboard, reload data to translate status tracker values
    if ($("farmerDashboard")) {
      loadDashboardData();
      loadSlots();
    }
  }
}

// Bind changeLanguage to window object so inline event handlers work
window.changeLanguage = changeLanguage;

// PAGE ROUTING & DOM INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage();
  
  const langSelect = $("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
    });
  }

  if ($("loginForm") && !$("forgot").classList.contains("wizard-forgot")) {
    initLogin();
  }
  if ($("regForm")) {
    initRegister();
  }
  if ($("farmerDashboard")) {
    initDashboard();
  }
});

// --- CLIENT VALIDATION ---
function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function validateName(name) {
  return name && name.trim().length >= 3;
}

function validatePassword(pass) {
  return pass && pass.length >= 6;
}

// --------------------------------------------------
// FARMER LOGIN & STEP-BY-STEP PASSWORD RESET
// --------------------------------------------------
function initLogin() {
  const messageDiv = $("message");
  
  $("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    messageDiv.innerHTML = "";
    
    const phone = $("phone").value;
    const password = $("password").value;
    
    if (!validatePhone(phone)) {
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_invalid_phone">${TRANSLATIONS[currentLang].msg_invalid_phone}</div>`;
      return;
    }
    
    if (!validatePassword(password)) {
      messageDiv.innerHTML = `<div class="error" data-i18n="placeholder_pass">${TRANSLATIONS[currentLang].placeholder_pass}</div>`;
      return;
    }
    
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
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_conn_failed">${TRANSLATIONS[currentLang].msg_conn_failed}</div>`;
    }
  };

  // Bind forgot password actions
  $("btnForgot").onclick = () => {
    $("loginForm").classList.add("hidden");
    $("rowLinks").classList.add("hidden");
    $("forgot").classList.remove("hidden");
    $("fphone").value = $("phone").value;
    
    // Set to Step 1
    showResetStep(1);
  };
  
  $("btnSendCode").onclick = async () => {
    const phone = $("fphone").value;
    if (!validatePhone(phone)) {
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_invalid_phone">${TRANSLATIONS[currentLang].msg_invalid_phone}</div>`;
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
      
      // Print OTP code for testing demo
      $("demoCode").textContent = `DEMO reset code: ${d.demoCode}`;
      messageDiv.innerHTML = "";
      showResetStep(2);
    } catch (err) {
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_conn_failed">${TRANSLATIONS[currentLang].msg_conn_failed}</div>`;
    }
  };

  $("btnVerifyCode").onclick = () => {
    const code = $("rcode").value;
    if (!code || code.length !== 6 || isNaN(code)) {
      messageDiv.innerHTML = `<div class="error">Enter a valid 6-digit OTP code.</div>`;
      return;
    }
    messageDiv.innerHTML = "";
    showResetStep(3);
  };

  $("btnResetPassword").onclick = async () => {
    const phone = $("fphone").value;
    const code = $("rcode").value;
    const newPassword = $("newpass").value;
    const confirmPassword = $("confpass").value;
    
    if (!validatePassword(newPassword)) {
      messageDiv.innerHTML = `<div class="error" data-i18n="placeholder_pass">${TRANSLATIONS[currentLang].placeholder_pass}</div>`;
      return;
    }
    
    if (newPassword !== confirmPassword) {
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_pass_mismatch">${TRANSLATIONS[currentLang].msg_pass_mismatch}</div>`;
      return;
    }
    
    try {
      const r = await fetch(`${API_URL}/farmer/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, newPassword })
      });
      const d = await r.json();
      
      if (!r.ok) {
        messageDiv.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      messageDiv.innerHTML = "";
      showResetStep(4);
    } catch (err) {
      messageDiv.innerHTML = `<div class="error" data-i18n="msg_conn_failed">${TRANSLATIONS[currentLang].msg_conn_failed}</div>`;
    }
  };

  $("btnBackToLogin").onclick = () => {
    $("forgot").classList.add("hidden");
    $("loginForm").classList.remove("hidden");
    $("rowLinks").classList.remove("hidden");
    $("phone").value = "";
    $("password").value = "";
    messageDiv.innerHTML = "";
  };
}

function showResetStep(step) {
  $("step1").classList.add("hidden");
  $("step2").classList.add("hidden");
  $("step3").classList.add("hidden");
  $("step4").classList.add("hidden");
  
  $(`step${step}`).classList.remove("hidden");
}

// --------------------------------------------------
// FARMER REGISTRATION PAGE
// --------------------------------------------------
function initRegister() {
  $("regForm").onsubmit = async (e) => {
    e.preventDefault();
    const msgDiv = $("msg");
    msgDiv.innerHTML = "";
    
    const name = $("name").value;
    const phone = $("phone").value;
    const password = $("password").value;
    const perishable = $("perishable").checked;
    
    if (!validateName(name)) {
      msgDiv.innerHTML = `<div class="error">Please enter your full name (minimum 3 characters).</div>`;
      return;
    }
    
    if (!validatePhone(phone)) {
      msgDiv.innerHTML = `<div class="error" data-i18n="msg_invalid_phone">${TRANSLATIONS[currentLang].msg_invalid_phone}</div>`;
      return;
    }
    
    if (!validatePassword(password)) {
      msgDiv.innerHTML = `<div class="error" data-i18n="placeholder_pass">${TRANSLATIONS[currentLang].placeholder_pass}</div>`;
      return;
    }
    
    const data = { name, phone, password, perishable };
    
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
      msgDiv.innerHTML = `<div class="error" data-i18n="msg_conn_failed">${TRANSLATIONS[currentLang].msg_conn_failed}</div>`;
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
  $("fmobile").textContent = globalFarmer.phone;
  
  // Set date input constraints (today onwards)
  const todayStr = new Date().toISOString().slice(0, 10);
  $("date").min = todayStr;
  $("date").value = todayStr;
  
  // Bind slot loader listeners
  $("centre").onchange = loadSlots;
  $("date").onchange = loadSlots;
  
  // Bind book form submit
  $("bookForm").onsubmit = async (e) => {
    e.preventDefault();
    const bookMsg = $("bookMsg");
    bookMsg.innerHTML = "";
    
    const slot = $("slot").value;
    if (!slot) {
      bookMsg.innerHTML = `<div class="error" data-i18n="msg_select_slot">${TRANSLATIONS[currentLang].msg_select_slot}</div>`;
      return;
    }
    
    const bookingData = {
      farmerId: globalFarmer.id,
      centre: $("centre").value,
      date: $("date").value,
      slot: slot,
      crop: $("crop").value,
      quantity: Number($("quantity").value),
      distance: Number($("distance").value)
    };
    
    try {
      const r = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const d = await r.json();
      
      if (!r.ok) {
        bookMsg.innerHTML = `<div class="error">${d.message}</div>`;
        return;
      }
      
      // Success feedback
      bookMsg.innerHTML = `
        <div class="success">
          <span data-i18n="msg_booking_success">${TRANSLATIONS[currentLang].msg_booking_success}</span><br>
          <b>Application ID:</b> ${d.booking.id}<br>
          <b>Queue Position:</b> #${d.queuePosition}<br>
          <b>Estimated Waiting Time:</b> ~${d.estimatedWait} minutes
        </div>
      `;
      
      // Update quick stats view dynamically with last booking crop & qty
      $("fcrop").textContent = bookingData.crop;
      $("fqty").textContent = `${bookingData.quantity} kg`;
      
      // Update profile values in local farmer object
      globalFarmer.crop = bookingData.crop;
      globalFarmer.quantity = bookingData.quantity;
      globalFarmer.distance = bookingData.distance;
      localStorage.setItem("farmer", JSON.stringify(globalFarmer));
      
      loadDashboardData();
      loadSlots();
      
      // Reset form booking crop/qty/distance
      $("crop").value = "";
      $("quantity").value = "";
      $("distance").value = "0";
    } catch (err) {
      bookMsg.innerHTML = `<div class="error" data-i18n="msg_conn_failed">${TRANSLATIONS[currentLang].msg_conn_failed}</div>`;
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
    
    const chooseText = TRANSLATIONS[currentLang].opt_choose_slot;
    $("slot").innerHTML = `
      <option value="">${chooseText}</option>
      ${slotsList.map(s => `
        <option value="${s.slot}" ${s.full ? 'disabled' : ''}>
          ${s.slot} — ${s.full ? 'FULL' : `${s.available} available`}
        </option>
      `).join("")}
    `;
  } catch (err) {
    $("slot").innerHTML = `<option value="">${TRANSLATIONS[currentLang].opt_choose_slot}</option>`;
  }
}

async function cancelApplication(appId) {
  const dictionary = TRANSLATIONS[currentLang];
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

// Helper to load and translate statuses
function getTranslatedStatus(status) {
  const keyMap = {
    "Slot Booked": "status_booked",
    "Arrived": "status_arrived",
    "Produce Weighed": "status_weighed",
    "Produce Graded": "status_graded",
    "Payment Processed": "status_paid",
    "Cancelled": "status_cancelled"
  };
  const key = keyMap[status];
  return TRANSLATIONS[currentLang][key] || status;
}

async function loadDashboardData() {
  if (!globalFarmer) return;
  
  const dictionary = TRANSLATIONS[currentLang];
  
  try {
    // 1. Fetch applications
    const r = await fetch(`${API_URL}/bookings/farmer/${globalFarmer.id}`);
    const bookings = await r.json();
    
    // Set dynamic crop/quantity stats cards if they have a booking
    if (bookings && bookings.length > 0) {
      // Find the most recent active/non-cancelled booking to show crop/qty
      const active = bookings.find(b => b.status !== "Cancelled");
      if (active) {
        $("fcrop").textContent = active.crop;
        $("fqty").textContent = `${active.quantity} kg`;
      } else {
        $("fcrop").textContent = bookings[0].crop;
        $("fqty").textContent = `${bookings[0].quantity} kg`;
      }
    } else {
      $("fcrop").textContent = "—";
      $("fqty").textContent = "0 kg";
    }
    
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
              <span data-i18n="status_${statusName.toLowerCase().replace(" ", "_")}">${getTranslatedStatus(statusName)}</span>
            </div>
          `;
        }).join("");
        
        const isCancelable = b.status === "Slot Booked"; // FIX 6: Restrict cancellation strictly to "Slot Booked"
        
        return `
          <article class="application">
            <div class="app-top">
              <div>
                <b>${b.id}</b>
                <p>${b.centre} • ${b.date} • ${b.slot}</p>
              </div>
              <span class="pill" style="background:${b.status === 'Cancelled' ? '#ffe0e0' : b.status === 'Payment Processed' ? '#ebf8e5' : '#e9f5df'}; color:${b.status === 'Cancelled' ? '#c84d4d' : b.status === 'Payment Processed' ? '#236b3b' : '#24683a'}">
                ${getTranslatedStatus(b.status)}
              </span>
            </div>
            
            <div class="app-grid">
              <div>
                <small data-i18n="queue_pos">${dictionary.queue_pos}</small>
                <strong>${(b.status === "Cancelled" || b.status === "Payment Processed") ? "—" : `#${b.queuePosition}`}</strong>
              </div>
              <div>
                <small data-i18n="est_wait">${dictionary.est_wait}</small>
                <strong>${(b.status === "Cancelled" || b.status === "Payment Processed") ? "—" : `${b.estimatedWait} min`}</strong>
              </div>
              <div>
                <small data-i18n="crop_type">${dictionary.crop_type}</small>
                <strong>${b.crop} (${b.quantity} kg)</strong>
              </div>
              <div>
                <small data-i18n="priority_status">${dictionary.priority_status}</small>
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
              <button class="cancel" onclick="cancelApplication('${b.id}')" data-i18n="cancel_btn">${dictionary.cancel_btn}</button>
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

// Bind cancelApplication to window object so inline event handlers work
window.cancelApplication = cancelApplication;
