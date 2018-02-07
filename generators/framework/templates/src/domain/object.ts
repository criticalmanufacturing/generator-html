import {<%= superFramework.aliasExport %>Object} from "<%= superFramework.name %>/src/domain/object";
import {Framework} from "./framework";

/**
 * <%= superFramework.aliasExport %> Object. Base of all <%= superFramework.aliasExport %> Objects, extending Taura Object
 */
export interface <%= subFramework.aliasExport %>Object extends <%= superFramework.aliasExport %>Object {
    framework: Framework;
}
