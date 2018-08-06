/** Core */
import {Component, Module, CoreComponent} from "cmf.core/src/core";
import {Cmf} from "cmf.lbos";
<% if (wizard.isExtendingMes) { %>
/** Mes */
import {MesComponent} from "cmf.mes/src/mes";
<% } %>
/** Nested modules */
import {TransactionWizardModule, TransactionWizardInterface,
    TransactionWizardArgs} from "cmf.core.business.controls/src/directives/transactionWizard/transactionWizard";
import { PageBag } from "cmf.core.controls/src/components/page/pageBag";

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
    assign: { i18n : i18n }
})
export class <%= wizard.class %> extends<% if (wizard.isExtendingMes) { %> MesComponent <% } %><% if (!wizard.isExtendingMes) { %> CoreComponent <% } %>implements ng.OnChanges, TransactionWizardInterface {

    //#region Private properties

    //#endregion

    //#region Public properties

    //#endregion

    constructor(viewContainerRef: ng.ViewContainerRef, private _pageBag: PageBag) {
        super(viewContainerRef);
    }

    //#region Private methods

    //#endregion

    //#region Public methods

    public ngOnChanges(changes: ng.SimpleChanges): void {

    }

    public prepareDataInput(): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput[]> {
        // Please provide all the inputs objects that need to be fetched when the wizard loads (if required)
        const inputs: Cmf.Foundation.BusinessOrchestration.BaseInput[] = [];
        return Promise.resolve(inputs);
    }

    public handleDataOutput(outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[]): Promise<void> {
        // Please handle all the outputs from prepareDataInput (if required)
        return Promise.resolve(null);
    }

    public prepareTransactionInput(args: TransactionWizardArgs): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {
        // Please provide the input object for the last service call
        const input: Cmf.Foundation.BusinessOrchestration.BaseInput = null;
        return Promise.resolve(input);
    }

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
    defaultRoute:  <%= wizard.class %>,
    exports: [<%= wizard.class %>]
})
export class <%= wizard.class %>Module { }
