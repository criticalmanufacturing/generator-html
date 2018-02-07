import {Framework as <%= superFramework.aliasExport %>FrameworkImplementation, <%= superFramework.aliasExport %>Framework} from "<%= superFramework.name %>/src/<%= superFramework.mainModule %>";
import {Sandbox} from "./sandbox";

// tslint:disable-next-line
export interface <%= subFramework.aliasExport %>Framework extends <%= superFramework.aliasExport %>Framework {

}

export class Framework extends <%= superFramework.aliasExport %>FrameworkImplementation implements <%= subFramework.aliasExport %>Framework {
    public sandbox: Sandbox;
}
