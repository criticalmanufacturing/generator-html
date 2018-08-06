import * as path from "path";
import { HtmlGenerator , WebAppName } from "../html";
import { Answers } from "yeoman-generator";

/**
 * Interface the contains the address of a registry and the corresponding available channels
 */
interface RegistryChannels {
  /**
   * Address of the registry
   */
  registry: string,
  /**
   * Available channels
   */
  channels: string[] | null;
}

export = class extends HtmlGenerator {

  packagePrefix: string;
  registry: string;
  channel: string;

  constructor(args, opts) {
    super(args, opts);

    this.option("keep", {type: Boolean, default: false});

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
        message : "Please specify the client's prefix (example: customization) ",
        default : null,
        validate: (input: string, answers: Answers): boolean => {
          return typeof input === "string" && !!input && input !== "cmf";
        },
        store   : true
      }
    ]).then((prefixAnswers) => {
      this.packagePrefix = prefixAnswers.packagePrefix;
      // Get the registry endpoint
      return this._promptForRegistry()
      .then((registryChannels) => {
        this.registry = registryChannels.registry;
        let options: string[] | null = null;
        // If there are channels, use them on the prompt for channel
        if (registryChannels != null && registryChannels.channels != null) {
          options = registryChannels.channels;
          options.push("other");
        }
        // Get the channel
        return this._promptForChannel(options)
        .then((channel) => {
          this.channel = channel;
        });
      })
 	 });
  }

  writing() {
    // Let's update the main.js from the dev.tasks, so this setting is persisted for install and build tasks
    const filePath = ".dev-tasks.json";
    let fileContent = this.fs.readJSON(this.destinationPath(filePath), {});
    fileContent.packagePrefix = this.packagePrefix;
    fileContent.framework = this.options.keep ? fileContent.framework || "" : "";
    fileContent.webAppPrefix = this.packagePrefix;
    fileContent.isWebAppCompilable = this.options.keep ? fileContent.isWebAppCompilable || false : false;
    fileContent.dependencies = this.options.keep ? fileContent.dependencies || [] : [];
    fileContent.packages = this.options.keep ? fileContent.packages || [] : [];
    fileContent.registry = this.registry || this.ctx.__config.registry;
    fileContent.channel = this.channel || this.ctx.__config.channel;
    this.fs.writeJSON(filePath, fileContent);

    // Save this level as the root
    this.config.set("isRoot", true);
    this.config.save();
  }

  /**
   * Utility method to prompt the user for channel
   * @param options Available channels from the user to choose from
   * @returns String containing the chosen channel
   */
  private _promptForChannel(options: string[] | null): Promise<string> {
    // Prompt for the user to select a channel from the list
    if (options != null && options.length > 0) {
      return this.prompt([
        {
          type    : "list",
          name    : "channel",
          message : "What channel from the available channels do you want to use?",
          choices : options
        },
      ]).then((listAnswers) => {
        if (listAnswers.channel === "other") {
          return this._promptForChannel(null);
        } else {
          return listAnswers.channel;
        }
      })
    } else {
      // Prompt for the user to input a channel
      return this.prompt([
        {
          type    : "input",
          name    : "channel",
          message : "What is the channel you want to use?",
          validate: (input: string, answers: Answers): boolean  => {
            return typeof input === "string" && !!input;
          },
          store: true
        }
      ]).then((channelAnswer) => {
        return channelAnswer.channel;
      });
    }
  }

  /**
   * Utility method to ask the user to supply a channel
   * @returns Registry and channel, if any
   */
  _promptForRegistry(): Promise<RegistryChannels> {
    return this.prompt([
      {
        type    : "input",
        name    : "registry",
        message : "What is your npm registry endpoint? ",
        validate: (input: string, answers: Answers): boolean => {
          return typeof input === "string" && !!input;
        },
        store   : true
      },
    ]).then((answers) => {
      // Get the available channels and check that we can connect
      const registryChannels = this._getChannelsFromRegistry(answers.registry);
      if (registryChannels != null && registryChannels.channels != null && registryChannels.channels.length > 0) {
          return registryChannels;
        } else {
          return this.prompt({
            type    : "input",
            name    : "confirmSkip",
            message : "Registry was not found, do you wish to continue anyway? (y/n)",
            validate: (input: string, answers: Answers): boolean => {
              return typeof input === "string" && !!input;
            },
            store : false
          }).then((confirmAnswers) => {
              if (confirmAnswers.confirmSkip === "y" || confirmAnswers.confirmSkip === "yes" || confirmAnswers.confirmSkip === "Y" || confirmAnswers.confirmSkip === "YES") {
                return <RegistryChannels> {
                  registry: answers.registry,
                  channels: null
                }
              } else {
                return this._promptForRegistry();
              }
          })
        }
    });
  }

  /**
   * Retrieves the available channel by calling npm info for the given registry
   * @param registry registry endpoint
   * @returns Registry and available channels, if any
   */
  private _getChannelsFromRegistry(registry: string): RegistryChannels {
    try {
      const result = this.spawnCommandSync("npm", ["info", WebAppName.MES, `--registry=${registry}`, `--fetch-retry-maxtimeout=10`, `--fetch-retry-mintimeout=5`, "--json"], {stdio: 'pipe'});
      if (result != null && result.stdout != null) {
        const json = this._Utf8ArrayToStr(result.stdout)
        if (json != null) {
          const packageJson = JSON.parse(json);
          if (packageJson != null && packageJson["dist-tags"] != null) {
            const channels = Object.keys(packageJson["dist-tags"]);
            return <RegistryChannels> {
              registry: registry,
              channels: channels
            }
          }
        }
      }
    } catch(e) {
      return <RegistryChannels> {
        registry: registry,
        channels: null
      }
    }

    return <RegistryChannels> {
      registry: registry,
      channels: null
    }
  }


  /* utf.js - UTF-8 <=> UTF-16 conversion
   *
   * http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
   * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
   * Version: 1.0
   * LastModified: Dec 25 1999
   * This library is free.  You can redistribute it and/or modify it.
   */
  private _Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                      ((char2 & 0x3F) << 6) |
                      ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}
}
