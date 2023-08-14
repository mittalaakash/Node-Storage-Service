const fs = require('fs/promises');

exports.pathCheck = async function (path) {
  let pathExists = true;
  try {
    await fs.access(path);
  } catch (error) {
    pathExists = false;
  }

  return pathExists;
};
