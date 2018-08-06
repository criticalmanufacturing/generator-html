/** Core */
import {Module, Generic} from "cmf.core/src/core";
/** Nested modules */
<% if (!converter.isADashboardConverter) { %>import * as Converter from "cmf.core.dashboards/src/converters/converter/converter";<% } %>
<% if (converter.isADashboardConverter) { %>import * as Converter from "../converter/converter";<% } %>
/** Angular */
import {PipeTransform, Pipe} from "@angular/core";

/**
 * <%= converter.class %> Converter
 *
 * Please provide a meaningful description of this converter and how to use it
 *
 * ## Example
 *
 * ```html
 * {{obj | <%= converter.packagePrefix %><%= converter.class %>}}
 * ```
 */
@Converter.Converter({
    name: "<%= converter.name %>",
    // Place your inputs, outputs and param here. The next ones are provided as an example
    input: [/*Converter.ConverterValueType.Decimal*/],
    output: null, // Converter.ConverterValueType.Integer,
    param: null, // Converter.ConverterValueType.DateTime
})
@Pipe({
    name: "<%= converter.packagePrefix %><%= converter.class %>",
    pure: true
})
export class <%= converter.class %> extends Generic implements PipeTransform {
    transform(value: any, args: any[]): any {
        // Replace the next line with the code of your converter transform
        return value;
    }
}

@Module({
    imports: [],
    declarations: [<%= converter.class %>],
    exports: [<%= converter.class %>]
})
export class <%= converter.class %>Module { }
