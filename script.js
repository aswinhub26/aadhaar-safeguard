/* ===============================
   COUNTER VALUES (STORAGE)
================================ */
function getCount(key, defaultVal) {
  return localStorage.getItem(key)
    ? parseInt(localStorage.getItem(key))
    : defaultVal;
}

let aware = getCount("aware", 1500);
let prevented = getCount("prevented", 420);
let reports = getCount("reports", 256);

/* ===============================
   COUNT-UP ANIMATION
================================ */
function animateCount(id, target) {
  let el = document.getElementById(id);
  let count = 0;
  let step = Math.ceil(target / 80);

  let interval = setInterval(() => {
    count += step;
    if (count >= target) {
      el.innerText = target;
      clearInterval(interval);
    } else {
      el.innerText = count;
    }
  }, 20);
}

/* ===============================
   OBSERVER (RUN ON SCROLL)
================================ */
let counted = false;

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    animateCount("c1", aware);
    animateCount("c2", prevented);
    animateCount("c3", reports);
  }
}, { threshold: 0.4 });

document.addEventListener("DOMContentLoaded", () => {
  observer.observe(document.querySelector(".counters"));
});

/* ===============================
   ENTER PLATFORM
================================ */
function enterPlatform() {
  document.getElementById("main").scrollIntoView({ behavior: "smooth" });
}

/* ===============================
   MODAL CONTROL
================================ */
function openModal() {
  playBeep();
  document.getElementById("modal").style.display = "flex";
  document.body.classList.add("modal-active");
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.body.classList.remove("modal-active");
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
    showToast("⚠️ Please fill all required fields");
    return;
  }

  playBeep();

  const ticketId = "ASG-" + Math.floor(100000 + Math.random() * 900000);

  reports++;
  aware += 3;
  prevented += 1;

  localStorage.setItem("reports", reports);
  localStorage.setItem("aware", aware);
  localStorage.setItem("prevented", prevented);

  document.getElementById("ticketValue").innerText = ticketId;
  document.getElementById("successPopup").style.display = "flex";

  fetch("https://script.google.com/macros/s/AKfycbysIstrS6ebX9T6AUbK-cRmS1mZxpMCrRJVpqvxzc49us-dQHKBMsYt46g4Aq9z3TtrdQ/exec", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    phone,
    scam,
    message,
    ticketId
  })
});

  setTimeout(closeSuccess, 7000);

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("scam").value = "";
  document.getElementById("message").value = "";
}

/* ===============================
   CLOSE SUCCESS
================================ */
function closeSuccess() {
  document.getElementById("successPopup").style.display = "none";
  document.getElementById("modal").style.display = "none";
  document.body.classList.remove("modal-active");
}

/* ===============================
   TOAST
================================ */
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.innerText = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ===============================
   SOUND
================================ */
function playBeep() {
  const beep = new Audio(
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAA"
  );
  beep.play().catch(() => {});
}
