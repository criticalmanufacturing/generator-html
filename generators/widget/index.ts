import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    widgetName: string
  }

  packageFolder: string;

  constructor(args, opts) {
    super(args, opts);
    this.argument('widgetName', { type: String, required: true });
    this.options.widgetName = this.camelCaseValue(this.options.widgetName);
  }

  /**
   * Copies all widget templates to the proper folder and changes the Dashboard's path according to the repository in question. (If cmf.core, it's relative, if not, it's absolute)
   */
  copyTemplates() {
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {
      this.packageFolder = packageFolder;
      let widget = {
        name: this.options.widgetName,
        class : `${this.options.widgetName.charAt(0).toUpperCase()}${this.options.widgetName.slice(1)}`,
        selector: `${packageName.split(".").join("-")}-${this.options.widgetName}`,
        package: packageName,        
        isExtendingMes : this.isExtendingMes(packageFolder),
        isADashboardWidget : packageName.startsWith("cmf.core.dashboards")
      };

      this.copyTpl.call(this, sourcePackageFolder, "widget", this.options.widgetName, {widget}, null, ["Settings.ts", "Settings.html", "Settings.less"], true);  
    } 

    this.copyAndParse.call(this, "widgets", copyAndParse);    
  }

  install() {
    this.destinationRoot(this.packageFolder);
    this.spawnCommandSync('gulp', ['build']); 
  }
};