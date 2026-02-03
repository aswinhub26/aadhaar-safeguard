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
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 80));

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.innerText = target;
      clearInterval(interval);
    } else {
      el.innerText = current;
    }
  }, 20);
}

function updateCountersInstant() {
  document.getElementById("c1").innerText = aware;
  document.getElementById("c2").innerText = prevented;
  document.getElementById("c3").innerText = reports;
}

/* ===============================
   OBSERVER (RUN ON SCROLL ONCE)
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
  const counters = document.querySelector(".counters");
  if (counters) observer.observe(counters);
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

  // update values
  reports++;
  aware += 3;
  prevented += 1;

  localStorage.setItem("reports", reports);
  localStorage.setItem("aware", aware);
  localStorage.setItem("prevented", prevented);

  // update UI immediately
  updateCountersInstant();

  // success popup
  document.getElementById("ticketValue").innerText = ticketId;
  document.getElementById("successPopup").style.display = "flex";

  // backend (Sheets)
  fetch("https://script.google.com/macros/s/AKfycbysIstrS6ebX9T6AUbK-cRmS1mZxpMCrRJVpqvxzc49us-dQHKBMsYt46g4Aq9z3TtrdQ/exec", {
  method: "POST",
  body: JSON.stringify({
    name,
    email,
    phone,
    scam,
    message,
    ticketId
  })
});


  // auto close success
  setTimeout(closeSuccess, 7000);

  // reset form
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
/* ===============================
   LIVE SCAM CHECKER LOGIC
================================ */
function analyzeScam(){
  const text = document.getElementById("scamInput").value.toLowerCase();
  if(!text){
    showToast("⚠️ Paste a message to analyze");
    return;
  }

  document.getElementById("resultBox").style.display="none";
  document.getElementById("scanner").style.display="block";

  setTimeout(()=>{
    let score = 0;
    let reasons = [];

    const rules = [
      { key:["otp"], points:30, reason:"Mentions OTP"},
      { key:["urgent","immediately","within"], points:20, reason:"Creates urgency"},
      { key:["aadhaar","kyc"], points:25, reason:"Mentions Aadhaar/KYC"},
      { key:["http","bit.ly","tinyurl"], points:25, reason:"Suspicious link detected"},
    ];

    rules.forEach(rule=>{
      rule.key.forEach(word=>{
        if(text.includes(word)){
          score += rule.points;
          reasons.push(rule.reason);
        }
      });
    });

    score = Math.min(score,100);

    showResult(score,reasons);
    document.getElementById("scanner").style.display="none";
  },1800);
}

function showResult(score,reasons){
  const title = document.getElementById("riskTitle");
  const fill = document.getElementById("riskFill");
  const desc = document.getElementById("riskDesc");
  const list = document.getElementById("riskReasons");

  list.innerHTML="";
  reasons.forEach(r=>{
    const li=document.createElement("li");
    li.textContent=r;
    list.appendChild(li);
  });

  if(score<=30){
    title.textContent="🟢 Low Risk";
    fill.style.background="#00e676";
    desc.textContent="No major scam indicators found. Still stay alert.";
  }else if(score<=60){
    title.textContent="🟡 Suspicious";
    fill.style.background="#ffeb3b";
    desc.textContent="Some scam patterns detected. Do not share OTP.";
  }else{
    title.textContent="🔴 High Risk Scam";
    fill.style.background="#ff5252";
    desc.textContent="Strong scam indicators found. Avoid interaction.";
  }

  fill.style.width = score + "%";
  document.getElementById("resultBox").style.display="block";
}
/* ===============================
   ADVANCED USER EMAIL (AWARENESS)
================================ */
function emailIssueAdvanced(){
  const title = document.getElementById("riskTitle").innerText;
  const desc = document.getElementById("riskDesc").innerText;

  const reasons = Array.from(
    document.querySelectorAll("#riskReasons li")
  ).map(li => "- " + li.innerText).join("\n");

  const timestamp = new Date().toLocaleString();
  const userAgent = navigator.userAgent;

  const body = `
Hello Aadhaar SafeGuard Team,

I am voluntarily reporting a suspicious message for awareness purposes.

==============================
SCAM ANALYSIS SUMMARY
==============================
Result      : ${title}
Description : ${desc}

Indicators:
${reasons}

==============================
ADDITIONAL INFO
==============================
Reported On : ${timestamp}
Device Info : ${userAgent}

⚠️ Note:
This email is sent manually by the user using their own email client.
No Aadhaar SafeGuard system has stored or transmitted my data.

(If required, I have attached the downloaded PDF report.)

Regards,
Concerned Citizen
`;

  const subject = "User-Reported Aadhaar Scam (Awareness Submission)";

  const mailto = `mailto:aswinhub26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
