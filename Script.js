// script.js for Advanced Birthday Wish (name preset: ArulnidhiPresanna)
const $ = s => document.querySelector(s);
const confettiCanvas = $('#confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let W, H;
function resize(){
  W = confettiCanvas.width = confettiCanvas.clientWidth * devicePixelRatio;
  H = confettiCanvas.height = confettiCanvas.clientHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
new ResizeObserver(resize).observe(confettiCanvas);

// Typewriter
const tw = $('#tw');
let twText = 'Wishing you joy, laughter and all the cake you can eat! 🎂';
function typeWriter(text, el, speed=40){
  el.textContent='';
  let i=0;
  const t = setInterval(()=>{
    el.textContent = text.slice(0, i+1);
    i++;
    if(i>=text.length) clearInterval(t);
  }, speed);
}
typeWriter(twText, tw);

// Cake blow
const flame = $('#flame');
const candle = $('#candle');
let flameOn = true;
function blowCandles(){
  if(!flameOn) return;
  flame.style.transition = 'transform 800ms ease, opacity 800ms ease';
  flame.style.transform = 'translateX(-40px) scaleY(0.1)';
  flame.style.opacity = '0';
  candle.animate([
    { transform: 'translateX(-50%) rotate(0deg)' },
    { transform: 'translateX(-50%) rotate(-8deg)' },
    { transform: 'translateX(-50%) rotate(6deg)' },
    { transform: 'translateX(-50%) rotate(0deg)' }
  ],{duration:900,iterations:1,easing:'ease-out'});
  flameOn=false;
  launchConfetti(120);
  typeWriter('A wish has been made... 🎉', tw, 40);
}
$('#blowBtn').addEventListener('click', blowCandles);

// Confetti
const confettiParticles = [];
function rand(min,max){return Math.random()*(max-min)+min}
function launchConfetti(n=80){
  for(let i=0;i<n;i++){
    confettiParticles.push({
      x: rand(0, confettiCanvas.clientWidth),
      y: rand(-20, confettiCanvas.clientHeight/2),
      r: rand(6,12),
      d: rand(10,30),
      tilt: rand(-10,10),
      color: `hsl(${Math.floor(rand(0,360))},80%,60%)`,
      speedY: rand(1,4),
      speedX: rand(-1,1),
      rot: rand(0,360),
      rotSpeed: rand(-6,6)
    });
  }
}
function renderConfetti(){
  ctx.clearRect(0,0,confettiCanvas.clientWidth, confettiCanvas.clientHeight);
  for(let i=confettiParticles.length-1;i>=0;i--){
    const p = confettiParticles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.tilt += 0.4;
    p.rot += p.rotSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot*Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
    if(p.y > confettiCanvas.clientHeight + 50) confettiParticles.splice(i,1);
  }
  requestAnimationFrame(renderConfetti);
}
renderConfetti();
$('#confettiBtn').addEventListener('click', ()=>launchConfetti(100));

// Balloons
const card = document.querySelector('.card');
const balloonRange = $('#balloonRange');
const balloonCountLabel = $('#balloonCount');
function makeBalloon(color){
  const b = document.createElement('div');
  b.className='balloon';
  b.style.background = `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.7), ${color})`;
  b.style.left = rand(6,92)+'%';
  b.style.bottom = rand(-40, -10)+'px';
  b.style.width = rand(48,96)+'px';
  b.style.height = parseInt(b.style.width*1.3)+'px';
  const s = document.createElement('div'); s.className='string'; b.appendChild(s);
  card.appendChild(b);
  const dur = rand(9000,22000);
  b.animate([
    { transform: `translateY(0) rotate(0deg)` },
    { transform: `translateY(-${card.clientHeight + 200}px) rotate(20deg)` }
  ],{duration:dur,iterations:1,easing:'linear'}).onfinish=()=>b.remove();
}
function populateBalloons(n){
  document.querySelectorAll('.balloon').forEach(x=>x.remove());
  for(let i=0;i<n;i++){
    setTimeout(()=>{
      makeBalloon(['#ffd166','#ef476f','#06d6a0','#8338ec','#ffd1dc'][i%5]);
    }, i*300);
  }
}
populateBalloons(parseInt(balloonRange.value));
balloonRange.addEventListener('input', ()=>{
  balloonCountLabel.textContent = balloonRange.value;
  populateBalloons(parseInt(balloonRange.value));
});

// Theme color
const themeColor = $('#themeColor');
themeColor.addEventListener('input', ()=>{
  document.documentElement.style.setProperty('--accent', themeColor.value);
});

// Name & message
const nameInput = $('#nameInput');
const msgInput = $('#msgInput');
const namePreview = $('#namePreview');
nameInput.value = 'ArulnidhiPresanna';
namePreview.textContent = 'To: ArulnidhiPresanna';
$('#title').textContent = `Happy Birthday, ArulnidhiPresanna!`;
nameInput.addEventListener('input', ()=>{
  const v = nameInput.value.trim() || 'You';
  namePreview.textContent = 'To: ' + v;
  $('#title').textContent = `Happy Birthday, ${v}!`;
});
msgInput.addEventListener('input', ()=>{
  const v = msgInput.value.trim();
  twText = v || 'Wishing you joy, laughter and all the cake you can eat! 🎂';
  typeWriter(twText, tw);
});

// Melody
let audioCtx = null; let playing=false; let oscNodes=[];
function playMelody(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(playing){
    oscNodes.forEach(n=>n.stop());
    oscNodes=[]; playing=false; $('#musicBtn').textContent='Play Melody';
    return;
  }
  playing=true; $('#musicBtn').textContent='Stop Melody';
  const notes = [523.25,659.25,783.99,523.25,783.99,659.25,587.33];
  let t=0;
  notes.forEach((freq,i)=>{
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.value = 0.0001;
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + t);
    gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + t + 0.02);
    gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + t + 0.5);
    osc.stop(audioCtx.currentTime + t + 0.6);
    oscNodes.push(osc);
    t += 0.5;
  });
  setTimeout(()=>{playing=false; $('#musicBtn').textContent='Play Melody'; oscNodes=[];}, (t+0.2)*1000);
}
$('#musicBtn').addEventListener('click', playMelody);

// Keyboard accessibility
$('#blowBtn').addEventListener('keyup',(e)=>{if(e.key==='Enter') blowCandles()});

// initial confetti
launchConfetti(60);

// debugging API
window._birthday = { blow: blowCandles, confetti: launchConfetti };
