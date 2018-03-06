import {<%= superFramework.aliasExport %>Sandbox} from "<%= superFramework.name %>/src/domain/sandbox";

/**
 * <%= subFramework.aliasExport %> Sandbox
 * Contains a reference to all the public extensions of the framework
 */
export class Sandbox extends <%= superFramework.aliasExport %>Sandbox {

    /**
     * Sandbox Constructor.
     *
     * FOR INTERNAL USE ONLY.
     */
    constructor() {
        super();
    }
}
