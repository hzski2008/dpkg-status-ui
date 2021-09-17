const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

const getPackages = async (filePath) => {
  const content = await readFile(filePath, "utf8");
  const packages = content
    .split(/\r?\n\r?\n/) // empty line
    .filter((block) => block.trim() !== "")
    .map(parsePackage);

  const packageTable = packages.reduce((table, pkg) => {
    return {
      ...table,
      [pkg.name]: pkg,
    };
  }, {});

  // Calculate dependentPackages property
  Object.keys(packageTable).forEach((name) => {
    const pkg = packageTable[name];
    const flatDependencies = [].concat(
      ...pkg.dependencies.map((dependency) => [
        dependency.main,
        ...dependency.alternatives,
      ])
    );
    flatDependencies.forEach((dependencyName) => {
      if (
        packageTable[dependencyName] &&
        !packageTable[dependencyName].dependentPackages.includes(name)
      ) {
        packageTable[dependencyName].dependentPackages.push(name);
      }
    });
  });

  return packages;
};

const parsePackage = (text, index) => {
  try {
    return {
      name: parseName(text),
      description: parseDescription(text),
      dependencies: parseDependencies(text),
      dependentPackages: [],
    };
  } catch (error) {
    throw new Error(`Failed to parse entry ${index}: ${error.message}`);
  }
};

const parseName = (text) => {
  const matches = text.match(/Package:\s(.+)\r?\n/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Package" not found`);
};

const parseDescription = (text) => {
  const matches = text.match(/Description:\s(.+\r?\n(\s.+\r?\n)*)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Description" not found`);
};

const parseDependencies = (text) => {
  const matches = text.match(/\r?\nDepends:\s(.+)\r?\n/);
  if (!matches || !matches[1]) {
    // No dependencies for this package
    return [];
  }
  const dependenciesLine = matches[1];

  // 'libc6 (>= 2.2.5)' -> 'libc6'
  const parsePackageName = (packageString) => packageString.split(" ").shift();

  /*
   * E.g.
   * 'libc6 (>= 2.2.5), dpkg (>= 1.15.4) | install-info' ->
   * [{ main: 'libc6', alternatives: [] }, { main: 'dpkg', alternatives: ['install-info'] }]
   */
  const dependencies = dependenciesLine.split(", ").map((string) => {
    const packages = string.split(" | ");
    if (!packages || packages.length < 1) {
      throw new Error(`Invalid dependency format (${dependenciesLine})`);
    }
    const dependency = {
      main: parsePackageName(packages.shift()),
      alternatives: packages.map(parsePackageName),
    };
    return dependency;
  });

  // Filter out duplicates comparing by dependency.main
  return dependencies.filter(
    (dependency, index) =>
      dependencies.findIndex(
        (otherDependency) => otherDependency.main === dependency.main
      ) === index
  );
};

module.exports.getPackages = getPackages;
