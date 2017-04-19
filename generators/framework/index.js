'use strict';
var HtmlGenerator = require('../html.js'); 

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);    
    this.argument('frameworkName', { type: String, required: true });
    this.options.frameworkName = this.camelCaseValue(this.options.frameworkName);

    // If this command was not executed from the root, exit    
    if (this.config.get("isRoot") !== true) {
      this.env.error("Please execute this command outside a package. Hint: use the root of the repository.");      
    } 
  }

  /**
   * Will prompt the user which framework to extend (cmf.core or cmf.mes)
   */
  prompting() {    
    return this.prompt([{
      type    : 'list',
      name    : 'superFramework',
      message : `Which framework are you extending.`,
      choices : ["cmf.core", "cmf.mes"],
      default : "cmf.mes" 
    }]).then((answers) => {
      if (answers.superFramework === "cmf.core" || answers.superFramework === "cmf.mes") {
        let populateFrameworkSettings = (sourceString, objectToPersist) => {
          let mainModule = sourceString.split(".").pop();          
          objectToPersist.aliasExport = mainModule.charAt(0).toUpperCase() + mainModule.slice(1);
          objectToPersist.name = sourceString;
          objectToPersist.mainModule = mainModule;          
        };
        this.superFramework = {};
        this.subFramework = {};        
        populateFrameworkSettings(answers.superFramework, this.superFramework);
        populateFrameworkSettings(this.options.frameworkName, this.subFramework);        
        if (this.subFramework.aliasExport === "Core" || this.subFramework.aliasExport === "Mes") {
          this.subFramework.aliasExport = `${this.ctx.packagePrefix.charAt(0).toUpperCase()}${this.ctx.packagePrefix.slice(1)}${this.subFramework.aliasExport}`;
        }
      }
    });
  }

  /**
   * Will copy the templates for the framework tailoring all the files with the base framework it's extending from.
   */
  copyTemplates() {    
    let frameworkConfig = { name : this.options.frameworkName }, templatesToParse = ['__bower.json', 'package.json', 'gulpfile.js', 
    { templateBefore: 'src/framework.ts', templateAfter: `src/${this.subFramework.mainModule}.ts`} ,
    { templateBefore: 'src/framework.less', templateAfter: `src/${this.subFramework.mainModule}.less`} ,
    { templateBefore: 'src/domain/config/framework.config.ts', templateAfter: `src/domain/config/${this.subFramework.mainModule}.config.ts`} ,
    'src/domain/component.ts' , 'src/domain/framework.ts', 'src/domain/object.ts', 'src/domain/sandbox.ts'
    ], frameworkFolder = 'src/';
    this.fs.copy([this.templatePath('**'), '!**/framework.ts', '!**/framework.less', '!**/framework.config.ts'], this.destinationPath(`${frameworkFolder}${this.options.frameworkName}`));
    templatesToParse.forEach((template) => {
        let templateBefore = typeof template === "string" ? template : template.templateBefore,
        templateAfter = typeof template === "string" ? template : template.templateAfter;
        this.fs.copyTpl(this.templatePath(templateBefore), this.destinationPath(`${frameworkFolder}${this.options.frameworkName}/${templateAfter}`), {package:frameworkConfig, superFramework: this.superFramework, subFramework: this.subFramework})
      });   

     // For bower.json we just add cmf.core or cmf.mes
     let bowerJSONPath = `${frameworkFolder}${this.options.frameworkName}/__bower.json`,
        bowerJSONObject = this.fs.readJSON(this.destinationPath(bowerJSONPath));
        bowerJSONObject.dependencies[this.superFramework.name] = `@@GUIWepAppRoot/${this.superFramework.name}`;        
        this.fs.writeJSON(bowerJSONPath, bowerJSONObject); 

      this.updateWebAppBowerJSON.call(this, `@@GUIRepositoryRoot/${this.destinationRoot().split("\\").pop()}/src/${this.options.frameworkName}`);   

      // framework package does not need to go into the web App's config.json, as the actual app needs to import the framework.
      // Also the index needs to be updated. For that reason and since this should be a rare generator, we will not automate this step, like it is done for a regular package.
  }

  /**
   * Will install the framework's package as well as the web app.
   */
  install() {
    this.install.call(this, `src/${this.options.frameworkName}`);
  }
};