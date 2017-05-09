//#region Imports
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
//#endregion

//#region Exports

//#endregion

//#region Constants

//#endregion

/**
 * ## Component name
 * 
 * Please provide a meaningful description of this component
 * Try to answer these questions: 
 * What is it?
 * What does it do?
 * Where to use it?
 * How to use it?
 * How it behaves with different sizes?
 * Does it retrieve data from any external source (server, local database, text file, etc...)?
 * 
 * ### Inputs
 * (Provide a detailed list of the inputs here. Syntax for each input description: "type [string, number, Object...] : name - description") Ex: 
 * `string` : **name** - The name of this component
 * `number` : **value** - The value of this component
 *
 * ### Outputs
 * (Provide a detailed list of the outputs here. Syntax for each output description: "type [string, number, Object...] : name - description") Ex: 
 * `string` : **onNameChange** - When the name of the component change, this output emits the new name
 * `number` : **onValueChange** - When the value of the component change, this output emits the new value
 * 
 * ### Dependencies
 * 
 * #### Components
 * (Provide a detailed list of components that this component depends on) Ex: 
 * * ComponentA
 * * ComponentB
 * 
 * #### Services
 * (Provide a detailed list of services that this component depends on) Ex:
 * * ServiceA
 * * ServiceB
 * 
 * #### Directives
 *  (Provide a detailed list of directives that this component depends on) Ex: 
 * * DirectiveA
 * * DirectiveB
 * 
 * ### Example
 * ```HTML
 * <your-custom-selector [input]="myInputValue" (output)="myOutputValue"></your-custom-selector>
 * ```
 *
 * > **NOTES:** (optional)
 * > (Provide additional notes here, all lines of the notes must be preceded by '>')
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

    /**
     * Constructor
     * 
     * @param viewContainerRef the reference to the component view container
     */
    constructor(viewContainerRef: ng.ViewContainerRef) { 
        super(viewContainerRef);
    }

    //#region Private methods

    //#endregion    

    //#region Public methods
    
    /**
     * On changes method
     * 
     * @param changes the changes made to the component properties
     */
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
