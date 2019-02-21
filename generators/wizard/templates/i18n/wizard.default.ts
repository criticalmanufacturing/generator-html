import i18nControls from "cmf.core.controls/src/i18n/main.default";

export default {
    TITLE: "Wizard title",
    ACTION: i18nControls.actions.FINISH,
    steps: {
        step1: { // TODO Change this "step1" name to the wizard's step name
            TITLE: "Step 1 title"
        }
    },
    errors: {
        NO_INSTANCE_FOUND: "No Instance Found"
    }
};
