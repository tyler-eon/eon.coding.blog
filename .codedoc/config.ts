
import { configuration } from '@codedoc/core';
import { codingBlog } from '@codedoc/coding-blog-plugin';

import { theme } from './theme';



export const config = /*#__PURE__*/configuration({
  theme,
  src: {
    base: 'posts'
  },
  dest: {
    namespace: '/eon.coding.blog',
    html: 'dist',
    assets: process.env.GITHUB_BUILD === 'true' ? 'dist' : '.',
    bundle: process.env.GITHUB_BUILD === 'true' ? 'bundle' : 'dist/bundle',
    styles: process.env.GITHUB_BUILD === 'true' ? 'styles' : 'dist/styles',
  },
  page: {
    title: {
      base: 'Thoughts of an Eon'
    },
    favicon: '/favicon.ico'
  },
  plugins: [
    codingBlog({
      assets: [
        'img',
        'favicon.ico',
      ]
    })
  ],
  misc: {
    github: {
      repo: 'eon.coding.blog',
      user: 'kolorahl'
    }
  }
});
