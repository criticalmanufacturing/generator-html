/** Core */
import * as Core from "cmf.core/src/core";
/** Angular */
import * as ng from "@angular/core";

/**
 * Please provide a meaningful description of this directive and how to use it
 *
 */
@Core.Directive({
    selector: '[<%=directive.selector %>]',
    inputs: [],
    outputs:[]
})
export class <%= directive.class %> extends Core.Generic {

    //#region Private properties

    //#endregion

    //#region Public properties

    //#endregion

    constructor(viewContainerRef: ng.ViewContainerRef) { 
        super(viewContainerRef);
    }

    //#region Private methods

    //#endregion    

    //#region Public methods

    //#endregion
}

@Core.Module({
    imports: [
        
    ],
    declarations: [<%= directive.class %>],   
    exports: [<%= directive.class %>]    
})
export class <%= directive.class %>Module { }
