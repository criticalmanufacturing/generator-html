/** Core */
import * as Core from "cmf.core/src/core";
 <% if (widget.isExtendingMes) { %> 
/** Mes */
import * as Mes from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
<% if (!widget.isADashboardWidget) { %> import * as Widget from "cmf.core.dashboards/src/widgets/widget/widget"; <% } %>
<% if (widget.isADashboardWidget) { %> import * as Widget from "../widget/widget"; <% } %>
import { <%= widget.class %>SettingsModule, <%= widget.class %>Settings } from "./<%= widget.name %>Settings";
/** i18n */
import i18n from "./i18n/<%= widget.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";


let inputs: Map<string, Widget.WidgetInput> = new Map<string, Widget.WidgetInput>();
// Place your inputs here (example : inputs.set("url", Widget.WidgetValueType.Url);)

let outputs: Map<string, Widget.WidgetOutput> = new Map<string, Widget.WidgetOutput>();
// Place your outputs here (example : outputs.set("submit", Widget.WidgetValueType.Object);)

/**
 * Please provide a meaningful description of this widget and how to use it
 * (Leave two lines separating the rest of the items)
 * 
 * 
 * ### Widget Inputs
 * * `string` : **inputA** - Widget Input A description
 * * `number` : **inputB** - Widget Input B description
 * * `Object[]` : **inputC** - Widget Input C description
 * * `boolean` : **dynamicInputD** _(dynamic)_ - Widget Dynamic Input D description
 * (Provide a detailed list of the widget inputs here as the example above)
 * 
 * ### Widget Outputs
 * (Provide a detailed list of the widget outputs here as the example of Widget Inputs above)
 * 
 * ### Inputs
 * (Provide a detailed list of the component inputs here as the example of Widget Inputs above)
 * 
 * ### Outputs
 * (Provide a detailed list of the component outputs here as the example of Widget Inputs above)
 * 
 * > **NOTES: (optional)**
 * > (Provide additional notes here, all lines of the notes must be preceded with '>')
 */
@Widget.Widget({
    name: "<%= widget.class %>",
    iconClass: "",
    inputs: inputs,
    outputs : outputs,
    settingsComponent: {
        module: <%= widget.class %>SettingsModule,
        component: <%= widget.class %>Settings
    }
})
@Core.Component({
    moduleId: __moduleName,
    selector: "<%= widget.selector %>Widget",
    templateUrl: "./<%= widget.name %>.html",
    styleUrls: ["./<%= widget.name %>.css"],
    inputs: [],
    assign: {
        "i18n": i18n
    }   
})
export class <%= widget.class %> extends<% if (widget.isExtendingMes) { %> Mes.MesComponent <% } %><% if (!widget.isExtendingMes) { %> Core.CoreComponent <% } %>implements ng.OnChanges, Widget.WidgetRepresentation {

    //#region Private properties

    //#endregion

    //#region Public properties

    /**
     * Defines how the widget will be represented
     */
    public uiWidgetViewMode: Widget.WidgetViewMode;

    //#endregion

    /**
     * <%= widget.class %> widget constructor
     * 
     * @param viewContainerRef View Container Ref
     */
    constructor(viewContainerRef: ng.ViewContainerRef) {
        super(viewContainerRef);        
    }

    //#region Private methods

    //#endregion   

    //#region Public methods
    
    /**
     * Angular 2 On Changes handler. Used to build our url
     * 
     * @param changes Changes descriptor.
     */
    public ngOnChanges(changes: ng.SimpleChanges): void {       

    }

    //#endregion
}

@Core.Module({
    imports: [
        
    ],
    declarations: [<%= widget.class %>],
    exports: [<%= widget.class %>]
})
export class <%= widget.class %>Module { }
