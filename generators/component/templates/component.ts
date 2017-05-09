/** Core */
import * as Core from "cmf.core/src/core";
 <% if (component.isExtendingMes) { %> 
/** Mes */
import * as Mes from "cmf.mes/src/mes";
<% } %>
/** Nested modules */

/** i18n */
import i18n from "./i18n/<%= component.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";

/**
 * Please provide a meaningful description of this component and how to use it
 * 
 * ## Inputs
 * * input: Description for Input
 * 
 * ## Outputs
 * * output: Description for output
 * 
 * ## Example
 * 
 * ```html
 * <your-custom-selector [input]="myInputValue" (output)="myOutputValue"></your-custom-selector>
 * ```
 */
@Core.Component({
    moduleId: __moduleName,
    selector: '<%= component.selector %>',
    inputs: [],
    outputs:[],
    templateUrl: './<%= component.name %>.html',
    styleUrls: ["./<%= component.name %>.css"],
    assign: { i18n : i18n }
	
})
export class <%= component.class %> extends<% if (component.isExtendingMes) { %> Mes.MesComponent <% } %><% if (!component.isExtendingMes) { %> Core.CoreComponent <% } %>implements ng.OnChanges {

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
    
    public ngOnChanges(changes: ng.SimpleChanges): void {
        
    }

    //#endregion
}

@Core.Module({
    imports: [
        
    ],
    declarations: [<%= component.class %>],   
    <% if (component.isRoutable) { %> 
    defaultRoute: <%= component.class %>,
    <% } %>
    exports: [<%= component.class %>]    
})
export class <%= component.class %>Module { }
