const canvas = document.getElementById('skill-canvas');
const ctx = canvas.getContext('2d');
const rubySpan = document.getElementById('ruby-span');
const gravity = 0.01;

const rubyMap = [
  { x: 0, y: 27 },
  { x: 13, y: 15 },

  { x: 38, y: 15 },

  { x: 50, y: 27 },
  { x: 25, y: 50 },

  { x: 0, y: 27 },

  { x: 50, y: 27 },
  { x: 37, y: 15 },

  { x: 37, y: 27 },
  { x: 25, y: 50 },

  { x: 13, y: 27 },
  { x: 13, y: 15 },

  { x: 13, y: 27 },
  { x: 25, y: 15 },
  { x: 37, y: 27 }
];

class Ruby {
  constructor(x,y) {
    this.pos = {x, y};
    this.vel = { x: 0, y: 0 };
    this.radius = 25;
    this.mass = 1;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = 0.01 - Math.random() * 0.02;
    this.resting = false;
    this.strokeStyle = '#bbf7d0'
  }

  update() {
    if (this.resting) return;

    this.vel.y += gravity * this.mass;

    this.pos.y += this.vel.y;
    this.pos.x += this.vel.x;
    this.angle += this.angularVelocity;

    if (this.pos.y > canvas.height - this.radius) {
      this.pos.y = canvas.height - this.radius;
      this.vel.y *= -0.6;
    }

    if (Math.abs(this.vel.y) < 0.005 && Math.abs(this.pos.y - (canvas.height - this.radius)) < 1) {
      this.vel.y = 0;
      this.vel.x = 0;
      this.angularVelocity = 0;
      this.resting = true;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle || 0);

    ctx.beginPath();
    ctx.moveTo(rubyMap[0].x - this.radius, rubyMap[0].y - this.radius);
    for (let i = 1; i < rubyMap.length; i++) {
      ctx.lineTo(rubyMap[i].x - this.radius, rubyMap[i].y - this.radius);
    }
    ctx.strokeStyle = '#bbf7d0';
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeStyle;

    ctx.stroke();

    ctx.restore();
  }
}

const rubies = [];

rubySpan.addEventListener('mouseenter', () => {
  const x = Math.random() * (canvas.width - 50) + 25;
  rubies.push(new Ruby(x, -100));
});

function checkCollisions(rubies) {
  for (let i = 0; i < rubies.length; i++) {
    for (let j = i + 1; j < rubies.length; j++) {
      const a = rubies[i];
      const b = rubies[j];

      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.radius + b.radius;

      if (distance < minDist) {
        const nx = dx / distance;
        const ny = dy / distance;

        const overlap = minDist - distance;
        a.pos.x -= nx * overlap / 2;
        a.pos.y -= ny * overlap / 2;
        b.pos.x += nx * overlap / 2;
        b.pos.y += ny * overlap / 2;

        const v1 = a.vel.x * nx + a.vel.y * ny;
        const v2 = b.vel.x * nx + b.vel.y * ny;

        const m1 = a.mass;
        const m2 = b.mass;

        const optimizedP = 2 * (v1 - v2) / (m1 + m2);

        a.vel.x -= optimizedP * m2 * nx;
        a.vel.y -= optimizedP * m2 * ny;
        b.vel.x += optimizedP * m1 * nx;
        b.vel.y += optimizedP * m1 * ny;
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = rubies.length - 1; i >= 0; i--) {
    if (
      rubies[i].pos.y > canvas.height + rubies[i].radius ||
      rubies[i].pos.x < -rubies[i].radius || rubies[i].pos.x > canvas.width + rubies[i].radius
    ) {
      rubies.splice(i, 1);
      continue;
    }
    rubies[i].update()
    checkCollisions(rubies);
    rubies[i].draw()
  };
  requestAnimationFrame(animate);
}

animate();
