export function checkCollisions(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];

      if (a.body.shape.type === 'circle' && b.body.shape.type === 'circle') {
        circleCircle(a, b);
      } else if (a.body.shape.type === 'circle' && b.body.shape.type === 'rect') {
        circleRect(a, b);
      } else if (a.body.shape.type === 'rect' && b.body.shape.type === 'circle') {
        circleRect(b, a);
      }
    }
  }
}

function circleCircle(a, b) {
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

    if (Math.abs(v1) < 0.01) {
      a.body.resting = true
    }

    if (Math.abs(v2) < 0.01) {
      b.body.resting = true
    }

    const m1 = a.mass;
    const m2 = b.mass;

    const optimizedP = 1.9 * (v1 - v2) / (m1 + m2); // elastic collision impulse

    // velocity adjustment from applied impulse
    // m - mass factor
    // nx - direction
    // +- - direct it in opposite direction
    a.vel.x -= optimizedP * m2 * nx;
    a.vel.y -= optimizedP * m2 * ny;
    b.vel.x += optimizedP * m1 * nx;
    b.vel.y += optimizedP * m1 * ny;
  }
}

function circleRect(circle, rect) {
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
    console.log('collision!')
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
    console.log(v)
    console.log(circle.body.angularVelocity)
    if (Math.abs(v) < 0.01) {
      circle.body.resting = true
    }

    circle.vel.x -= 1.4 * v * nx;
    circle.vel.y -= 1.4 * v * ny;
  }
}
