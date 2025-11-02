// Import maps first
import { dockerMap } from './docker.js';
import { gitlabMap } from './gitlab.js';
import { kafkaMap } from './kafka.js';
import { microservicesMap } from './microservices.js';
import { pgMap } from './pg.js';
import { railsMap } from './rails.js';
import { redisMap } from './redis.js';
import { restMap } from './rest.js';
import { rspecMap } from './rspec.js';
import { rubyMap } from './ruby.js';
import { sentryMap } from './sentry.js';
import { sidekiqMap } from './sidekiq.js';

// Re-export for backward compatibility
export { dockerMap };
export { gitlabMap };
export { kafkaMap };
export { microservicesMap };
export { pgMap };
export { railsMap };
export { redisMap };
export { restMap };
export { rspecMap };
export { rubyMap };
export { sentryMap };
export { sidekiqMap };

// Centralized map registry for all shape maps
export const mapRegistry = {
  docker: dockerMap,
  gitlab: gitlabMap,
  kafka: kafkaMap,
  microservices: microservicesMap,
  pg: pgMap,
  rails: railsMap,
  redis: redisMap,
  rest: restMap,
  rspec: rspecMap,
  ruby: rubyMap,
  sentry: sentryMap,
  sidekiq: sidekiqMap
};
