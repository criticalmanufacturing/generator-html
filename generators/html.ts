import * as Generator from 'yeoman-generator';
import * as fs from "fs";
import * as path from "path";
var contextBuilder = require('@criticalmanufacturing/dev-tasks/main.js');

export class HtmlGenerator extends Generator {
	
	ctx: {
		libsFolder: string,
		packagePrefix: string,
		isCustomized: boolean,
		metadataFileName: string,
		metadata: any,
		__config:  {
			channel: string,
			registry: string	
		},
		__repositoryRoot: string,
		__projectName: string
	};

	options: any;

	get webAppFoldersPath(): string[] {
		const appPath = path.join(this.ctx.__repositoryRoot, "apps");
		// Read the folders in it
		const directories = fs.readdirSync(appPath);
		return directories
			.map(dir => path.join(this.ctx.__repositoryRoot, "apps", dir))
			.filter(dir => fs.statSync(dir).isDirectory);
	}
	
	constructor(args, opts) {
		super(args, opts);
		// Disable the conflicts by forcing everything
		(<any>this).conflicter.force = true;
		this.ctx = <any>{};
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
		this.webAppFoldersPath.forEach((webAppFolderPath) => {
			const webAppPackageJSONObject = this.fs.readJSON(this.destinationPath(webAppFolderPath, "package.json"));
		
			if (!(this.options.packageName in webAppPackageJSONObject.optionalDependencies)) {
				webAppPackageJSONObject.cmfLinkDependencies[this.options.packageName] = packagePath;
				webAppPackageJSONObject.optionalDependencies[this.options.packageName] = this.ctx.__config.channel;
				this.fs.writeJSON(this.destinationPath(webAppFolderPath, "package.json"), webAppPackageJSONObject); 	
			}
		})
	}

	/**
	 * Install a package and the web app from the same repository
	 */
	install(packagePath) {
		// Finally, we need to "gulp install", so the both the package and webApp are ready. We could do a global install, but it seems a bit overhead, so:
		// 1 - Install the new package from its folder
		// 2 - Install the web app from its folder

		// Save root package
		let rootPath = this.destinationRoot();

		// Install in the package
		this.destinationRoot(packagePath);
		let ls = this.spawnCommandSync('gulp', ['install']);

		// Install in all apps
		this.webAppFoldersPath.forEach((appFolderPath) => {
			this.destinationRoot(appFolderPath);
			this.spawnCommandSync('gulp', ['install']);
		});

		// Restore
		this.destinationRoot(rootPath);
	}

	/**
	 * Copies and parses the templates being copied to a package from the same repository. The user can select which package to copy to.
	 */
	copyAndParse(packageInnerFolder, copyAndParseDelegate: (packageName: string, sourcePackagePath: string, packagePack: string) => void) {
		if (typeof this.config.get("package") === "string") {
      		return copyAndParseDelegate(this.config.get("package"), `src/${packageInnerFolder}/`, this.destinationPath());
    	} else if (this.config.get("isRoot") === true) {
			let repositoryPackages = fs.readdirSync(this.destinationPath("src/packages")).filter((pkg) => !(pkg.indexOf(".") === 0));
			return this.prompt([{
				type    : 'list',
				name    : 'package',
				choices : repositoryPackages,
				message : `Please select which package does this ${packageInnerFolder} belong to.`
			}]).then((answers) => {
				if (typeof answers.package === "string" && answers.package !== "") {
					return copyAndParseDelegate(answers.package, `src/packages/${answers.package}/src/${packageInnerFolder}/`, `src/packages/${answers.package}`);
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

	/**
	 * Checks if a package is using core or mes
	 * @param packagePath Package path
	 */
	isExtendingMes(packagePath: string): boolean {
		// Read the package.json file
		const packageConfig = require(path.resolve(packagePath,"package.json"));
		
		if (packageConfig) {
			return [
				...Object.keys(packageConfig.dependencies || {}),
				...Object.keys(packageConfig.optionalDependencies || {})
			].some((dependency: string) => dependency.startsWith("cmf.mes"));
		}
		return false;
	}

	/**
	 * Adds the given dependencies to the package.json.
	 * If indicated, it also adds the links.
	 * @param packagePath Package path
	 * @param dependencies Dependencies list
	 * @param shouldLink Should also add dependency to cmfLinkDependencies
	 */
	addPackageDependencies(packagePath: string, dependencies: string[], shouldLink?: boolean): void {
		const packageJSONPath = this.destinationPath(packagePath, "package.json");
		const packageJSONObject = this.fs.readJSON(packageJSONPath);

		// Create dependencies container if not exist
		if (packageJSONObject.optionalDependencies == null) {
			packageJSONObject.optionalDependencies = {};
		}

		if (shouldLink && packageJSONObject.cmfLinkDependencies == null) {
			packageJSONObject.cmfLinkDependencies = {};
		}

		// Insert the dependencies using channel
		dependencies
			.filter(dependency => dependency !== packageJSONObject.name) // remove links to itself
			.forEach(dependency => {
			if (!(dependency in packageJSONObject.optionalDependencies)) {
				packageJSONObject.optionalDependencies[dependency] = this.ctx.__config.channel || "*";
			}

			if (shouldLink && !(dependency in packageJSONObject.cmfLinkDependencies)) {
				packageJSONObject.cmfLinkDependencies[dependency] = dependency.startsWith(this.ctx.packagePrefix) ?
						`file:../${dependency}` : `file:../../apps/${this.ctx.packagePrefix}.web/node_modules/${dependency}`;
			}
		})
        
        this.fs.writeJSON(packageJSONPath, packageJSONObject); 
	}
}
