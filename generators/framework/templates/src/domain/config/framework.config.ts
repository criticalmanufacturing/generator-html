﻿import {<%= superFramework.aliasExport %>Config} from "<%= superFramework.name %>/src/domain/config/<%= superFramework.mainModule %>.config";

/**
 * <%= subFramework.aliasExport %> Configuration Interface
 */
export interface <%= subFramework.aliasExport %>Config extends <%= superFramework.aliasExport %>Config {
    
}