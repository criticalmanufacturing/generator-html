'use strict';
var HtmlGenerator = require('../html.js'),
    beautify = require('gulp-beautify');  

module.exports = class extends HtmlGenerator {
  constructor(args, opts) {
    super(args, opts);    
    this.argument('componentName', { type: String, required: true });
    this.options.componentName = this.camelCaseValue(this.options.componentName);
  }

  /**
   * Will prompt the user whether this new component should be accessible via an url or not. 
   * If not
   *    then the process moves to the actual template copying.
   * If so 
   *    then prompt the user what is the url to access the component.
   *    copy templates
   *    add the routeConfig to the metadata file
   * 
   * Last step will be building the package.
   */
  copyTemplates() {
    var copyAndParse = (packageName, packageFolder) => {

      return this.prompt([{
        type    : 'confirm',
        name    : 'isRoutable',
        message : `Will this component be accessible via url?`
        }]).then((answers) => {
          
          let componentClass = `${this.options.componentName.charAt(0).toUpperCase()}${this.options.componentName.slice(1)}`,
          component = {
            name: this.options.componentName,
            class : componentClass,
            selector: `${packageName.split(".").join("-")}-${this.options.componentName}`,
            package: packageName,
            isRoutable: answers.isRoutable,
            isExtendingMes : (packageName.startsWith("cmf.core")) ? false : true
          };
          this.componentClass = componentClass;
          this.isRoutable = component.isRoutable;

          let copyAndBuild = () => {
            this.copyTpl(packageFolder, "component", this.options.componentName, {component}, null, null, true);   
            this.destinationRoot(packageFolder);
            this.spawnCommand('gulp', ['build']); 
          }

          if (this.isRoutable === true) {
            this.prompt([{
              type    : 'input',
              name    : 'url',
              message : `What will be the url (pascal case)?`
            }]).then((answers) => {
              if (typeof answers.url === "string" && answers.url !== "") {              
                // Now let's get this package's metadata file and add the new component's url to the routing table
                // Metadata is not a cjs module, so we have to read the file and check what's there, considering there can be no PageSwitcherContainer route or even flex routes defined.
                // This algorithm will make sure all situations are accounted. It will unshift the result instead of pushing as it would way more complicated to know where the array of literal end
                let metadataFile = this.destinationPath(`${packageFolder}/../${packageName}.metadata.ts`),
                  fileContent = this.fs.read(metadataFile),   
                  routeConfigSetting =  { regex: /routeConfig[ ]{0,}:[\s\S]*?\[/, unshifter : () => {return `routeConfig : [{ path: "${answers.url}", loadChildren: ` + "`${packageName}/src/components/" + `${this.options.componentName}/${this.options.componentName}#${this.componentClass}Module` + "`" + `, data: { title: "${this.componentClass}"} },`} },     
                  routesSetting = { regex: /routes[ ]{0,}:[\s\S]*?\[/, unshifter: () => {return `routes: [\n{\n\n${routeConfigSetting.unshifter()}]\n}\n`} },
                  flexSetting = { regex: /flex[ ]{0,}:[\s\S]*?\{/, unshifter: () => {return `flex: {\n${routesSetting.unshifter()}],\n`} },                                    
                  matchedSetting = [routeConfigSetting, routesSetting, flexSetting].find((setting) => fileContent.match(setting.regex)),                  
                  stringToReplace = matchedSetting.unshifter();
                
                if (stringToReplace != null) {                  
                  this.registerTransformStream(beautify({indentSize: 2 })); // Jus clean it up a bit                       
                  this.fs.write(metadataFile, fileContent.replace(matchedSetting.regex, stringToReplace));                   
                } else {
                  this.log("Couldn't find the routes entry in the metadata file");
                }                  
                copyAndBuild();                 
              }
            });
          } else {            
            copyAndBuild();
          }
        });   
      } 

      this.copyAndParse("components", copyAndParse);    
  }
};