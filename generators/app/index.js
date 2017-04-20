'use strict';
var HtmlGenerator = require('../html.js');

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);

    this.log("***************Welcome to the HTML scaffolding tool***************\n\n");
  }

  /**
   * This method will prompt the user with some settings that need to be configured before going deeper into customization projects.
   * At this point the only setting that is relevant is the client's prefix.
   */
  prompting() {
    return this.prompt([{
      type    : 'input',
      name    : 'packagePrefix',
      message : `Please specify the the client's prefix (example: cmf). `,
      default : null
    	}]).then((answers) => {
        if (typeof answers.packagePrefix === "string" && answers.packagePrefix !== "" && answers.packagePrefix !== "cmf") { 
      	 // Let's update the main.js from the dev.tasks, so this setting is persisted for install and build tasks
      	 let filePath = "node_modules/cmf.dev.tasks/main.js",
      	 fileContent = this.fs.read(this.destinationPath(filePath));
      	 this.fs.write(filePath, fileContent.replace(/ctx.packagePrefix = "cmf"/g, `ctx.packagePrefix = "${answers.packagePrefix}"`));
         // Let's update the gulpfile.js 
         filePath = "gulpfile.js";
         fileContent = this.fs.read(this.destinationPath(filePath));         
         // By default we have no extending framework
         fileContent = fileContent.replace(/var _framework = 'cmf.core'/g, "var _framework = ''");
         // We can't have references to cmf.core (this will remove all references of cmf.core or cmf.core.web)
         fileContent = fileContent.replace(/cmf.core/g, `${answers.packagePrefix}`);
         // By default we have no dependencies or packages         
         fileContent = fileContent.replace(/var _dependencies[ ]{0,}=[\s\S]*?\]/g, `var _dependencies = []`);
         fileContent = fileContent.replace(/var _packages[ ]{0,}=[\s\S]*?\]/g, `var _packages = []`);
         // By default the webApp should have no need to be compiled
         fileContent = fileContent.replace(/var isWebAppCompilable = true/g, "var isWebAppCompilable = false");
         this.fs.write(filePath, fileContent);
        }
 	 });
  }
};