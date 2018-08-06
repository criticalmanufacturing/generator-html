import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    wizardName: string
  }
  shouldInstall: boolean = false;
  packageFolder: string;
  
  constructor(args, opts) {
    super(args, opts);    
    this.argument('wizardName', { type: String, required: true });
    this.options.wizardName = this.camelCaseValue(this.options.wizardName);
  }
  
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {        
      this.packageFolder = packageFolder;
      if (this.options.wizardName.toLowerCase().startsWith("wizard")) {
        this.options.wizardName = this.options.wizardName.slice(6);
      }
      let wizardClass = `Wizard${this.options.wizardName.charAt(0).toUpperCase()}${this.options.wizardName.slice(1)}`,
      wizardCamel = `${wizardClass.charAt(0).toLowerCase()}${wizardClass.slice(1)}`,
      wizard = {
        name: wizardCamel,
        class : wizardClass,
        selector: `${packageName.split(".").join("-")}-${wizardCamel}`,
        package: packageName,          
        isExtendingMes : this.isExtendingMes(packageFolder)
      };
      this.copyTpl(sourcePackageFolder, "wizard", wizardCamel, {wizard}, null, null, true);

      const dependencies = ["cmf.core", "cmf.core.business.controls", "cmf.core.controls", "cmf.lbos"];
      dependencies.push(wizard.isExtendingMes ? "cmf.mes" : "cmf.core");
      this.shouldInstall = this.addPackageDependencies(packageFolder, dependencies, true);
    }

    return this.copyAndParse("components", copyAndParse);    
  }

  install() {
    this.destinationRoot(this.packageFolder);
    if (this.shouldInstall) {
      this.spawnCommandSync('gulp', ['install']); 
    }
    this.spawnCommandSync('gulp', ['build']); 
  }
}
