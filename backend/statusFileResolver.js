const path = require('path');
const { existsSync } = require('fs');
const logger = require('./logger');

const fileExists = filePath => {
  if (existsSync(filePath)) {
    logger.success(`Resolved path to status file: ${filePath}`);
    return true;
  }
  return false;
}

const getStatusFile = () => {
  const defaultPath = '/var/lib/dpkg/status';
  try {
    const pathToStatusFile = path.resolve(defaultPath)
    if (fileExists(pathToStatusFile)) {
      return pathToStatusFile;
    }
    if (fileExists("./status.txt")) {
      return "./status.txt";
    }
    throw new Error(`No such file: ${pathToStatusFile} or "./status.txt"`);
  } catch (error) {
    logger.error('Could not resolve path to status file', error)
    process.exit(1)
  }
}

module.exports = { getStatusFile }