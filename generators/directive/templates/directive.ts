/** Core */
import {Directive, Module, Generic} from "cmf.core/src/core";
/** Angular */
import * as ng from "@angular/core";

/**
 * Please provide a meaningful description of this directive and how to use it
 *
 */
@Directive({
    selector: '[<%=directive.selector %>]',
    inputs: [],
    outputs: []
})
export class <%= directive.class %> extends Generic {

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

@Module({
    imports: [],
    declarations: [<%= directive.class %>],
    exports: [<%= directive.class %>]
})
export class <%= directive.class %>Module { }
