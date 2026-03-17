// wwwroot/js/modules/bootstrapModal.module.js
// Helper för Bootstrap Modal under window.contista.bootstrapModal
// Kräver att Bootstrap JS är laddat (window.bootstrap.Modal).

function ensureBootstrap() {
    if (!window.bootstrap || !window.bootstrap.Modal) {
        throw new Error("Bootstrap Modal is not available. Ensure bootstrap JS is loaded before app.js.");
    }
}

function resolveEl(selectorOrEl) {
    if (!selectorOrEl) return null;

    if (typeof selectorOrEl === "string") {
        return document.querySelector(selectorOrEl);
    }

    if (selectorOrEl instanceof Element) return selectorOrEl;

    return null;
}

function getOrCreateInstance(el, options) {
    const inst = window.bootstrap.Modal.getInstance(el);
    return inst ?? new window.bootstrap.Modal(el, options ?? {});
}

export const bootstrapModal = {
    show(selectorOrEl, options = null) {
        ensureBootstrap();

        const el = resolveEl(selectorOrEl);
        if (!el) return;

        const opts = {
            backdrop: true,
            keyboard: true,
            focus: true,
            ...(options || {})
        };

        const inst = getOrCreateInstance(el, opts);
        inst.show();
    },

    hide(selectorOrEl) {
        ensureBootstrap();

        const el = resolveEl(selectorOrEl);
        if (!el) return;

        const inst = window.bootstrap.Modal.getInstance(el);
        if (inst) inst.hide();
    },

    toggle(selectorOrEl, options = null) {
        ensureBootstrap();

        const el = resolveEl(selectorOrEl);
        if (!el) return;

        const opts = {
            backdrop: true,
            keyboard: true,
            focus: true,
            ...(options || {})
        };

        const inst = getOrCreateInstance(el, opts);
        inst.toggle();
    },

    isShown(selectorOrEl) {
        const el = resolveEl(selectorOrEl);
        if (!el) return false;
        return el.classList.contains("show");
    }
};
