/** Core */
import * as Core from "cmf.core/src/core";
 <% if (widget.isExtendingMes) { %> 
/** Mes */
import * as Mes from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
<% if (!widget.isADashboardWidget) { %>import {WidgetSettingsModule, WidgetSettingsService, WidgetDynamicInput} from "cmf.core.dashboards/src/components/widgetSettings/widgetSettings"; <% } %>
<% if (widget.isADashboardWidget) { %>import {WidgetSettingsModule, WidgetSettingsService, WidgetDynamicInput} from "../../components/widgetSettings/widgetSettings"; <% } %>
/** i18n */
import i18n from "./i18n/<%= widget.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";

/**
 * <%= widget.class %> Widget Settings
 * 
 * Please provide a meaningful description of this widget and how to use it
 * 
 * ## Example
 * 
 * ```html
 * <<%= widget.selector %>WidgetSettings></<%= widget.selector %>WidgetSettings>
 * ```
 */
@Core.Component({
    moduleId: __moduleName,
    selector: "<%= widget.selector %>WidgetSettings",    
    templateUrl: "./<%= widget.name %>Settings.html",
    styleUrls: ["./<%= widget.name %>Settings.css"]       
})
export class <%= widget.class %>Settings extends<% if (widget.isExtendingMes) { %> Mes.MesComponent <% } %><% if (!widget.isExtendingMes) { %> Core.CoreComponent <% } %> {
    
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

@Core.Module({
    imports: [
        WidgetSettingsModule,       
    ],
     declarations: [<%= widget.class %>Settings],
    exports: [<%= widget.class %>Settings]
})
export class <%= widget.class %>SettingsModule { }
