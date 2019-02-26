#!/usr/bin/env node


const fs = require('fs-extra');

const folder = process.cwd();

const project = buildTree(folder);

print(project);

function print(module, parent = '') {
  console.log(parent + '/' + module.name + '@' + module.version);
  if (module.node_modules) {
    module.node_modules.forEach(mod => print(mod, parent + '/' + module.name));
  }
}

function buildTree(folder) {
  const module = {};

  if (fs.existsSync(folder + '/package.json')) {
    const packageJSON = require(folder + '/package.json');;
    module.name = packageJSON.name;
    module.version = packageJSON.version;
  } else return null;

  const node_modules_dir = folder + '/node_modules';
  if (fs.existsSync(node_modules_dir)) {
    const files = fs.readdirSync(node_modules_dir);
    const directories = files.filter(file => fs.lstatSync(node_modules_dir + '/' + file).isDirectory()).sort();
    const outputDirs = directories
      .map(node_mod => buildTree(node_modules_dir + '/' + node_mod))
      .filter(module => (module != null));
    module.node_modules = outputDirs;
  }
  return module;
}

