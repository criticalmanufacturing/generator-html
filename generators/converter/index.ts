import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    converterName: string
  }

  packageFolder: string;
  shouldInstall: boolean = false;

  constructor(args, opts) {
    super(args, opts);
    this.argument('converterName', { type: String, required: true });
    this.options.converterName = this.camelCaseValue(this.options.converterName);
  }

  /**
   * Copies the dataSource's templates to the proper folder and changes the Dashboard's path according to the repository in question. (If cmf.core, it's relative, if not, it's absolute)
   */
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {
      this.packageFolder = packageFolder;
      this.copyTpl(sourcePackageFolder, "converter", this.options.converterName, { converter : 
        { name: this.options.converterName,
          class : `${this.options.converterName.charAt(0).toUpperCase()}${this.options.converterName.slice(1)}`,        
          packagePrefix: this.ctx.packagePrefix,                
          isADashboardConverter : packageName.startsWith("cmf.core.dashboards")
        }
      }, 
      [".ts"], null, false);

      const dependencies = ["cmf.core.dashboards", "cmf.core"];
      this.shouldInstall = this.addPackageDependencies(packageFolder, dependencies, true);
    }

    return this.copyAndParse("converters", copyAndParse);    
  }

  install() {
    this.destinationRoot(this.packageFolder);
    if (this.shouldInstall) {
      this.spawnCommandSync('gulp', ['install']); 
    }
    this.spawnCommandSync('gulp', ['build']); 
  }
}
