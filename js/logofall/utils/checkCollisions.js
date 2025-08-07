export function checkCollisions(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];

      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.radius + b.radius;

      if (distance < minDist) {
        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDist - distance;
        const totalInvMass = a.massInv + b.massInv;


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
