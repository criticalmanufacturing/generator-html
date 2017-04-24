'use strict';
var HtmlGenerator = require('../html.js'),
  fs = require('fs');

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);    
    this.argument('packageName', { type: String, required: true });
    this.options.packageName = this.camelCaseValue(this.options.packageName);

    // If this command was not executed from the root, exit    
    if (this.config.get("isRoot") !== true) {
      this.env.error("Please execute this command outside a package. Hint: use the root of the repository.");      
    } 
  }

  /**
  * Will prompt the user with all the dependencies that this new package may have.  
  */
  prompting() {
    Set.prototype.union = function(setB) {
      var union = new Set(this);
      for (var elem of setB) {
          union.add(elem);
      }
      return union;
    };
    Set.prototype.difference = function(setB) {
      var difference = new Set(this);
      for (var elem of setB) {
        difference.delete(elem);
      }
      return difference;
    };

    // Let's get the list of packages from the current repository and merge them with the list of packages in the webApp
    // We will also exclude some that are always included and therefore, not really relevant to mention
    let webPrefix = this.options.packageName.startsWith("cmf.core") ? "cmf.core" : (this.options.packageName.startsWith("cmf.mes")) ? "cmf.mes" : this.ctx.packagePrefix,      
    excludeFilter = (folder) => { return folder.startsWith("cmf") && ["cmf.taura", "cmf.core", "cmf.core.multicast.client", "cmf.mes", "cmf.lbos", "cmf.polyfill"].indexOf(folder) < 0 && !folder.startsWith("cmf.style") },
      repositoryPackages = new Set(fs.readdirSync(this.destinationPath("src/packages"))),
      webAppPackages = new Set(fs.readdirSync(this.destinationPath(`apps/${webPrefix}.web/node_modules`)).filter(excludeFilter)),
      allPackages = repositoryPackages.union(webAppPackages);
    

    return this.prompt([{
      type    : 'checkbox',
      name    : 'dependencies',      
      message : `Select dependencies`,
      choices: Array.from(allPackages).filter((pkg) => !pkg.startsWith(".")).sort().map((pkg) => {return {name: pkg, value: pkg}}),
      pageSize: 20, // We can set up the pageSize attribute but there’s a PR opened ATM to make the height match the terminal height. Soon this won’t be necessary
      default : null
    }]).then((answers) => {
      if (answers.dependencies instanceof Array && answers.dependencies.length > 0) {        
        this.dependencies = answers.dependencies.filter((entry) => entry !== "");        
      }
    });
  }

  /**
  * This method will perform several tasks such as
  * - Copy all package templates to "src/packages"
  * - Will update the __bower.json with all the dependencies defined for the package
  * - Will update the __bower.json of the web app so it is aware of this new package
  * - Will update the config.json of the web app, so it loads the new package once it starts
  * - Will udpate the root's gulpfile.js so when a "gulp install" or "gulp build" is issued at root level, it will also account for the new package.
  */
  copyTemplates() {    
    let packageConfig = { name : this.options.packageName}, templatesToParse = ['__bower.json', 'package.json', 'gulpfile.js', '.yo-rc.json',
     { templateBefore: 'src/metadata.ts', templateAfter: `src/${packageConfig.name}.metadata.ts`} ], packagesFolder = 'src/packages/';    
    this.fs.copy([this.templatePath('**'), '!**/metadata.ts'], this.destinationPath(`${packagesFolder}${this.options.packageName}`));
    templatesToParse.forEach((template) => {
        let templateBefore = typeof template === "string" ? template : template.templateBefore,
        templateAfter = typeof template === "string" ? template : template.templateAfter;
        this.fs.copyTpl(this.templatePath(templateBefore), this.destinationPath(`${packagesFolder}${this.options.packageName}/${templateAfter}`), {package: packageConfig})
      });   

    // Let's update the destination _bower.json with the lbos and any dependencies that may have been defined          
    let bowerJSONPath = `${packagesFolder}${this.options.packageName}/__bower.json`,
    bowerJSONObject = this.fs.readJSON(this.destinationPath(bowerJSONPath));
    bowerJSONObject.dependencies["cmf.lbos"] = (this.ctx.packagePrefix  === "cmf") ? "@@GUIRepositoryRoot/Library/HTML/cmf.mes.lbos" : "@@GUIWepAppRoot/cmf.lbos";
    if (this.options.packageName.startsWith("cmf.mes") ) {
      bowerJSONObject.dependencies["cmf.mes"] = "@@GUIRepositoryRoot/MESHTML/src/cmf.mes";  
    } else if (this.ctx.packagePrefix  !== "cmf") { // Here we are assuming we are customizing on top of mes and not on core. 
      bowerJSONObject.dependencies["cmf.mes"] = "@@GUIWepAppRoot/cmf.mes";
    }
    
    if (this.dependencies instanceof Array && this.dependencies.length > 0) {          
      this.dependencies.forEach((dependency) => {
        let link = null, repository = this.destinationRoot().split("\\").pop();
        if (dependency.startsWith("cmf.core") && repository === "MESHTML") {
          link = `@@GUIRepositoryRoot/COREHTML/${packagesFolder}${dependency}`;
        } else if ((dependency.startsWith(this.ctx.packagePrefix))) {   
          let prefix = "";
          if (repository === "CoreHTML" || repository === "MESHTML")  { prefix = "@@"; }     
          link = `@@GUIRepositoryRoot/${prefix}${repository}/${packagesFolder}${dependency}`;          
        } else {
          
          link = `@@GUIWepAppRoot/${dependency}`;  
        }
        bowerJSONObject.dependencies[dependency] = link;
      });
    } 
    this.fs.writeJSON(bowerJSONPath, bowerJSONObject);     

    /** We also want to update the __bower.json of the webApp. if the package prefix starts with "cmf", we are dealing with COREHTML or MESHTML
    * In these cases when linking to the web app, the prefix is not enough, because the webApp is "cmf.core.web" and "cmf.mes.web".
    * if the package being created starts with "cmf" and then "core", we are in COREHTML. If it's cmf.mes, then it's MESHTML. If it does not
    * start with "cmf", then is a customization scenario. In these cases there's not need to have another name after the prefix. 
    */   
    this.updateWebAppBowerJSON(`@@GUIRepositoryRoot/${this.destinationRoot().split("\\").pop()}/${packagesFolder}${this.options.packageName}`);   

    // By updating the webApp's __bower.json we also need to update the config.json file with the new package
    let webAppConfigPath = `${this.webAppFolderPath}/config.json`,
      webAppConfigObject = this.fs.readJSON(this.destinationPath(webAppConfigPath));
    if (webAppConfigObject.packages.available.indexOf(this.options.packageName) < 0) {
      webAppConfigObject.packages.available.push(this.options.packageName);
      this.fs.writeJSON(webAppConfigPath, webAppConfigObject);
    }

    // We also need to update the root's gulpfile.js so this new package is included in the global install and build tasks
    let rootGulpFile = `${this.destinationPath("gulpfile.js")}`,
      fileContent = this.fs.read(rootGulpFile),        
      packagesStringArray = fileContent.match(/var _packages =(.*?);/g);
    if (packagesStringArray instanceof Array && packagesStringArray.length > 0) {              
      var _packages = []; // Like always, in strict mode, we are not allowed to introduce new vars into the scope, so we created it first and update it during the eval
      eval(packagesStringArray[0].replace("var", ""));                
      if (_packages.indexOf(this.options.packageName) < 0) {
        _packages.push(this.options.packageName);
        this.fs.write(rootGulpFile, fileContent.replace(packagesStringArray, `var _packages = ${JSON.stringify(_packages)};`));            
      }
    } else {
      this.log("Couldn't include the new package in the root's gulpfile.js");
    }     
  }

  /** 
  * Will install both the new package as well as the web app
  */
  install() {
    this["__proto__"]["__proto__"].install.call(this, `src/packages/${this.options.packageName}`);  
  }
};