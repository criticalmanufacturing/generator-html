/** Core */
import * as Core from "cmf.core/src/core";
import {Cmf} from "cmf.lbos";
 <% if (wizard.isExtendingMes) { %> 
/** Mes */
import * as Mes from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
import {TransactionWizardModule, TransactionWizardInterface, TransactionWizardArgs} from "cmf.core.business.controls/src/directives/transactionWizard/transactionWizard";

/** i18n */
import i18n from "./i18n/<%= wizard.name %>.default"; 
/** Angular */
import * as ng from "@angular/core";

/**
 * Please provide a meaningful description of this wizard component and how to use it
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
    selector: '<%= wizard.selector %>',
    inputs: [],
    outputs:[],
    templateUrl: './<%= wizard.name %>.html',
    styleUrls: ["./<%= wizard.name %>.css"],
    assign: { i18n : i18n }
	
})
export class <%= wizard.class %> extends<% if (wizard.isExtendingMes) { %> Mes.MesComponent <% } %><% if (!wizard.isExtendingMes) { %> Core.CoreComponent <% } %>implements ng.OnChanges, TransactionWizardInterface {

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
        // Please provide all the inputs objects that need to be fetched when the wizard loads (if required)
        let inputs: Cmf.Foundation.BusinessOrchestration.BaseInput[] = [];        
        return Promise.resolve(inputs);
    }

    public handleDataOutput(outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[]): Promise<void> {
        // Please handle all the outputs from prepareDataInput (if required)
        return Promise.resolve(null);
    }

    public prepareTransactionInput(args: TransactionWizardArgs): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {
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
        TransactionWizardModule        
    ],
    declarations: [<%= wizard.class %>],  
    defaultRoute:  <%= wizard.class %>,
    exports: [<%= wizard.class %>]    
})
export class <%= wizard.class %>Module { }
