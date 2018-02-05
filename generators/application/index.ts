import * as path from "path";
import { HtmlGenerator } from "../html";
import { Answers } from "yeoman-generator";

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
      throw new Error("Unable to continue, run @criticalmanufacturing/html first");
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
        message : `What is the application name?`,
        default : `${this.ctx.packagePrefix}.web`
      },
      {
        type    : "list",
        name    : "basePackage",
        message : "What is the base package you want to use?",
        choices : ["cmf.core.web.internal", "cmf.mes.web.internal", "other"]
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
      this.appName = answers.appName;
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
    this.fs.copy(this.templatePath("config.json"), this.destinationPath("config.json"));
    this.fs.copy(this.templatePath("index.html"), this.destinationPath("index.html"));
  }

  install() {
    // Install the web
    this.spawnCommandSync('gulp', ['install']);

    // Try to populate settings
    const configPath = this.destinationPath("node_modules", this.basePackage, "config.setup.json");
    // Add here other files that may have settings
    if (this.fs.exists(configPath)) {
      this.fs.copy(configPath, this.destinationPath("config.json"));
    }
  }
}
