import { PHYSICS } from '../constants.js';

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

  applyGravity(gravity, deltaTime) {
    const normalizedDelta = deltaTime / PHYSICS.DELTA_TIME_NORMALIZER;
    this.vel.y += gravity * this.mass * normalizedDelta;
  }

  integrate(deltaTime) {
    const normalizedDelta = deltaTime / PHYSICS.DELTA_TIME_NORMALIZER;
    if (this.movable && !this.resting) {
      this.angle += this.angularVelocity * normalizedDelta;
    }
    this.pos.y += this.vel.y * normalizedDelta;
    this.pos.x += this.vel.x * normalizedDelta;
  }
}
