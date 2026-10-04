// Copy this directory to games/your-game. Three.js is available locally at
// ../../vendor/three.min.js (load it before this script if your game needs it).
var ctx=document.getElementById('canvas').getContext('2d');
ctx.fillStyle='#19271e';ctx.fillRect(0,0,800,500);
ctx.fillStyle='#ccf580';ctx.font='28px sans-serif';ctx.fillText('Your next game starts here.',180,250);
PlayDeck.on(function(action){if(action==='back')location.href='../../index.html';/* Handle select, pause and directions. Read PlayDeck.axes for analog input. */});
document.getElementById('fullscreen').onclick=function(){PlayDeck.fullscreen(document.getElementById('stage'));};
