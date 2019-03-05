const fs = require('fs');
const globby = require('globby');
exports.getModelPath = function getModelPath(modelsDirPath) {
  let res = [];
  try {
    // 尝试读取models目录，找到models
    res = globby
      .sync(`${modelsDirPath}/**/*.js`, {
        cwd: process.cwd()
      })
      .filter(
        p =>
          !p.endsWith('.d.ts') &&
          !p.endsWith('.test.js') &&
          !p.endsWith('.test.jsx') &&
          !p.endsWith('.test.ts') &&
          !p.endsWith('.test.tsx'),
      );
  } catch(e) {}
  return res;
};
  