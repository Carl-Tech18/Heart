// Time-based greeting
const hour = new Date().getHours();
let message = "Hello, lovely soul ❤️";
if (hour < 12) message = "Good morning, sunshine ☀️";
else if (hour < 18) message = "Good afternoon, sweetheart 💕";
else message = "Good evening, my heart 🌙";
document.getElementById("greeting").innerText = message;

// Clickable heart messages
function showLoveMessage() {
  const messages = [
    "You make my heart smile! 💖",
    "Just thinking of you. 💭❤️",
    "Sending virtual hugs! 🤗",
    "You light up my world! ✨",
    "Forever in my heart. 💘"
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("love-message").innerText = msg;
  document.getElementById("love-message").style.display = "block";
}

// Falling hearts animation
setInterval(() => {
  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = `${Math.random() * 20 + 20}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}, 300);

// Heart trail cursor effect
document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.className = 'heart-trail';
  trail.innerHTML = '❤️';
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 1000);
});
