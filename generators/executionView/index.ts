import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);    
    this.argument('executionViewName', { type: String, required: true });
    this.options.executionViewName = this.camelCaseValue(this.options.executionViewName);
  }
  
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {
        let executionViewClass = `ExecutionView${this.options.executionViewName.charAt(0).toUpperCase()}${this.options.executionViewName.slice(1)}`,
        executionViewCamel = `${executionViewClass.charAt(0).toLowerCase()}${executionViewClass.slice(1)}`,
        executionView = {
          name: executionViewCamel,
          class : executionViewClass,
          selector: `${packageName.split(".").join("-")}-${executionViewCamel}`,
          package: packageName,          
          isExtendingMes : this.isExtendingMes(packageFolder)
        };        
        this.copyTpl(sourcePackageFolder, "executionView", executionViewCamel, {executionView}, null, null, true);             
      } 
      this.copyAndParse("components", copyAndParse);    
  }
}
