'use strict';
var HtmlGenerator = require('../html.js');  

module.exports = class extends HtmlGenerator {

  constructor(args, opts) {
    super(args, opts);
    this.argument('converterName', { type: String, required: true });
    this.options.converterName = this.camelCaseValue(this.options.converterName);
  }

  /**
   * Copies the dataSource's templates to the proper folder and changes the Dashboard's path according to the repository in question. (If cmf.core, it's relative, if not, it's absolute)
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {

      this.copyTpl(packageFolder, "converter", this.options.converterName, { converter : 
        { name: this.options.converterName,
          class : `${this.options.converterName.charAt(0).toUpperCase()}${this.options.converterName.slice(1)}`,        
          packagePrefix: this.ctx.packagePrefix,                
          isADashboardConverter : packageName.startsWith("cmf.core.dashboards")
        }
      }, 
      [".ts"], null, false);        
    } 

    this.copyAndParse("converters", copyAndParse);    
  }
};