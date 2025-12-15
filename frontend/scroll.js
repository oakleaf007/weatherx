const scroll= 160;
const container= document.querySelector(".hourly-container");
document.querySelector(".scroll-btn.left").addEventListener('click',()=>{
    container.scrollBy({left: -scroll, behavior:'smooth'});
});

document.querySelector(".scroll-btn.right").addEventListener("click", ()=>{
    container.scrollBy({left: scroll, behavior:'smooth'});
});

const days = document.querySelectorAll('.days-widget .day');

document.querySelectorAll(".day").forEach(btn => {
  btn.addEventListener("click", () => {
    // highlight active
    document.querySelectorAll(".day").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const idx = parseInt(btn.dataset.day);
    renderHourly(idx);
  });
});

