import * as path from "path";
import { HtmlGenerator } from "../html";
import { Answers } from "yeoman-generator";

export = class extends HtmlGenerator {

  packagePrefix: string;
  registry: string;
  channel: string;

  constructor(args, opts) {
    super(args, opts);

    this.log("***************Welcome to the HTML scaffolding tool***************\n\n");
  }

  /**
   * This method will prompt the user with some settings that need to be configured before going deeper into customization projects.
   */
  prompting() {
    return this.prompt([
      {
        type    : "input",
        name    : "packagePrefix",
        message : "Please specify the client's prefix (example: cmf) ",
        default : null,
        validate: (input: string, answers: Answers): boolean => {
          return typeof input === "string" && !!input && input !== "cmf";
        },
        store   : true
      },
      {
        type    : "input",
        name    : "registry",
        message : "What is your npm registry endpoint? ",
        store   : true
      },
      {
        type    : "input",
        name    : "channel",
        message : "What is the channel you want to use?",
        store   : true
      }
    ]).then((answers) => {
      this.packagePrefix = answers.packagePrefix;
      this.registry = answers.registry;
      this.channel = answers.channel;
 	 });
  }

  writing() {
    // Let's update the main.js from the dev.tasks, so this setting is persisted for install and build tasks
    const filePath = ".dev-tasks.json";
    let fileContent = this.fs.readJSON(this.destinationPath(filePath), {});
    fileContent.packagePrefix = this.packagePrefix;
    fileContent.framework = "";
    fileContent.webAppPrefix = this.packagePrefix;
    fileContent.isWebAppCompilable = false;
    fileContent.dependencies = [];
    fileContent.packages = [];
    fileContent.registry = this.registry || this.ctx.__config.registry;
    fileContent.channel = this.channel || this.ctx.__config.channel;
    this.fs.writeJSON(filePath, fileContent);
  }
}
