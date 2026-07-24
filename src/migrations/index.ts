import * as migration_20260721_181309_initial from './20260721_181309_initial';
import * as migration_20260722_205038_drop_gallery_arrays from './20260722_205038_drop_gallery_arrays';
import * as migration_20260722_205100_gallery_media_rels from './20260722_205100_gallery_media_rels';
import * as migration_20260724_191452_authors_and_steps from './20260724_191452_authors_and_steps';

export const migrations = [
  {
    up: migration_20260721_181309_initial.up,
    down: migration_20260721_181309_initial.down,
    name: '20260721_181309_initial',
  },
  {
    up: migration_20260722_205038_drop_gallery_arrays.up,
    down: migration_20260722_205038_drop_gallery_arrays.down,
    name: '20260722_205038_drop_gallery_arrays',
  },
  {
    up: migration_20260722_205100_gallery_media_rels.up,
    down: migration_20260722_205100_gallery_media_rels.down,
    name: '20260722_205100_gallery_media_rels',
  },
  {
    up: migration_20260724_191452_authors_and_steps.up,
    down: migration_20260724_191452_authors_and_steps.down,
    name: '20260724_191452_authors_and_steps'
  },
];
