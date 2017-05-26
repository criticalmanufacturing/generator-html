'use strict';
var Generator = require('yeoman-generator'),
    contextBuilder = require('@criticalmanufacturing/dev-tasks/main.js'),
		fs = require('fs'),
		context = require('./context.json');

module.exports = class HtmlGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);		
    this.conflicter.force = true;    
		this.ctx = {};
    // Javascript at its best
    contextBuilder.call(this, null, this.ctx);   
  }

	/**
	 * Simply camel cases the passed in value. All parameters should follow this rule.
	 */
	camelCaseValue(value) {
		return value[0].toLowerCase() + value.slice(1);
	}

	/**
	 * Updates the web app's package.json
	 */
  updateWebAppPackageJSON(packagePath) {
		let webAppFolderName = (this.options.packageName.startsWith("cmf.core") ? "cmf.core.web" : this.options.packageName.startsWith("cmf.mes") ? "cmf.mes.web" : `${this.ctx.packagePrefix}.web`),
        	webAppFolderPath = `apps/${webAppFolderName}`, 
        	webAppPackageJSONPath = `${webAppFolderPath}/package.json`,        	
        	webAppPackageJSONObject = this.fs.readJSON(this.destinationPath(webAppPackageJSONPath));            
    	this.webAppFolderPath = webAppFolderPath;        
    	if (!(this.options.packageName in webAppPackageJSONObject.dependencies)) {
    		webAppPackageJSONObject.cmfLinkDependencies[this.options.packageName] = packagePath;
    		webAppPackageJSONObject.optionalDependencies[this.options.packageName] = context.npmTag;
    		this.fs.writeJSON(webAppPackageJSONPath, webAppPackageJSONObject); 	
    	}    	
    	this.webAppFolderPath = webAppFolderPath;    	
	}

	/**
	 * Install a package and the web app from the same repository
	 */
	install(packagePath) {
		// Finally, we need to "gulp install", so the both the package and webApp are ready. We could do a global install, but it seems a bit overhead, so:
		// 1 - Install the new package from its folder
		// 2 - Install the web app from its folder
		let rootPath = this.destinationRoot();
		this.destinationRoot(packagePath);
		let ls = this.spawnCommand('gulp', ['install']);        
		ls.on('close', (code) => {
			this.destinationRoot(`${rootPath}/${this.webAppFolderPath}`);
			this.spawnCommand('gulp', ['install']);          
		});    
	}

	/**
	 * Copies and parses the templates being copied to a package from the same repository. The user can select which package to copy to.
	 */
	copyAndParse(packageInnerFolder, copyAndParseDelegate) {
		if (typeof this.config.get("package") === "string") {
      		copyAndParseDelegate(this.config.get("package"), `src/${packageInnerFolder}/`);
    	} else if (this.config.get("isRoot") === true) {
				let repositoryPackages = fs.readdirSync(this.destinationPath("src/packages")).filter((pkg) => !pkg.startsWith("."));				
	      this.prompt([{
	        type    : 'list',
	        name    : 'package',
					choices : repositoryPackages,
	        message : `Please select which package does this ${packageInnerFolder} belong to.`
	      }]).then((answers) => {
	        if (typeof answers.package === "string" && answers.package !== "") {
				copyAndParseDelegate(answers.package, `src/packages/${answers.package}/src/${packageInnerFolder}/`);
	        }
	      });
	    } else {
	      this.log("Couldn't resolve target package.");
	    }	    
	}

	/**
	 * Parses the template files being copied. 
	 */
	copyTpl(packageFolder, type, name, templateObject, standardFiles, extraFiles, is18nAvailable) {
		standardFiles = standardFiles || ['.ts', '.html', '.less'];
		extraFiles = extraFiles || [];
		let templatesToParse = [...standardFiles.concat(extraFiles).map((extension) => {
      		return { templateBefore: `${type}${extension}`, templateAfter: `${packageFolder}${name}/${name}${extension}`};}),
					...((is18nAvailable) ? ['default.ts', 'pt-PT.ts', 'de-DE.ts', 'vi-VN.ts'] : []).map((extension) => {
      			return { templateBefore: `i18n/${type}.${extension}`, templateAfter: `${packageFolder}${name}/i18n/${name}.${extension}`};})];            
      	templatesToParse.forEach((template) => {
        	this.fs.copyTpl(this.templatePath(template.templateBefore), this.destinationPath(`${template.templateAfter}`), templateObject)              
      	}); 
	}
};