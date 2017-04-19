'use strict';
var HtmlGenerator = require('../html.js');

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('pipeName', { type: String, required: true });
    this.options.pipeName = this.camelCaseValue(this.options.pipeName);
  }

  /**
   * Copies the pipe template to the proper folder
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {
      
      this.copyTpl(packageFolder, "pipe", this.options.pipeName, {pipe : {class : `${this.options.pipeName.charAt(0).toUpperCase()}${this.options.pipeName.slice(1)}`}}, [".ts"], null, false);
    }

    this.copyAndParse("pipes", copyAndParse);    
  }
};