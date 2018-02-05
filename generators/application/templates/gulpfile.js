var localGulp = require('gulp');

//place your config here
var ctx = {
    packageName: '<%= package %>',
    baseDir: __dirname,    
    libsFolder: 'node_modules/',
    localLibsFolder: 'local_libs/',
    tempFolder: 'temp/',
    sourceFolder: 'src/',
    project: '<%= package %>.csproj',
    type: 'webApp',
    defaultPort: 7000,
};

var gulpFunction = function (parentGulp, prefix) {
    ctx.prefix = prefix;

    var tasks =  require('@criticalmanufacturing/dev-tasks')(parentGulp, ctx);

    tasks.tasks.web(tasks.plugins.gulpWrapper, ctx);

    return tasks;
};


if (process.cwd() === __dirname) {
    gulpFunction(localGulp);
}

module.exports = gulpFunction;
