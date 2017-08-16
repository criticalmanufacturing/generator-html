'use strict';
var HtmlGenerator = require('../html.js'),
    beautify = require('gulp-beautify');  

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);    
    this.argument('executionViewName', { type: String, required: true });
    this.options.executionViewName = this.camelCaseValue(this.options.executionViewName);
  }
  
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {
 
        let executionViewClass = `ExecutionView${this.options.executionViewName.charAt(0).toUpperCase()}${this.options.executionViewName.slice(1)}`,
        executionViewCamel = `${executionViewClass.charAt(0).toLowerCase()}${executionViewClass.slice(1)}`,
        executionView = {
          name: executionViewCamel,
          class : executionViewClass,
          selector: `${packageName.split(".").join("-")}-${executionViewCamel}`,
          package: packageName,          
          isExtendingMes : (packageName.startsWith("cmf.core")) ? false : true
        };        
        this.copyTpl(packageFolder, "executionView", executionViewCamel, {executionView}, null, null, true);             
      } 
      this.copyAndParse("components", copyAndParse);    
  }
};