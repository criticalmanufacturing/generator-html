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
      	 let filePath = ".dev-tasks.json",
      	 fileContent = this.fs.readJSON(this.destinationPath(filePath));
         fileContent.packagePrefix = answers.packagePrefix;
         fileContent.framework = "";
         fileContent.webAppPrefix = answers.packagePrefix;
         fileContent.isWebAppCompilable = false;
         fileContent.dependencies = [];
         fileContent.packages = [];
      	 this.fs.writeJSON(filePath, fileContent);                  
        }
 	 });
  }
};