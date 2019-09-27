'use strict';

module.exports = {
  write: true,
  prefix: '^',
  plugin: 'autod-egg',
  test: [
    'test',
  ],
  dep: [
    'egg',
    'egg-sequelize',
    'egg-scripts',
    'egg-validate',
    'mysql2'
  ],
  devdep: [
    'egg-bin',
    'autod',
    'eslint',
    'eslint-config-egg',
    'autod-egg',
    'factory-girl',
    'sequelize-cli',
  ],
  exclude: [
    './test/fixtures',
  ],
};
