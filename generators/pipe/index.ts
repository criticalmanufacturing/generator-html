import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    pipeName: string
  }

  constructor(args, opts) {
    super(args, opts);
    this.argument('pipeName', { type: String, required: true });
    this.options.pipeName = this.camelCaseValue(this.options.pipeName);
  }

  /**
   * Copies the pipe template to the proper folder
   */
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {
      
      this.copyTpl(sourcePackageFolder, "pipe", this.options.pipeName, {pipe : {class : `${this.options.pipeName.charAt(0).toUpperCase()}${this.options.pipeName.slice(1)}`}}, [".ts"], null, false);

      this.addPackageDependencies(packageFolder, ["cmf.core"], true);
    }

    return this.copyAndParse("pipes", copyAndParse);    
  }
}
