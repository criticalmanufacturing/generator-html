/** Core */
import {Component, Module, CoreComponent} from "cmf.core/src/core";
<% if (widget.isExtendingMes) { %>
/** Mes */
import {MesComponent} from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
<% if (!widget.isADashboardWidget) { %>import {WidgetSettingsModule, WidgetSettingsService,
WidgetDynamicInput} from "cmf.core.dashboards/src/components/widgetSettings/widgetSettings";<% } %>
<% if (widget.isADashboardWidget) { %>import {WidgetSettingsModule, WidgetSettingsService,
WidgetDynamicInput} from "../../components/widgetSettings/widgetSettings";<% } %>
/** i18n */
import i18n from "./i18n/<%= widget.name %>.default";
/** Angular */
import * as ng from "@angular/core";

/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this Widget Settings and what it is needed for.
 * Also describe all the properties that are configurable in the correspondent Widget
 *
 * ### Widget Configurable Properties
 * * `string` : **name** _(default)_ - The name of the widget
 * * `string` : **description** _(default)_ - The description of the widget
 * * `string` : **iconClass** _(default)_ - The icon CSS class to change the widget icon
 *
 * @description
 *
 * ## <%= widget.class %> Widget Settings Component
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
 * * DirectiveA : `package`
 * * DirectiveB : `package`
 *
 */
@Component({
    moduleId: __moduleName,
    selector: "<%= widget.selector %>WidgetSettings",
    templateUrl: "./<%= widget.name %>Settings.html",
    styleUrls: ["./<%= widget.name %>Settings.css"]
})
export class <%= widget.class %>Settings extends<% if (widget.isExtendingMes) { %> MesComponent <% } %><% if (!widget.isExtendingMes) { %> CoreComponent <% } %> {

    //#region Private properties

    //#endregion

    //#region Public properties

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

    //#endregion

}

@Module({
    imports: [
        WidgetSettingsModule,
    ],
     declarations: [<%= widget.class %>Settings],
    exports: [<%= widget.class %>Settings]
})
export class <%= widget.class %>SettingsModule { }
