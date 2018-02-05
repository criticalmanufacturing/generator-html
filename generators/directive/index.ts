import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    directiveName: string
  }

  constructor(args, opts) {
    super(args, opts);
    this.argument('directiveName', { type: String, required: true });
    this.options.directiveName = this.camelCaseValue(this.options.directiveName);
  }

  /**
   * Copies the directive template and changes the type of component it inherits from, CoreComponent if coming from the COREHTML repository, MesComponent otherwise.
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {
      
      this.copyTpl(packageFolder, "directive", this.options.directiveName, {directive : 
        {
          name: this.options.directiveName,
          class : `${this.options.directiveName.charAt(0).toUpperCase()}${this.options.directiveName.slice(1)}`,
          selector: `${packageName.split(".").join("-")}-${this.options.directiveName}`,
          package: packageName
        }
      }, 
      [".ts"], null, false);
    }        

    this.copyAndParse("directives", copyAndParse);    
  }
}
