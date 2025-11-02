import { PhysicsModel } from './PhysicsModel.js';
import { RenderShape } from './RenderShape.js';
import { PHYSICS, GLOW } from '../constants.js';

export class Actor {
  constructor(x, y, shapeData, bodyData, color, movable = true) {
    this.body = new PhysicsModel(x, y, bodyData, 1, movable);
    this.shape = new RenderShape(shapeData, color);
  }

  update(canvasHeight, deltaTime) {
    this.body.applyGravity(PHYSICS.GRAVITY, deltaTime);
    this.body.integrate(deltaTime);
    
    // Decay glow effect over time
    if (this.body.glowIntensity > 0) {
      this.body.glowIntensity = Math.max(0, this.body.glowIntensity - GLOW.DECAY_RATE);
    }
  }
  
  // Trigger glow effect (called on collision)
  triggerGlow(intensity = 1.0) {
    this.body.glowIntensity = Math.min(1.0, Math.max(this.body.glowIntensity, intensity));
  }

  draw(ctx) {
    this.shape.draw(ctx, this.body.pos.x, this.body.pos.y, this.body.angle, this.body.shape, this.body.glowIntensity);
  }

  get pos() {
    return this.body.pos;
  }

  get vel() {
    return this.body.vel;
  }

  get mass() {
    return this.body.mass;
  }

  get radius() {
    return this.body.shape.radius;
  }

  get width() {
    return this.body.shape.width;
  }

  get height() {
    return this.body.shape.height;
  }
}
