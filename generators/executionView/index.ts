import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {
  packageFolder: string;
  shouldInstall: boolean = false;

  constructor(args, opts) {
    super(args, opts);    
    this.argument('executionViewName', { type: String, required: true });
    this.options.executionViewName = this.camelCaseValue(this.options.executionViewName);
  }
  
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {
        this.packageFolder = packageFolder;
        let executionViewClass = `${this.options.executionViewName.charAt(0).toUpperCase()}${this.options.executionViewName.slice(1)}`,
        executionViewCamel = `${executionViewClass.charAt(0).toLowerCase()}${executionViewClass.slice(1)}`,
        executionView = {
          name: executionViewCamel,
          class : executionViewClass,
          selector: `${packageName.split(".").join("-")}-${executionViewCamel}`,
          package: packageName,          
          isExtendingMes : this.isExtendingMes(packageFolder)
        };        
        this.copyTpl(sourcePackageFolder, "executionView", executionViewCamel, {executionView}, null, null, true);             

        const dependencies = ["cmf.core.business.controls", "cmf.core.controls", "cmf.core", "cmf.lbos"];
        dependencies.push(executionView.isExtendingMes ? "cmf.mes" : "cmf.core");
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
