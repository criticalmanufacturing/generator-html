import { HtmlGenerator } from "../html";
import * as fs from "fs";
import * as path from "path";

module.exports = class extends HtmlGenerator {

  options: {
    packageName: string
  }

  dependencies: string[];
  
  constructor(args, opts) {
    super(args, opts);    

    this.argument('packageName', { type: String, required: true });
    this.options.packageName = this.camelCaseValue(this.options.packageName);
    // Prepend the package suffix if not present
    if (!this.options.packageName.startsWith(`${this.ctx.packagePrefix}.`)) {
      this.options.packageName = `${this.ctx.packagePrefix}.${this.options.packageName}`;
    }

    // If this command was not executed from the root, exit    
    if (this.config.get("isRoot") !== true) {
      this.env.error(new Error("Please execute this command outside a package. Hint: use the root of the repository."));
    } 
  }

  /**
  * Will prompt the user with all the dependencies that this new package may have.  
  */
  prompting() {
    (<any>Set.prototype).union = function(setB) {
      var union = new Set(this);
      for (var elem of setB) {
          union.add(elem);
      }
      return union;
    };
    (<any>Set.prototype).difference = function(setB) {
      var difference = new Set(this);
      for (var elem of setB) {
        difference.delete(elem);
      }
      return difference;
    };

    // Let's get the list of packages from the current repository and merge them with the list of packages in the webApp
    // We will also exclude some that are always included and therefore, not really relevant to mention
    let webAppFolder = this.webAppFoldersPath.find(folder => folder.endsWith(".web"));
    if (!webAppFolder) {
      webAppFolder = this.webAppFoldersPath[0];
    };

    let allPackages = [];
    let repositoryPackages = new Set();
    let webAppPackages = new Set();

    if (fs.existsSync(this.destinationPath("src", "packages"))) {
      repositoryPackages = new Set(fs.readdirSync(this.destinationPath("src", "packages")));
    }
    
    if (fs.existsSync(this.destinationPath(webAppFolder, "node_modules"))) {
      const excludeFilter = (folder) => { 
        const inclusionList = folder.startsWith("cmf") && ["cmf.taura", "cmf.core", "cmf.core.multicast.client", "cmf.mes", "cmf.polyfill", "cmf.angular", "cmf.instascan", "cmf.core.examples", "cmf.mes.examples"].indexOf(folder) < 0 && !folder.startsWith("cmf.style");
        return inclusionList || folder === "@angular"; // let's add the @angular dependency since it's a special case
      };
      webAppPackages = new Set(fs.readdirSync(this.destinationPath(webAppFolder, "node_modules")).filter(excludeFilter));
    }
    
    allPackages = (<any>repositoryPackages).union(webAppPackages);
    const packageNames: {name: string, checked: boolean}[] = Array.from(allPackages).filter((pkg) => !(<string>pkg).startsWith(".")).sort().map((pkg) => {return {name: pkg, checked: (pkg === "cmf.lbos" || pkg === "@angular") }})
    const choices = this._getAppPackageDescriptions(webAppFolder, packageNames);
    
    return this.prompt([{
      type    : 'checkbox',
      name    : 'dependencies',      
      message : `Select dependencies`,
      choices: choices,
      pageSize: 18, // We can set up the pageSize attribute but there’s a PR opened ATM to make the height match the terminal height. Soon this won’t be necessary
      default : undefined,
      when    : () => Array.from(allPackages).length > 0
    }]).then((answers) => {
      if (answers.dependencies instanceof Array && answers.dependencies.length > 0) {        
        this.dependencies = answers.dependencies.filter((entry) => entry !== "");
      }
    });
  }

  /**
  * This method will perform several tasks such as
  * - Copy all package templates to "src/packages"
  * - Will update the package.json with all the dependencies defined for the package
  * - Will update the package.json of the web app so it is aware of this new package
  * - Will update the config.json of the web app, so it loads the new package once it starts
  * - Will update the root's .dev.tasks.json so when a "gulp install" or "gulp build" is issued at root level, it will also account for the new package.
  */
  copyTemplates() {        
    const packageConfig = {name: this.options.packageName};
    const templatesToParse = [
      'package.json',
      'gulpfile.js',
      '.yo-rc.json', 
      {templateBefore: '__.npmignore', templateAfter: '.npmignore'}
    ];
    const packagesFolder = 'src/packages/';
    const repository = this.destinationRoot().split("\\").pop();
    const copyArray = [
      this.templatePath('**'),
      `!${this.templatePath('src/metadata.ts')}`,
      `!${this.templatePath('__.npmignore')}`,
      `!${this.templatePath('__.npmrc')}`
    ];

    if (this.ctx.__config.registry) {
      templatesToParse.push({ templateBefore: '__.npmrc', templateAfter: '.npmrc'});
    }

    this.fs.copy(<any>copyArray, this.destinationPath(packagesFolder, this.options.packageName));
    templatesToParse.forEach((template) => {
        let templateBefore = typeof template === "string" ? template : template.templateBefore,
        templateAfter = typeof template === "string" ? template : template.templateAfter;
        this.fs.copyTpl(this.templatePath(templateBefore), this.destinationPath(`${packagesFolder}${this.options.packageName}/${templateAfter}`), {package: packageConfig, registry: this.ctx.__config.registry})
      });

    // Let's update the destination package.json with the lbos and any dependencies that may have been defined
    const packageJSONPath = `${packagesFolder}${this.options.packageName}/package.json`;
    const packageJSONObject = this.fs.readJSON(this.destinationPath(packageJSONPath));
    const appLibsFolder = `file:../../../apps/${this.ctx.packagePrefix}.web/node_modules/`;    
        
    if (this.dependencies instanceof Array && this.dependencies.length > 0) {          
      this.dependencies.forEach((dependency) => {
        let link: string;
        if (dependency.startsWith("cmf.core") && repository === "MESHTML") {
          link = `file:../../../../CoreHTML/${packagesFolder}${dependency}`;
        } else if ((dependency.startsWith(this.ctx.packagePrefix))) {    
          link = `file:../${dependency}`;          
        } else {
          link = `${appLibsFolder}${dependency}`;  
        }
        packageJSONObject.cmfLinkDependencies[dependency] = link;
        packageJSONObject.optionalDependencies[dependency] = this.ctx.__config.channel;
      });
    } 

    let extendingMES: boolean = false;
    // We need one fallback at the end. If we are customizing, we can end up using ony packages from CORE and we need to customize on top of MES
    if (Object.keys(packageJSONObject.optionalDependencies).some(function(dependency) {return dependency.startsWith("cmf.mes")})) {
      packageJSONObject.cmfLinkDependencies["cmf.mes"] = `${appLibsFolder}cmf.mes`;
      packageJSONObject.optionalDependencies["cmf.mes"] = this.ctx.__config.channel;
      // Also depend on cmf.core as we are going to need it for typings
      packageJSONObject.cmfLinkDependencies["cmf.core"] = `${appLibsFolder}cmf.core`;
      packageJSONObject.optionalDependencies["cmf.core"] = this.ctx.__config.channel;
      extendingMES = true;
    } else {
      // Otherwise, we need to depend on cmf.core
      packageJSONObject.cmfLinkDependencies["cmf.core"] = `${appLibsFolder}cmf.core`;
      packageJSONObject.optionalDependencies["cmf.core"] = this.ctx.__config.channel;
    }

    this.fs.writeJSON(packageJSONPath, packageJSONObject);     

    // Now that we know if we extended cmf.mes or cmf.core, we must copy the metadata file, parsing the template using this information
    this.fs.copyTpl(this.templatePath('src/metadata.ts'), this.destinationPath(`${packagesFolder}${this.options.packageName}/src/${packageConfig.name}.metadata.ts`), {extendingMES: extendingMES })

    /** We also want to update the package.json of the webApp. if the package prefix starts with "cmf", we are dealing with COREHTML or MESHTML
    * In these cases when linking to the web app, the prefix is not enough, because the webApp is "cmf.core.web" and "cmf.mes.web".
    * if the package being created starts with "cmf" and then "core", we are in COREHTML. If it's cmf.mes, then it's MESHTML. If it does not
    * start with "cmf", then is a customization scenario. In these cases there's no need to have another name after the prefix. 
    */   
    this.updateWebAppPackageJSON(`file:../../${packagesFolder}${this.options.packageName}`);   

    // By updating the webApp's package.json we also need to update the config.json file with the new package
    this.webAppFoldersPath.forEach(webAppFolderPath => {
      const webAppConfigPath = path.join(webAppFolderPath, "config.json");
      const webAppConfigObject = this.fs.readJSON(this.destinationPath(webAppConfigPath));

      if (webAppConfigObject.packages.available.indexOf(this.options.packageName) < 0) {
        webAppConfigObject.packages.available.push(this.options.packageName);
        this.fs.writeJSON(webAppConfigPath, webAppConfigObject);
      }
    });

    // We also need to update the root's .dev-tasks.js so this new package is included in the global install and build tasks
    let filePath = `${this.destinationPath(".dev-tasks.json")}`,
    fileContent = this.fs.readJSON(this.destinationPath(filePath));
    if (fileContent.packages.indexOf(this.options.packageName) < 0) {
      fileContent.packages.push(this.options.packageName);  
    }
    this.fs.writeJSON(filePath, fileContent);      
  }

  /** 
  * Will install both the new package as well as the web app
  */
  install() {
    super.install(`src/packages/${this.options.packageName}`);  
    this.destinationRoot(`src/packages/${this.options.packageName}`);
    this.spawnCommandSync("gulp", ["build"]);
  }

  /**
   * Gets the description for each package in the packages array and returns an array with them
   */
  _getAppPackageDescriptions(webAppFolder: string, packages: {name: string}[]): {name?: string, type?: string, line?: string}[] {
    if (packages == null || packages.length === 0) {
      return [];
    }
    const packagesWithDescription: any[] = [];

    packages.forEach((packageChoice) => {
      // push the package into the choices
      const packageInfo: any[] = [];
      packageInfo.push(packageChoice);
      const packageName = packageChoice.name;
      const packageJsonPath = this.destinationPath(webAppFolder, "node_modules", packageName, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJSONObject = this.fs.readJSON(packageJsonPath);
        if (packageJSONObject != null && packageJSONObject["description"] != null && packageJSONObject["description"] != "") {
          packageInfo.push({type: "separator", line: `    ${packageJSONObject["description"]}`});
          packageInfo.push({type: "separator", line: "        "});
        }
      }
      packagesWithDescription.push(...packageInfo);
    })

    return packagesWithDescription;
  }
}
