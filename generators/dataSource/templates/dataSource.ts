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
 * @whatItDoes
 * 
 * Please provide a meaningful description of this DataSource.
 * Try to answer these questions: 
 * * What is it?
 * * What it does?
 * * How it behave with different sizes?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 * 
 * @howToUse
 * 
 * The DataSource is used in an UIPage with the inputs and outputs mentioned below. 
 * 
 * Besides the description above, please complement it with a meaningful description of this component that answer these questions: 
 * * How to use it?
 * * Where and When to use it?
 * 
 * ### DataSource Settings Inputs
 * (Provide a detailed list of the DataSource properties configurable in settings. Syntax for list items: " * type [string, number, Object...] : name  - description") 
 * 
 * ### DataSource Inputs
 * (Provide a detailed list of the DataSource inputs here. Syntax for list items: " * type [string, number, Object...] : name - description") 
 * 
 * ### DataSource Outputs
 * (Provide a detailed list of the DataSource outputs here. Syntax for list items: " * type [string, number, Object...] : name - description") 
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
