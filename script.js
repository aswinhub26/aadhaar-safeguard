document.addEventListener("DOMContentLoaded", () => {

const beep = new Audio(
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
);

/* ENTER PLATFORM */
window.enterPlatform = function(){
  beep.play();
  document.getElementById("main")
    .scrollIntoView({behavior:"smooth"});
}

/* REVEAL ANIMATION */
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
},{threshold:0.2});

sections.forEach(sec=>observer.observe(sec));

/* COUNTERS */
let started=false;
function run(id,target){
  let c=0;
  const i=setInterval(()=>{
    c+=target/80;
    if(c>=target){c=target;clearInterval(i)}
    document.getElementById(id).innerText=Math.floor(c);
  },20);
}

const counterObs=new IntersectionObserver(e=>{
  if(e[0].isIntersecting && !started){
    started=true;
    run("c1",1500);
    run("c2",420);
  }
},{threshold:0.4});

counterObs.observe(document.querySelector(".counters"));

/* REPORT LOGIC */
let reports = localStorage.getItem("reports") || 230;
document.getElementById("c3").innerText = reports;

window.openModal = function(){
  beep.play();
  document.getElementById("modal").style.display="flex";
}

window.closeModal = function(){
  document.getElementById("modal").style.display="none";
  document.getElementById("successMsg").style.display="none";
}

window.submitReport = function(){
  beep.play();

  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const scam=document.getElementById("scam").value;

  if(name===""||email===""||phone===""||scam===""){
    alert("Please fill all required fields");
    return;
  }

  reports++;
  localStorage.setItem("reports",reports);
  document.getElementById("c3").innerText=reports;

  document.getElementById("successMsg").style.display="block";
}

});
