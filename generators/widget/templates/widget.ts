/** Core */
import {Component, Module, CoreComponent} from "cmf.core/src/core";
<% if (widget.isExtendingMes) { %>
/** Mes */
import {MesComponent} from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
<% if (!widget.isADashboardWidget) { %>import * as Widget from "cmf.core.dashboards/src/widgets/widget/widget";<% } %>
<% if (widget.isADashboardWidget) { %> import * as Widget from "../widget/widget";<% } %>
import { <%= widget.class %>SettingsModule, <%= widget.class %>Settings } from "./<%= widget.name %>Settings";
/** i18n */
import i18n from "./i18n/<%= widget.name %>.default";
/** Angular */
import * as ng from "@angular/core";


const inputs: Map<string, Widget.WidgetInput> = new Map<string, Widget.WidgetInput>();
// Place your inputs here (example : inputs.set("url", Widget.WidgetValueType.Url);)

const outputs: Map<string, Widget.WidgetOutput> = new Map<string, Widget.WidgetOutput>();
// Place your outputs here (example : outputs.set("submit", Widget.WidgetValueType.Object);)

/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this widget.
 * Try to answer these questions here:
 * * What is it?
 * * What it does?
 * * How does it behave with different sizes?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 *
 * @howToUse
 *
 * The widget is used in an UIPage with the inputs and outputs mentioned below.
 *
 * Also the configurable settings of the widget are referred in Widget Settings Component
 *
 * Besides the description above, please complement it with a meaningful description of this widget that answer these questions:
 * * How to use it?
 * * Where and When to use it?
 *
 * ### Widget Inputs
 * * `string` : **name** _(default)_ - The name of the widget
 * * `string` : **description** _(default)_ - The description of the widget
 * * `string` : **iconClass** _(default)_ - The icon CSS class to change the widget icon
 *
 * ### Widget Outputs
 * * `string` : **valueChange** _(default)_ - The icon CSS class to change the widget icon
 *
 * ### Widget Settings
 * See {@link WidgetSettingsComponent}
 *
 * ### _NOTES_
 * (Optional: Provide additional notes here)
 *
 * @description
 *
 * ## Widget Component Name
 *
 * ### Dependencies
 *
 * #### Components
 * * ComponentA : `package`
 * * ComponentB : `package`
 *
 * #### Services
 * * ServiceA : `package`
 * * ServiceB : `package`
 *
 * #### Directives
 * * DirectiveA : `package` (Ex: `cmf.core.controls`)
 * * DirectiveB : `package` (Ex: `cmf.core.controls`)
 *
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
@Component({
    moduleId: __moduleName,
    selector: "<%= widget.selector %>Widget",
    templateUrl: "./<%= widget.name %>.html",
    styleUrls: ["./<%= widget.name %>.css"],
    inputs: [],
    assign: {
        "i18n": i18n
    }
})
export class <%= widget.class %> extends Widget.WidgetGeneric implements ng.OnChanges, Widget.WidgetRepresentation {

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
        super(viewContainerRef.element);
    }

    //#region Private methods

    //#endregion

    //#region Public methods

    /**
     * Angular 2 On Changes handler. Used to build our url
     *
     * @param changes Changes descriptor.
     */
    public ngOnChanges(changes: ng.SimpleChanges): void {}

    //#endregion
}

@Module({
    imports: [
    ],
    declarations: [<%= widget.class %>],
    exports: [<%= widget.class %>]
})
export class <%= widget.class %>Module { }
