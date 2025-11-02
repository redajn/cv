import { COLLISION, PHYSICS, GLOW } from '../constants.js';

export function checkCollisions(list, movableObjects = null) {
  // Create a Set of objects that are eligible for glow (last N movable objects)
  const glowEligibleSet = new Set();
  if (movableObjects && movableObjects.length > 0) {
    const startIndex = Math.max(0, movableObjects.length - GLOW.MAX_OBJECTS_WITH_GLOW);
    for (let i = startIndex; i < movableObjects.length; i++) {
      glowEligibleSet.add(movableObjects[i]);
    }
  }

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];

      if (a.body.shape.type === 'circle' && b.body.shape.type === 'circle') {
        circleCircle(a, b, glowEligibleSet);
      } else if (a.body.shape.type === 'circle' && b.body.shape.type === 'rect') {
        circleRect(a, b, glowEligibleSet);
      } else if (a.body.shape.type === 'rect' && b.body.shape.type === 'circle') {
        circleRect(b, a, glowEligibleSet);
      }
    }
  }
}

function circleCircle(a, b, glowEligibleSet) {
  const dx = b.pos.x - a.pos.x;
  const dy = b.pos.y - a.pos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.radius + b.radius;

  if (distance < minDist) {
    // cosine - normalized vector
    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDist - distance;
    // const totalInvMass = a.massInv + b.massInv;

    // collision resolution equally between both objects
    a.pos.x -= nx * overlap / 2;
    a.pos.y -= ny * overlap / 2;
    b.pos.x += nx * overlap / 2;
    b.pos.y += ny * overlap / 2;

    const v1 = a.vel.x * nx + a.vel.y * ny;
    const v2 = b.vel.x * nx + b.vel.y * ny;

    const m1 = a.mass;
    const m2 = b.mass;

    const optimizedP = COLLISION.CIRCLE_CIRCLE_ELASTICITY * (v1 - v2) / (m1 + m2); // elastic collision impulse

    // velocity adjustment from applied impulse
    // m - mass factor
    // nx - direction
    // +- - direct it in opposite direction
    a.vel.x -= optimizedP * m2 * nx;
    a.vel.y -= optimizedP * m2 * ny;
    b.vel.x += optimizedP * m1 * nx;
    b.vel.y += optimizedP * m1 * ny;

    // ***************************************************** FRICTION
    // tangential velocity components
    const tx = -ny, ty = nx;
    const tA = a.vel.x * tx + a.vel.y * ty;
    const tB = b.vel.x * tx + b.vel.y * ty;

    a.body.angularVelocity = tA * PHYSICS.ANGULAR_VELOCITY_FACTOR / a.radius
    b.body.angularVelocity = tB * PHYSICS.ANGULAR_VELOCITY_FACTOR / b.radius

    // infinite spinning fix
    if (Math.abs(a.body.angularVelocity) < PHYSICS.MIN_ANGULAR_VELOCITY_THRESHOLD) {
      a.body.angularVelocity = 0
    }

    if (Math.abs(b.body.angularVelocity) < PHYSICS.MIN_ANGULAR_VELOCITY_THRESHOLD) {
      b.body.angularVelocity = 0
    }

    // Trigger glow effect on collision (only for newest objects)
    if (a.triggerGlow && b.triggerGlow) {
      // Only apply glow if both objects are in the eligible set (last N objects)
      if (glowEligibleSet.has(a) && glowEligibleSet.has(b)) {
        a.triggerGlow(GLOW.INTENSITY);
        b.triggerGlow(GLOW.INTENSITY);
      }
    }
  }
}

function circleRect(circle, rect, glowEligibleSet) {
  const cx = circle.pos.x;
  const cy = circle.pos.y;
  const cr = circle.radius;

  const rx = rect.pos.x;
  const ry = rect.pos.y;
  const rhw = rect.width / 2;
  const rhh = rect.height / 2;

  const closestX = Math.max(rx - rhw, Math.min(rx + rhw, cx));
  const closestY = Math.max(ry - rhh, Math.min(ry + rhh, cy));

  const dx = cx - closestX;
  const dy = cy - closestY;

  const distSq = dx * dx + dy * dy;

  if (distSq < cr * cr) {
    const dist = Math.sqrt(distSq);
    const overlap = cr - dist;

    // normalization
    const nx = dx / dist;
    const ny = dy / dist;

    // collision resolution
    circle.pos.x += nx * overlap;
    circle.pos.y += ny * overlap;

    // new vector
    const v = circle.vel.x * nx + circle.vel.y * ny;

    circle.vel.x -= COLLISION.CIRCLE_RECT_ELASTICITY * v * nx;
    circle.vel.y -= COLLISION.CIRCLE_RECT_ELASTICITY * v * ny;

    // FRICTION
    const tx = -ny, ty = nx; // tangent to the normal
    const tangSpeed = circle.vel.x * tx + circle.vel.y * ty;
    const friction = COLLISION.CIRCLE_RECT_FRICTION;
    circle.body.angularVelocity = (tangSpeed * PHYSICS.ANGULAR_VELOCITY_FACTOR / circle.radius)

    // infinite spinning fix
    if (Math.abs(circle.body.angularVelocity) < PHYSICS.MIN_ANGULAR_VELOCITY_THRESHOLD) {
      circle.body.angularVelocity = 0
    }

    const newTangSpeed = tangSpeed * (1 - friction);
    const deltaTangSpeed = newTangSpeed - tangSpeed;

    circle.vel.x += deltaTangSpeed * tx;
    circle.vel.y += deltaTangSpeed * ty;

    // Trigger glow effect on collision (only for circle, not for walls/ground)
    // Only apply glow if circle is in the eligible set (last N objects)
    if (circle.triggerGlow && glowEligibleSet.has(circle)) {
      circle.triggerGlow(GLOW.INTENSITY);
    }
  }
}
