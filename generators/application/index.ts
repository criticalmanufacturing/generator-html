import * as path from "path";
import { HtmlGenerator , WebAppName} from "../html";
import { Answers } from "yeoman-generator";
import * as fs from "fs";
export = class extends HtmlGenerator {

  appName: string;
  basePackage: string;

  constructor(args, opts) {
    super(args, opts);
  }

  /**
   * Checks for package prefix
   */
  initializing() {
    if (!this.ctx.packagePrefix || !this.ctx.__config || !this.ctx.__config.registry || !this.ctx.__config.channel) {
      throw new Error("Unable to continue, run yo @criticalmanufacturing/html first");
    }
  }

  /**
   * This method will prompt the user with some settings that need to be configured before going deeper into customization projects.
   */
  prompting() {
    return this.prompt([
      {
        type    : "input",
        name    : "appName",
        message : `What is the application name? ${this.ctx.packagePrefix}.`,
        default : `web`
      },
      {
        type    : "list",
        name    : "basePackage",
        message : "What is the base package you want to use?",
        choices : [WebAppName.MES, WebAppName.Core , "other"]
      },
      {
        type    : "input",
        name    : "otherPackage",
        message : "What is the base package you want to use?",
        when    : (answers: Answers): boolean => {
          return answers.basePackage === "other";
        }
      }
    ]).then((answers) => {
      console.log(answers);
      this.appName = `${this.ctx.packagePrefix}.${answers.appName}`;
      this.basePackage = answers.otherPackage ? answers.otherPackage : answers.basePackage;
 	 });
  }

  writing() {
    // Create a new folder in the apps
    const packageName = this.appName;
    this.destinationRoot(path.join(this.ctx.__repositoryRoot, "apps", packageName));

    if (this.ctx.__config.registry) {
      this.fs.copyTpl(this.templatePath("__.npmrc"), this.destinationPath(".npmrc"), {registry: this.ctx.__config.registry});
    }
    this.fs.copy(this.templatePath("__.npmignore"), this.destinationPath(".npmignore"));
    this.fs.copyTpl(this.templatePath("gulpfile.js"), this.destinationPath("gulpfile.js"), {package: packageName});
    this.fs.copyTpl(this.templatePath("package.json"), this.destinationPath("package.json"), {
      package: packageName,
      basePackage: this.basePackage,
      channel: this.ctx.__config.channel,
      registry: this.ctx.__config.registry
    });
    this.fs.copy(this.templatePath("web.config"), this.destinationPath("web.config"));
    this.fs.copy(this.templatePath("manifest.json"), this.destinationPath("manifest.json"));
    this.fs.copyTpl(this.templatePath("index.html"), this.destinationPath("index.html"), {isExtendingMes: this.basePackage === WebAppName.MES});
  }

  install() {
    // Install the web
    this.spawnCommandSync('gulp', ['install']);

    // Try to populate settings
    const configPath = this.destinationPath("node_modules", this.basePackage, "config.setup.json");
    // Add here other files that may have settings
    if (this.fs.exists(configPath)) {
      // Try to assign dynamic bundles location (optional task)
      try {

        // Escape config JSON
        var configFile = fs.readFileSync(this.destinationPath("config.json"), 'utf8');
        configFile = configFile.replace(/"\$\(.*\)"/g, "\"\"");
        configFile = configFile.replace(/\$\(.*\)/g, '0');
        fs.writeFileSync(this.destinationPath("config.json"), configFile);
        var configFileJSON = JSON.parse(configFile);


        // Fill some default values (bundlePath)
        if (configFileJSON && configFileJSON.packages && "bundlePath" in configFileJSON.packages
          && configFileJSON.packages.bundlePath) {
          if (configFileJSON.packages.bundlePath[0] !== "/") {
            configFileJSON.packages.bundlePath = "/" + configFileJSON.packages.bundlePath;
          }
          if (this.fs.exists(this.destinationPath("node_modules", this.basePackage, configFileJSON.packages.bundlePath))) {
            configFileJSON.packages.bundlePath = "node_modules/" + this.basePackage + configFileJSON.packages.bundlePath;
          } else {
            configFileJSON.packages.bundlePath = "";
          }
        }

        // Persist JSON
        fs.writeFileSync(this.destinationPath("config.json"), JSON.stringify(configFileJSON, null, "\t"));

      } catch { }
    } else {
      this.fs.copy(this.templatePath("config.json"), this.destinationPath("config.json"));
    }

    this.log(`Please configure the file ${this.destinationPath("config.json")}`);
  }
}