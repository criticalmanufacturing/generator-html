/** Core */
import * as Core from "cmf.core/src/core";
import {Cmf} from "cmf.lbos";
 <% if (executionView.isExtendingMes) { %> 
/** Mes */
import * as Mes from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
import {TransactionExecutionViewModule, TransactionExecutionViewInterface, TransactionExecutionViewArgs} from "cmf.core.business.controls/src/directives/transactionExecutionView/transactionExecutionView";

/** i18n */
import i18n from "./i18n/<%= executionView.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";

/**
 * Please provide a meaningful description of this execution view component and how to use it
 * 
 * ## Inputs
 * * input: Description for Input
 * 
 * ## Outputs
 * * output: Description for output
 * 
 * ## Example
 * 
 * ```html
 * <your-custom-selector [input]="myInputValue" (output)="myOutputValue"></your-custom-selector>
 * ```
 */
@Core.Component({
    moduleId: __moduleName,
    selector: '<%= executionView.selector %>',
    inputs: [],
    outputs:[],
    templateUrl: './<%= executionView.name %>.html',
    styleUrls: ["./<%= executionView.name %>.css"],
    assign: { i18n : i18n }
	
})
export class <%= executionView.class %> extends<% if (executionView.isExtendingMes) { %> Mes.MesComponent <% } %><% if (!executionView.isExtendingMes) { %> Core.CoreComponent <% } %>implements ng.OnChanges, TransactionExecutionViewInterface {

    //#region Private properties

    //#endregion

    //#region Public properties

    //#endregion

    constructor(viewContainerRef: ng.ViewContainerRef) { 
        super(viewContainerRef);
    }

    //#region Private methods

    //#endregion    

    //#region Public methods
    
    public ngOnChanges(changes: ng.SimpleChanges): void {
        
    }

    public prepareDataInput(): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput[]> {
        // Please provide all the inputs objects that need to be fetched when the ExecutionView loads (if required)
        let inputs: Cmf.Foundation.BusinessOrchestration.BaseInput[] = [];        
        return Promise.resolve(inputs);
    }

    public handleDataOutput(outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[]): Promise<void> {
        // Please handle all the outputs from prepareDataInput (if required)
        return Promise.resolve(null);
    }

    public prepareTransactionInput(args: TransactionExecutionViewArgs): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {
        // Please provide the input object for the last service call
        let input: Cmf.Foundation.BusinessOrchestration.BaseInput = null;        
        return Promise.resolve(input);
    }

    public handleTransactionOutput(output: Cmf.Foundation.BusinessOrchestration.BaseOutput): Promise<void> {        
        // Please handle all the output of the last service call (if required)
        return null;
    }

    //#endregion
}

@Core.Module({
    imports: [
        TransactionExecutionViewModule        
    ],
    declarations: [<%= executionView.class %>],  
    defaultRoute:  <%= executionView.class %>,
    exports: [<%= executionView.class %>]    
})
export class <%= executionView.class %>Module { }
