import { PhysicsModel } from './PhysicsModel.js';
import { RenderShape } from './RenderShape.js';

export class Actor {
  constructor(x, y, shapeData, color) {
    this.body = new PhysicsModel(x, y, 25);
    this.shape = new RenderShape(shapeData, color);
  }

  update(canvasHeight) {
    this.body.applyGravity(0.01);
    this.body.integrate();
    this.body.checkRest(canvasHeight);
  }

  draw(ctx) {
    this.shape.draw(ctx, this.body.pos.x, this.body.pos.y, this.body.angle, this.body.radius);
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
    return this.body.radius;
  }
}
