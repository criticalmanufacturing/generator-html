import { HtmlGenerator } from "../html";

export = class extends HtmlGenerator {

  options: {
    componentName: string
  }
  componentClass: string;
  isRoutable: boolean;
  packageFolder: string;
  

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
    var copyAndParse = (packageName, sourcePackageFolder, packageFolder) => {

      this.packageFolder = packageFolder;

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
            isExtendingMes: this.isExtendingMes(packageFolder)
          };
          this.componentClass = componentClass;
          this.isRoutable = component.isRoutable;

          let copyAndBuild = () => {
            this.copyTpl(sourcePackageFolder, "component", this.options.componentName, {component}, null, null, true);

            const dependencies = [component.isExtendingMes ? "cmf.mes" : "cmf.core"];
            this.addPackageDependencies(packageFolder, dependencies, true);
          }

          if (this.isRoutable === true) {
            return this.prompt([{
              type    : 'input',
              name    : 'url',
              message : `What will be the url (pascal case)?`
            }]).then((answers) => {
              if (typeof answers.url === "string" && answers.url !== "") {              
                // Now let's get this package's metadata file and add the new component's url to the routing table
                // Metadata is not a cjs module, so we have to read the file and check what's there, considering there can be no PageSwitcherContainer route or even flex routes defined.
                // This algorithm will make sure all situations are accounted. It will unshift the result instead of pushing as it would way more complicated to know where the array of literal end
                const metadataFile = this.destinationPath(`${sourcePackageFolder}/../${packageName}.metadata.ts`);
                const fileContent = this.fs.read(metadataFile);   
                const routeConfigSetting = { regex: /routeConfig[ ]{0,}:[\s\S]*?\[/, unshifter : () => {return `routeConfig: [\n                        {\n                            path: "${answers.url}",\n                            loadChildren: ` + "`${packageName}/src/components/" + `${this.options.componentName}/${this.options.componentName}#${this.componentClass}Module` + "`" + `,\n                            data: {title: "${this.componentClass}"}\n                        },\n`} };
                const routesSetting = { regex: /routes[ ]{0,}:[\s\S]*?\[/, unshifter: () => {return `routes: [\n{\n\n${routeConfigSetting.unshifter()}]\n}\n`} };
                const flexSetting = { regex: /flex[ ]{0,}:[\s\S]*?\{/, unshifter: () => {return `flex: {\n${routesSetting.unshifter()}],\n`} };
                const matchedSetting = [routeConfigSetting, routesSetting, flexSetting].find((setting) => fileContent.match(setting.regex) != null);
                
                if (matchedSetting) {
                  const stringToReplace = matchedSetting.unshifter();
                  if (stringToReplace != null) {
                    this.fs.write(metadataFile, fileContent.replace(matchedSetting.regex, stringToReplace));                   
                  } else {
                    this.log("Couldn't find the routes entry in the metadata file");
                  }
                }
                  
                copyAndBuild();
              }
            });
          } else {            
            copyAndBuild();
          }
        });   
      } 

      return this.copyAndParse("components", copyAndParse);    
  }

  install() {
    this.destinationRoot(this.packageFolder);
    this.spawnCommandSync('gulp', ['build']); 
  }
}
