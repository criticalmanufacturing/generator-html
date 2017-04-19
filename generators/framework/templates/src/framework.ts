import * as <%= superFramework.aliasExport %> from "<%= superFramework.name %>/src/<%= superFramework.mainModule %>";
import {SandboxManager} from "cmf.taura/src/taura";
import {<%= subFramework.aliasExport %>Config} from "./domain/config/<%= subFramework.mainModule %>.config";
import {Sandbox} from "./domain/sandbox";

//Let's use the <%= superFramework.mainModule %> as the entry point to export all relevant APIs from the <%= superFramework.name %>
//******<%= superFramework.aliasExport %> COMPONENT AND GENERIC*******
export * from "<%= superFramework.name %>/src/<%= superFramework.mainModule %>";
export * from "./domain/component";
export {ComponentFramework} from "./domain/component";
export * from "./domain/framework";
export {Framework} from "./domain/framework";

export class <%= subFramework.aliasExport %> extends <%= superFramework.aliasExport %>.<%= superFramework.aliasExport %> {

    /**
     * Gets or sets the configuration object for <%= subFramework.aliasExport %>.
     */
    public config: <%= subFramework.aliasExport %>Config;

    /**
     * Gets the <%= subFramework.aliasExport %> Sandbox.
     */
    public sandbox: Sandbox;

    /**
    * Namespace for sanboxes related methods (creates and brand new and gets an existing one).
    *
    * @type {SandboxManager}
    */
    public sandboxManager: SandboxManager<Sandbox>;

    /**
     * <%= subFramework.aliasExport %> Constructor.
     *
     * @param config <%= subFramework.aliasExport %> Configuration
     */
    constructor(config: <%= subFramework.aliasExport %>Config) {
        super(config);

        // Declare <%= subFramework.aliasExport %> extensions
        // Example:
	//this.use("<%= subFramework.name %>/src/extensions/app.context", "AppContextImplementation");
        
    }

}