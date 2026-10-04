// Load ../../vendor/three.min.js before this file if your game uses Three.js.
var ctx = document.getElementById('canvas').getContext('2d');
var player = {x:400,y:250}, paused = true, last = 0;
function reset() { player.x=400; player.y=250; paused=false; }
PlayDeck.on(function (action) {
  if (action==='back') PlayDeck.exitGame();
  if (action==='select') paused=false;
  if (action==='pause') paused=!paused;
});
document.getElementById('play').onclick=function(){paused=false;};
document.getElementById('pause').onclick=function(){paused=!paused;};
document.getElementById('restart').onclick=reset;
document.getElementById('fullscreen').onclick=function(){PlayDeck.fullscreen(document.getElementById('stage'));};
document.addEventListener('visibilitychange',function(){if(document.hidden)paused=true;});
var keys={};
document.addEventListener('keydown',function(e){if(e.target.tagName==='BUTTON'||e.target.tagName==='A')return;if(e.key.startsWith('Arrow')){e.preventDefault();keys[e.key]=true;}});
document.addEventListener('keyup',function(e){keys[e.key]=false;});
window.addEventListener('blur',function(){keys={};paused=true;});
function frame(time){var dt=Math.min((time-last)/1000,.05);last=time;
  if(!paused){player.x+=(PlayDeck.axes[0]+(keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0))*200*dt;player.y+=(PlayDeck.axes[1]+(keys.ArrowDown?1:0)-(keys.ArrowUp?1:0))*200*dt;player.x=Math.max(15,Math.min(785,player.x));player.y=Math.max(15,Math.min(485,player.y));}
  ctx.fillStyle='#19271e';ctx.fillRect(0,0,800,500);ctx.fillStyle='#ccf580';ctx.beginPath();ctx.arc(player.x,player.y,15,0,Math.PI*2);ctx.fill();
  document.getElementById('status').textContent=paused?'Tap Play to start':'Drag the joystick to move';requestAnimationFrame(frame);
}requestAnimationFrame(frame);
