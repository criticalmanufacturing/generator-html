var localGulp = require('gulp');
var path = require('path');

var ctx = {
    packageName: '<%= package.name %>',
    deployFolder: '/',
    baseDir: __dirname,
    libsFolder: 'node_modules/',
    localLibsFolder: 'local_libs/',
    tempFolder: 'temp/',
    testFolder: 'test/',
    sourceFolder: 'src/',
    cssBundle: true
};

var gulpFunction = function (parentGulp, prefix) {
    ctx.prefix = prefix;

    var tasks = require('cmf.dev.tasks')(parentGulp, ctx);
    var gulp = tasks.gulp;
    var seq = tasks.plugins.seq;

    return tasks;
};


if (process.cwd() === __dirname) {
    gulpFunction(localGulp);
}

module.exports = gulpFunction;
