/** Core */
import * as Core from "cmf.core/src/core";
/** Nested modules */
<% if (!dataSource.isADashboardDataSource) { %> import * as DataSource from "cmf.core.dashboards/src/dataSources/dataSource/dataSource"; <% } %>
<% if (dataSource.isADashboardDataSource) { %> import * as DataSource from "../dataSource/dataSource"; <% } %>
/** i18n */
import i18n from "./i18n/<%= dataSource.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";

/**
 * <%= dataSource.class %> DataSource
 * 
 * Please provide a meaningful description of this data data source
 * 
 */
@DataSource.DataSource({
    name: i18n.TITLE
})
export class <%= dataSource.class %> extends DataSource.DataSourceGeneric implements ng.OnChanges, DataSource.DataSourceSettingsDef {
  
    //#region Private properties

    //#endregion

    //#region Public properties

    //#endregion

    constructor() {
        super();        
    }

    //#region Private methods

    //#endregion

    //#region Public methods

    /**
     * This method gathers all the logic to fetch data for this data source
     */
    public execute(): Promise<void>{
        // Please change the next line to execute what this data source requires 
        return Promise.resolve(null);
    }

    public ngOnChanges(changes: { [key: string]: ng.SimpleChange }): void {

    }

    //#endregion
}
