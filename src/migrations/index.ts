import * as migration_20260721_181309_initial from './20260721_181309_initial';
import * as migration_20260722_205038_drop_gallery_arrays from './20260722_205038_drop_gallery_arrays';
import * as migration_20260722_205100_gallery_media_rels from './20260722_205100_gallery_media_rels';
import * as migration_20260724_191452_authors_and_steps from './20260724_191452_authors_and_steps';
import * as migration_20260724_214333_stats_statement from './20260724_214333_stats_statement';
import * as migration_20260724_231240_authors_collection from './20260724_231240_authors_collection';
import * as migration_20260826_002226_authors_bilingual from './20260826_002226_authors_bilingual';

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
    name: '20260724_191452_authors_and_steps',
  },
  {
    up: migration_20260724_214333_stats_statement.up,
    down: migration_20260724_214333_stats_statement.down,
    name: '20260724_214333_stats_statement',
  },
  {
    up: migration_20260724_231240_authors_collection.up,
    down: migration_20260724_231240_authors_collection.down,
    name: '20260724_231240_authors_collection',
  },
  {
    up: migration_20260826_002226_authors_bilingual.up,
    down: migration_20260826_002226_authors_bilingual.down,
    name: '20260826_002226_authors_bilingual'
  },
];
