import * as migration_20261119_150128_baseline from './20261119_150128_baseline';

export const migrations = [
  {
    up: migration_20261119_150128_baseline.up,
    down: migration_20261119_150128_baseline.down,
    name: '20261119_150128_baseline'
  },
];
