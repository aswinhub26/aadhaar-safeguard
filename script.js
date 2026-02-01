/* ===============================
   COUNTER HELPERS
================================ */
function getCount(key, defaultVal) {
  const v = localStorage.getItem(key);
  return v ? parseInt(v, 10) : defaultVal;
}

let aware = getCount("aware", 1500);
let prevented = getCount("prevented", 420);
let reports = getCount("reports", 256);

/* ===============================
   ANIMATED COUNTERS
================================ */
function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 60));

  const t = setInterval(() => {
    cur += step;
    if (cur >= target) {
      cur = target;
      clearInterval(t);
    }
    el.innerText = cur;
  }, 20);
}

function updateCounters() {
  animateCount("c1", aware);
  animateCount("c2", prevented);
  animateCount("c3", reports);
}

document.addEventListener("DOMContentLoaded", updateCounters);

/* ===============================
   ENTER PLATFORM
================================ */
function enterPlatform() {
  const m = document.getElementById("main");
  if (m) m.scrollIntoView({ behavior: "smooth" });
}

/* ===============================
   MODAL
================================ */
function openModal() {
  const m = document.getElementById("modal");
  if (m) m.style.display = "flex";
}

function closeModal() {
  const m = document.getElementById("modal");
  if (m) m.style.display = "none";
}

/* ===============================
   SUCCESS POPUP
================================ */
function closeSuccess() {
  const s = document.getElementById("successPopup");
  if (s) s.style.display = "none";
}

/* ===============================
   SUBMIT REPORT
================================ */
function submitReport() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const scam = document.getElementById("scam").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !phone || !scam || !message) {
    alert("Please fill all required fields");
    return;
  }

  const ticketId = "ASG-" + Math.floor(100000 + Math.random() * 900000);

  /* Update local counters */
  reports++;
  aware += 3;
  prevented += 1;

  localStorage.setItem("reports", reports);
  localStorage.setItem("aware", aware);
  localStorage.setItem("prevented", prevented);

  updateCounters();

  /* Send to Google Sheets (GitHub Pages only) */
  fetch("https://script.google.com/macros/s/AKfycbzpZs-3l2RsK3_qKtvW3vh-zmHqS9qYVXxpjOhkQBWFjkvkL5wZDEGNzpPp-lu8i9NDfQ/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, scam, message, ticketId })
  });

  /* Show success popup */
  document.getElementById("ticketValue").innerText = ticketId;
  const popup = document.getElementById("successPopup");
  popup.style.display = "flex";

  /* AUTO CLOSE AFTER 7 SECONDS 🔥 */
  setTimeout(() => {
    popup.style.display = "none";
  }, 7000);

  /* Clear form */
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("scam").value = "";
  document.getElementById("message").value = "";
}
