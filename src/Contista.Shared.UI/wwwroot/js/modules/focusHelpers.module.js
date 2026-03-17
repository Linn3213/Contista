// wwwroot/js/modules/focusHelpers.module.js
export const focusHelpers = {
    focusById(id) {
        const el = document.getElementById(id);
        if (el) el.focus();
    }
};
