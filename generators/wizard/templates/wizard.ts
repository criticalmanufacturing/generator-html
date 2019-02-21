/** Core */
import { Component, Module, CoreComponent } from "cmf.core/src/core";
import { Cmf } from "cmf.lbos";
<% if (wizard.isExtendingMes) { %>
/** Mes */
import { MesComponent } from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
import {
    TransactionWizardModule, TransactionWizardInterface,
    TransactionWizardArgs
} from "cmf.core.business.controls/src/directives/transactionWizard/transactionWizard";
import { PageBag } from "cmf.core.controls/src/components/page/pageBag";
import { Wizard } from "cmf.core.controls/src/components/wizard/wizardBase";

/** i18n */
import i18n from "./i18n/<%= wizard.name %>.default";
/** Angular */
import * as ng from "@angular/core";

/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this component
 * Try to answer these questions:
 * * What is it?
 * * What it does?
 * * How does it behave with different sizes?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 *
 * @howToUse
 *
 * This component is used with the inputs and outputs mentioned below.
 *
 * Besides the description above, please complement it with a meaningful description of this component that answer these questions:
 * * How to use it?
 * * Where and When to use it?
 *
 * ### Inputs
 * `string` : **name** - The name of this component
 * `number` : **value** - The value of this component
 *
 * ### Outputs
 * `string` : **onNameChange** - When the name of the component change, this output emits the new name
 * `number` : **onValueChange** - When the value of the component change, this output emits the new value
 *
 * ### Example
 * To use the component, assume this HTML Template as an example:
 *
 * ```HTML
 * <<%= wizard.selector %>></<%= wizard.selector %>>
 * ```
 *
 * ### _NOTES_
 * (optional, Provide additional notes here)
 *
 * @description
 *
 * ## <%= wizard.class %> Component
 *
 * ### Dependencies
 *
 * #### Components
 * * ComponentA : `package`
 * * ComponentB : `package`
 *
 * #### Services
 * * ServiceA : `package`
 * * ServiceB : `package`
 *
 * #### Directives
 * * DirectiveA : `package`
 * * DirectiveB : `package`
 *
 */
@Component({
    moduleId: __moduleName,
    selector: '<%= wizard.selector %>',
    inputs: [],
    outputs: [],
    templateUrl: './<%= wizard.name %>.html',
    styleUrls: ["./<%= wizard.name %>.css"],
    assign: { i18n: i18n }
})
export class <%= wizard.class %> extends <% if (wizard.isExtendingMes) { %>MesComponent<% } %> <% if (!wizard.isExtendingMes) { %>CoreComponent <% } %>implements TransactionWizardInterface {

    /**
     * The wizard element
     */
    @ng.ViewChild(Wizard)
    protected _nestedWizard: Wizard;

    //#region Private properties

    //#endregion

    //#region Public properties

    /**
     * The instance of the wizard
     */
    public instance: any = null; // TODO Missing instance type, please change this

    //#endregion

    constructor(viewContainerRef: ng.ViewContainerRef, private _pageBag: PageBag) {
        super(viewContainerRef);
    }

    //#region Private methods

    //#endregion

    //#region Public methods

    /**
     * Method that prepares the data for the wizard
     */
    public prepareDataInput(): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput[]> {
        // Please provide all the inputs objects that need to be fetched when the wizard loads (if required)
        const inputs: Cmf.Foundation.BusinessOrchestration.BaseInput[] = [];
        const instanceInput: Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.InputObjects.GetObjectByIdInput
            = new Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.InputObjects.GetObjectByIdInput();
        instanceInput.IgnoreLastServiceId = true;
        instanceInput.Id = this._pageBag.context.instance.Id;
        // TODO: If you know your EntityType just assign its name to the type below. Example: "Material"
        instanceInput.Type = this.framework.caches.entityTypes.getEntityTypeNameFromInstance(this.instance);
        inputs.push(instanceInput);
        return Promise.resolve(inputs);
    }

    /**
     * Method that receive the data from prepareDataInput
     */
    public handleDataOutput(outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[]): Promise<void> {
        // Please handle all the outputs from prepareDataInput (if required)
        if (outputs != null && outputs.length > 0) {
            const output: Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.OutputObjects.GetObjectByIdOutput =
                <Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.OutputObjects.GetObjectByIdOutput>outputs[0];

            if (output != null && output.Instance != null) {
                this.instance = output.Instance;
                if (this._nestedWizard != null) {
                    return this._nestedWizard.reEvaluateContextPreConditions({ 'instance': this.instance }).
                        then(() => {
                            return Promise.resolve();
                        });
                }
            } else {
                this.instance = null;
            }
        } else {
            this.instance = null;
        }

        if (this.instance == null) {
            throw new Error(i18n.errors.NO_INSTANCE_FOUND);
        }

        return Promise.resolve(null);
    }

    /**
     * The wizard prepareTransactionInput method where we can append the input for the final wizard
     * @param args Current inputs where the user can append or simply resolve its own input.
     */
    public prepareTransactionInput(args: TransactionWizardArgs): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {
    // Please provide the input object for the last service call
        const input: Cmf.Foundation.BusinessOrchestration.BaseInput = null;
        input.IgnoreLastServiceId = true;
        return Promise.resolve(input);
    }

    /**
     * The wizard hook for handling the above service call.
     * @param output output object, result of the input created in the prepareTransactionInput
     */
    public handleTransactionOutput(output: Cmf.Foundation.BusinessOrchestration.BaseOutput): Promise<void> {
        // Please handle all the output of the last service call (if required)
        return null;
    }

    //#endregion
}

@Module({
    imports: [
        TransactionWizardModule
    ],
    declarations: [<%= wizard.class %>],
    defaultRoute: <%= wizard.class %>,
    exports: [<%= wizard.class %>]
})
export class <%= wizard.class %>Module { }
