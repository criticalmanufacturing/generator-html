var localGulp = require('gulp');
var path = require('path');

//place your config here
var ctx = {
  packageName: '<%= package.name %>',
  baseDir: __dirname,
  libsFolder: 'node_modules/',
  localLibsFolder: 'local_libs/',
  tempFolder: 'temp/',
  sourceFolder: 'src/',
  project: '<%= package.name %>.csproj',
  type: 'module'
};

var gulpFunction = function(parentGulp, prefix){
    ctx.prefix = prefix;

    var tasks = require('@criticalmanufacturing/dev-tasks')(parentGulp, ctx);
    var gulp = tasks.gulp;
    var seq = tasks.plugins.seq;

    return tasks;
  };


if (process.cwd() === __dirname) {
    gulpFunction(localGulp);
}

module.exports = gulpFunction;
