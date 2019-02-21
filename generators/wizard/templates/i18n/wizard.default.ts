import i18nControls from "cmf.core.controls/src/i18n/main.default";

export default {
    TITLE: "<%= wizard.name %>",
    ACTION: i18nControls.actions.FINISH,
    steps: {
        step1: {
            TITLE: "Details"
        }
    },
    errors: {
        NO_INSTANCE_FOUND: "No Instance Found"
    }
};
