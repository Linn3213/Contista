
window.bootstrapModalHelper = {
    show: function (selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        const modal = new bootstrap.Modal(element);
        modal.show();
    },
    hide: function (selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        const modal = bootstrap.Modal.getInstance(element);
        if (modal) modal.hide();
    },
    closeAll: function () {
        // Stänger alla öppna Bootstrap-modals
        document.querySelectorAll('.modal.show').forEach(el => {
            const modal = bootstrap.Modal.getInstance(el);
            if (modal) modal.hide();
        });
    }
};

window.downloadFileFromText = (filename, contentType, text) => {
    const blob = new Blob([text], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};