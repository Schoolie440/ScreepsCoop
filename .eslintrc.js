module.exports = {
  env: {
    es6: true,
    node: true,
  },
  globals: {
    _: false,
    Game: false,
    Memory: false,
    RoomPosition: false,
    CONTROLLER_STRUCTURES: false,
    FIND_MY_STRUCTURES: false,
    STRUCTURE_EXTENSION: false,
    STRUCTURE_ROAD: false,
    STRUCTURE_TOWER: false,
    FIND_FLAGS: false,
    FIND_HOSTILE_CREEPS: false,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules: {
    quotes: ['error', 'single'],
    'no-console': ['error', { allow: ['log', 'error'] }],
  },
};
