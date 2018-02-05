import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    wizardName: string
  }
  
  constructor(args, opts) {
    super(args, opts);    
    this.argument('wizardName', { type: String, required: true });
    this.options.wizardName = this.camelCaseValue(this.options.wizardName);
  }
  
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {
 
        let wizardClass = `Wizard${this.options.wizardName.charAt(0).toUpperCase()}${this.options.wizardName.slice(1)}`,
        wizardCamel = `${wizardClass.charAt(0).toLowerCase()}${wizardClass.slice(1)}`,
        wizard = {
          name: wizardCamel,
          class : wizardClass,
          selector: `${packageName.split(".").join("-")}-${wizardCamel}`,
          package: packageName,          
          isExtendingMes : (packageName.startsWith("cmf.core")) ? false : true
        };        
        this.copyTpl(packageFolder, "wizard", wizardCamel, {wizard}, null, null, true);             
      } 
      this.copyAndParse("components", copyAndParse);    
  }
}
