import * as migration_20261119_150128_baseline from './20261119_150128_baseline';
import * as migration_20261121_114458_brand_logos from './20261121_114458_brand_logos';
import * as migration_20261122_224523_store_show_discounts from './20261122_224523_store_show_discounts';

export const migrations = [
  {
    up: migration_20261119_150128_baseline.up,
    down: migration_20261119_150128_baseline.down,
    name: '20261119_150128_baseline',
  },
  {
    up: migration_20261121_114458_brand_logos.up,
    down: migration_20261121_114458_brand_logos.down,
    name: '20261121_114458_brand_logos',
  },
  {
    up: migration_20261122_224523_store_show_discounts.up,
    down: migration_20261122_224523_store_show_discounts.down,
    name: '20261122_224523_store_show_discounts'
  },
];
