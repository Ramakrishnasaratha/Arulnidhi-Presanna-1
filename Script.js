// script.js
// Personalized birthday page for "Arulnidhi Presanna"

const nameSpan = document.getElementById('name');
const celebrateBtn = document.getElementById('celebrateBtn');
const muteBtn = document.getElementById('muteBtn');
const tune = document.getElementById('tune');
const title = document.getElementById('title');

// If you want to change name programmatically, do it here:
const PERSON_NAME = "Arulnidhi Presanna";
nameSpan.textContent = PERSON_NAME;
document.getElementById('big-wish').textContent = `Wishing you a day full of love & joy, ${PERSON_NAME}!`;
document.getElementById('personal-line').textContent = `May your year sparkle as bright as you do, ${PERSON_NAME} ✨`;

// small sound: use WebAudio to play a simple happy chord (no external files)
let isMuted = true; // start muted to avoid autoplay problems
muteBtn.textContent = '🔈 Sound';
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? '🔈 Sound' : '🔊 Unmute';
  if (!isMuted) {
    playMelody();
  }
});

// celebrate button triggers confetti + a title pulse
celebrateBtn.addEventListener('click', () => {
  fireConfetti();
  flashTitle();
  if (!isMuted) playMelody();
});

// small title pulse
function flashTitle(){
  title.style.transition = 'transform .35s ease';
  title.style.transform = 'scale(1.06)';
  setTimeout(()=> title.style.transform = 'scale(1)', 350);
}

/* ---------------------------
  Confetti (lightweight canvas)
   - creates many particles with random colors
----------------------------*/
function fireConfetti(){
  const duration = 3500;
  const end = Date.now() + duration;
  (function frame(){
    confetti({
      particleCount: 18,
      spread: 70,
      origin: { y: 0.45 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/* minimal confetti implementation (no external lib) */
(function(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];

  function rand(min,max){ return Math.random()*(max-min)+min; }
  const palette = ['#FFD166','#EF476F','#06D6A0','#118AB2','#B5838D','#FFB4A2'];

  function confetti(opts){
    const count = opts.particleCount || 20;
    for(let i=0;i<count;i++){
      particles.push({
        x: (opts.origin && opts.origin.x) ? opts.origin.x*W : rand(0,W),
        y: (opts.origin && opts.origin.y) ? opts.origin.y*H : rand(0,H/2),
        vx: rand(-6,6),
        vy: rand(-8, -2),
        size: rand(6,14),
        rot: rand(0,360),
        spin: rand(-0.2,0.2),
        color: palette[Math.floor(rand(0,palette.length))],
        life: rand(2800,4200),
        birth: Date.now()
      });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  let running = false;
  function loop(){
    const now = Date.now();
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      const t = (now - p.birth);
      if (t > p.life || p.y > H + 40) { particles.splice(i,1); continue; }
      // physics
      p.vy += 0.12; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      // draw
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
    }
    if (particles.length>0) requestAnimationFrame(loop);
    else running = false;
  }

  // expose global confetti function
  window.confetti = confetti;
})();

/* ---------------------------
  Simple melody using WebAudio API
----------------------------*/
function playMelody(){
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const notes = [523.25,659.25,783.99,1046.5]; // C5 E5 G5 C6 (simple joyful arpeggio)
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const start = now + i*0.18;
      const dur = 0.28;
      g.gain.linearRampToValueAtTime(0.14, start+0.01);
      g.gain.exponentialRampToValueAtTime(0.001, start+dur);
      o.start(start);
      o.stop(start+dur+0.02);
    });

    // small chord at end
    setTimeout(()=> {
      const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const o3 = ctx.createOscillator();
      const g = ctx.createGain();
      o1.frequency.value = 523.25; o2.frequency.value = 659.25; o3.frequency.value = 783.99;
      o1.connect(g); o2.connect(g); o3.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.0001;
      const s = ctx.currentTime;
      g.gain.linearRampToValueAtTime(0.16, s+0.01);
      g.gain.exponentialRampToValueAtTime(0.001, s+1.2);
      o1.start(s); o2.start(s); o3.start(s);
      o1.stop(s+1.3); o2.stop(s+1.3); o3.stop(s+1.3);
    }, 900);

  } catch (e) {
    console.warn('Audio not supported', e);
  }
}

// small auto confetti on first load (only if user clicks celebrate later; we keep page calm initially)
