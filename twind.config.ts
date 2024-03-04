import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind/base';
import presetAutoprefix from '@twind/preset-autoprefix';
// Selectively import colors
import * as colors from '@twind/preset-tailwind/colors';

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({
      colors: {
        ...colors,
        primary: '#FF6666',
      },
    }),
  ],
});
