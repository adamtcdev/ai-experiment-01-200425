const startDate = new Date('2025-04-29');
const endDate   = new Date('2025-04-30');

const tankEl = document.getElementById('tank');
const roadEl = document.getElementById('road');
const gateEl = document.getElementById('gate');

window.addEventListener('load', () => {
  const roadW  = roadEl.clientWidth;
  const gateW  = gateEl.clientWidth;
  const tankW  = tankEl.getBoundingClientRect().width;
  const margin = 60;
  const maxX   = roadW - gateW - tankW - margin;

  const now     = Date.now();
  const totalMs = endDate - startDate;
  const elapsed = now - startDate;
  const prog    = Math.min(Math.max(elapsed / totalMs, 0), 1);
  const todayX  = prog * maxX;
  const remainMs = endDate - now;

  tankEl.style.transition = 'left 2s cubic-bezier(0.42,0,0.58,1)';
  requestAnimationFrame(() => {
    tankEl.style.left = todayX + 'px';
  });

  tankEl.addEventListener('transitionend', function goPhase2(e) {
    if (e.propertyName !== 'left') return;
    tankEl.removeEventListener('transitionend', goPhase2);

    if (remainMs > 0) {
      tankEl.style.transition = `left ${remainMs / 1000}s linear`;
      requestAnimationFrame(() => {
        tankEl.style.left = maxX + 'px';
      });
    } else {
      tankEl.style.left = maxX + 'px';
    }
  });

  updateCountdown();
  setInterval(updateCountdown, 1000);
  spawnTrees();
});

function updateCountdown() {
  const diff = endDate - Date.now();
  const cd   = document.getElementById('countdown');
  if (diff <= 0) {
    cd.textContent = '🎉 Victory! 🎉';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  cd.textContent = `Countdown to 30/4: ${d}d ${h}h ${m}m ${s}s`;
}

function spawnTrees(count = 30) {
  const dirtEl = document.getElementById('dirt');
  const roadTop = roadEl.offsetTop;
  const roadBottom = roadTop + roadEl.offsetHeight;

  for (let i = 0; i < count; i++) {
    const tree = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tree.setAttribute("viewBox", "0 0 24 40");
    tree.classList.add("tree");
    tree.style.left = Math.random() * window.innerWidth + 'px';

    let y;
    for (let j = 0; j < 10; j++) {
      y = Math.random() * (window.innerHeight - 40);
      if (y + 40 < roadTop || y > roadBottom) break;
    }
    tree.style.top = y + 'px';

    tree.innerHTML = `
      <rect x="10" y="28" width="4" height="12" fill="#654321"/>
      <circle cx="12" cy="20" r="10" fill="#228B22"/>
    `;
    dirtEl.appendChild(tree);
  }
}
