import {<%= superFramework.aliasExport %>Component, ComponentFramework as <%= superFramework.aliasExport %>ComponentFramework} from "<%= superFramework.name %>/src/<%= superFramework.mainModule %>";
import {<%= subFramework.aliasExport %>Object} from "./object";
import {Framework, <%= subFramework.aliasExport %>Framework} from "./framework";
import {Sandbox} from "./sandbox";

export class <%= subFramework.aliasExport %>Component extends <%= superFramework.aliasExport %>Component implements <%= subFramework.aliasExport %>Object {
    public framework: ComponentFramework;

    constructor(...options) {
        super(options);
    }

}

export class ComponentFramework extends <%= superFramework.aliasExport %>ComponentFramework implements <%= subFramework.aliasExport %>Framework {
    
    /**
     * <%= subFramework.aliasExport %> Component Sandbox
     */
    public sandbox: Sandbox;

    constructor() {
        super();

        this.sandbox = new Sandbox();
    }
}