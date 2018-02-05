import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    widgetName: string
  }

  constructor(args, opts) {
    super(args, opts);
    this.argument('widgetName', { type: String, required: true });
    this.options.widgetName = this.camelCaseValue(this.options.widgetName);
  }

  /**
   * Copies all widget templates to the proper folder and changes the Dashboard's path according to the repository in question. (If cmf.core, it's relative, if not, it's absolute)
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {

      let widget = {
        name: this.options.widgetName,
        class : `${this.options.widgetName.charAt(0).toUpperCase()}${this.options.widgetName.slice(1)}`,
        selector: `${packageName.split(".").join("-")}-${this.options.widgetName}`,
        package: packageName,        
        isExtendingMes : (packageName.startsWith("cmf.core")) ? false : true,
        isADashboardWidget : packageName.startsWith("cmf.core.dashboards")
      };

      this.copyTpl.call(this, packageFolder, "widget", this.options.widgetName, {widget}, null, ["Settings.ts", "Settings.html", "Settings.less"], true);  
      this.destinationRoot(packageFolder);
      this.spawnCommand('gulp', ['build']); 
    } 

    this.copyAndParse.call(this, "widgets", copyAndParse);    
  }
};