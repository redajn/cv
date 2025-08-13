export class PhysicsModel {
  constructor(x, y, shape, mass = 1, movable = true) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.shape = shape;
    this.angle = 0 // Math.random() * Math.PI * 2; // gonna be optional
    this.angularVelocity = 0.01 - Math.random() * 0.02;

    this.mass = movable ? mass : Infinity;
    this.massInv = movable ? 1/mass : 0;
    this.movable = movable;

    this.resting = false;
  }

  applyGravity(gravity) {
    this.vel.y += gravity * this.mass;
  }

  integrate() {
    if (this.movable && !this.resting) {
      this.angle += this.angularVelocity;
    }
    this.pos.y += this.vel.y;
    this.pos.x += this.vel.x;
  }

  // looks like it's need to be reworked and not related to canvas heigh
  // checkRest(canvasHeight) {
  //   if (this.pos.y > canvasHeight - this.shape.radius) {
  //     this.pos.y = canvasHeight - this.shape.radius;
  //     this.vel.y *= -0.6;
  //     console.log(this.vel.y, this.vel.x)
  //   }

  //   if (Math.abs(this.vel.y) < 0.005 && Math.abs(this.pos.y - (canvasHeight - this.shape.radius)) < 1) {
  //     this.vel = { x:0, y:0 };
  //     this.angularVelocity = 0;
  //     this.resting = true;
  //   }
  // }
}
