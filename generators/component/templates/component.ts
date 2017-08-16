//#region Imports
/** Core */
import {Component, Module, CoreComponent} from "cmf.core/src/core";
<% if (component.isExtendingMes) { %> 
/** Mes */
import {MesComponent} from "cmf.mes/src/mes";
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
 * @whatItDoes
 *
 * Please provide a meaningful description of this component
 * Try to answer these questions:
 * * What is it?
 * * What it does?
 * * How does it behave with different sizes?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 *
 * @howToUse
 *
 * This component is used with the inputs and outputs mentioned below.
 *
 * Besides the description above, please complement it with a meaningful description of this component that answer these questions:
 * * How to use it?
 * * Where and When to use it?
 *
 * ### Inputs
 * (Provide a detailed list of the inputs here. Syntax for each input description:
 * " * type [string, number, Object...] : name - description") Ex:
 * `string` : **name** - The name of this component
 * `number` : **value** - The value of this component
 *
 * ### Outputs
 * (Provide a detailed list of the outputs here. Syntax for each output description:
 * " * type [string, number, Object...] : name - description") Ex:
 * `string` : **onNameChange** - When the name of the component change, this output emits the new name
 * `number` : **onValueChange** - When the value of the component change, this output emits the new value
 *
 * ### Example
 * To use the component, assume this HTML Template as an example:
 *
 * ```HTML
 * <your-custom-selector [input]="myInputValue" (output)="myOutputValue"></your-custom-selector>
 * ```
 *
 * ### _NOTES_ (optional)
 * (Provide additional notes here)
 *
 * @description
 *
 * ## <%= component.class %> Component
 *
 * ### Dependencies
 *
 * #### Components
 * (Provide a detailed list of components that this component depends on) Ex:
 * * ComponentA : `package` (Ex: `cmf.core.controls`)
 * * ComponentB : `package` (Ex: `cmf.core.controls`)
 *
 * #### Services
 * (Provide a detailed list of services that this component depends on) Ex:
 * * ServiceA : `package` (Ex: `cmf.core.controls`)
 * * ServiceB : `package` (Ex: `cmf.core.controls`)
 *
 * #### Directives
 *  (Provide a detailed list of directives that this component depends on) Ex:
 * * DirectiveA : `package` (Ex: `cmf.core.controls`)
 * * DirectiveB : `package` (Ex: `cmf.core.controls`)
 *
 */
@Component({
    moduleId: __moduleName,
    selector: '<%= component.selector %>',
    inputs: [],
    outputs: [],
    templateUrl: './<%= component.name %>.html',
    styleUrls: ["./<%= component.name %>.css"],
    assign: { i18n : i18n }
})
export class <%= component.class %> extends<% if (component.isExtendingMes) { %> MesComponent <% } %><% if (!component.isExtendingMes) { %> CoreComponent <% } %>implements ng.OnChanges {

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
    public ngOnChanges(changes: ng.SimpleChanges): void {}

    //#endregion
}

@Module({
    imports: [
    ],
    declarations: [<%= component.class %>],
    <% if (component.isRoutable) { %>defaultRoute: <%= component.class %>,<% } %>
    exports: [<%= component.class %>]
})
export class <%= component.class %>Module { }
