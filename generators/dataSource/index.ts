import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    dataSourceName: string
  }

  constructor(args, opts) {
    super(args, opts);
    this.argument('dataSourceName', { type: String, required: true });
    this.options.dataSourceName = this.camelCaseValue(this.options.dataSourceName);
  }

  /**
   * Copies the dataSource templates and changes the Dashboard's path according to the repository in question. (If cmf.core, it's relative, if not, it's absolute)
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {

      this.copyTpl(packageFolder, "dataSource", this.options.dataSourceName, {dataSource : 
        { name: this.options.dataSourceName,
          class : `${this.options.dataSourceName.charAt(0).toUpperCase()}${this.options.dataSourceName.slice(1)}`,                  
          isADashboardDataSource : packageName.startsWith("cmf.core.dashboards")
        }
      }, [".ts"], null, true);      
    } 

    this.copyAndParse("dataSources", copyAndParse);    
  }
}
