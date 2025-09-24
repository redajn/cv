import * as shapes from './shapes/index.js';
import { Actor } from './models/Actor.js';
import { checkCollisions } from './utils/checkCollisions.js';

import { groundMap } from './shapes/immovable/ground.js';
import { wallMap } from './shapes/immovable/wall.js';

const canvas = document.getElementById('skill-canvas');
const ctx = canvas.getContext('2d');
const objects = [];
const level_objects = [];
const mapRegistry = {
  docker: shapes.dockerMap,
  gitlab: shapes.gitlabMap,
  kafka: shapes.kafkaMap,
  microservices: shapes.microservicesMap,
  pg: shapes.pgMap,
  rails: shapes.railsMap,
  redis: shapes.redisMap,
  rest: shapes.restMap,
  rspec: shapes.rspecMap,
  ruby: shapes.rubyMap,
  sentry: shapes.sentryMap,
  sidekiq: shapes.sidekiqMap
};

function resizeCanvasToDisplaySize(canvas) {
  const rect = canvas.getBoundingClientRect();

  const scale = 1; // probably have to make it smaller - window.devicePixelRatio
  const width = Math.floor(rect.width * scale);
  const height = Math.floor(rect.height * scale);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true; // canvas is chnged
  }

  return false;
}

function spawnActorOnHover(span, map) {
    span.addEventListener('mouseenter', () => {
    const x = Math.random() * (canvas.width - 50) + 25;
    objects.push(new Actor(x, -100, map, { type: 'circle', radius: 25 }, '#bbf7d0'));
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  checkCollisions([...objects, ...level_objects]);
  for (let i = objects.length - 1; i >= 0; i--) {
    if (
      objects[i].pos.y > canvas.height + objects[i].radius ||
      objects[i].pos.x < -objects[i].radius ||
      objects[i].pos.x > canvas.width + objects[i].radius
    ) {
      objects.splice(i, 1);
      continue;
    }
    objects[i].update(canvas.height);
    objects[i].draw(ctx);
  }
  for (let i = level_objects.length - 1; i >= 0; i--) {
    level_objects[i].draw(ctx);
  }

  requestAnimationFrame(animate);
}

resizeCanvasToDisplaySize(canvas);

level_objects.push(new Actor(canvas.width/2, canvas.height, groundMap, { type: 'rect', width: 700, height: 2 }, '#bbf7d0', false));

level_objects.push(new Actor(0, canvas.height/2, wallMap, { type: 'rect', width: 2, height: 500 }, '#bbf7d0', false));
level_objects.push(new Actor(canvas.width, canvas.height/2, wallMap, { type: 'rect', width: 2, height: 500 }, '#bbf7d0', false));

for (const [key, value] of Object.entries(mapRegistry)) {
  const span = document.getElementById(`${key}-span`);
  spawnActorOnHover(span, value);
};

animate();
