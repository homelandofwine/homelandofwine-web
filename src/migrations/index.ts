import * as migration_20260721_181309_initial from './20260721_181309_initial';

export const migrations = [
  {
    up: migration_20260721_181309_initial.up,
    down: migration_20260721_181309_initial.down,
    name: '20260721_181309_initial'
  },
];
