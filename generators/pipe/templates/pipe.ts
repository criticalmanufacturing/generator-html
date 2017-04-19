/** Core */
import * as Core from "cmf.core/src/core";
/** Angular */
import {PipeTransform, Pipe, ViewContainerRef} from "@angular/core";

/**
 * Please provide a meaningful description of this pipe and how to use it
 *
 * @class <%= pipe.class %>
 */
@Pipe({
    name: '<%= pipe.name %>',
    pure: true
})
export class <%= pipe.class %> extends Core.Generic implements PipeTransform {

    //#region Private properties

    //#endregion

    //#region Public properties

    //#endregion

    //#region Private methods

    transform(value: string, args: string[]): any {
        // Replace the next line with the code of your pipe transform
        return value;
    }

    //#endregion    

    //#region Public methods

    //#endregion
}

@Core.Module({
    imports: [
        
    ],
    declarations: [<%= pipe.class %>],   
    exports: [<%= pipe.class %>]    
})
export class <%= pipe.class %>Module { }
