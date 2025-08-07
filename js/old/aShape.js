export class Shape {
  constructor(x, y, shape, canvas, color = '#bbf7d0', radius = 25, mass = 1, gravity = 0.01) {
    this.pos = { x, y };
    this.shape = shape;
    this.strokeStyle = color;
    this.canvas = canvas;

    this.radius = radius;
    this.mass = mass;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = 0.01 - Math.random() * 0.02;
    this.resting = false;
    this.gravity = gravity;
    this.vel = { x: 0, y: 0 };
  }

  update() {
    if (this.resting) return;
    this.vel.y += this.gravity * this.mass;
    this.pos.y += this.vel.y;
    this.pos.x += this.vel.x;
    this.angle += this.angularVelocity;

    if (this.pos.y > this.canvas.height - this.radius) {
      this.pos.y = this.canvas.height - this.radius;
      this.vel.y *= -0.6;
    }

    if (Math.abs(this.vel.y) < 0.005 && Math.abs(this.pos.y - (this.canvas.height - this.radius)) < 1) {
      this.vel = { x: 0, y: 0 };
      this.angularVelocity = 0;
      this.resting = true;
    }
  }

  draw() {
    let ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(this.shape[0].x - this.radius, this.shape[0].y - this.radius);
    for (let i = 1; i < this.shape.length; i++) {
      ctx.lineTo(this.shape[i].x - this.radius, this.shape[i].y - this.radius);
    }

    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
