// wwwroot/js/app.js
// Central entrypoint för all Shared.UI JS (Web + MAUI)

import { cssVars } from "./modules/cssVars.module.js";
import { samplesNav } from "./modules/samplesNav.module.js";
import { focusHelpers } from "./modules/focusHelpers.module.js";
import { bootstrapModal } from "./modules/bootstrapModal.module.js";
import { lockScroll } from "./modules/lockScroll.module.js";
import { reminderSound } from "./modules/reminderSound.module.js";

// Här kan du importera fler moduler senare:
// import { modalHelpers } from "./modules/modalHelpers.module.js";
// import { storage } from "./modules/storage.module.js";

(function register() {
    // En enda global namespace för interop
    window.contista = window.contista || {};

    // Lägg moduler under contista.*
    window.contista.cssVars = cssVars;
    window.contista.samplesNav = samplesNav;
    window.contista.focus = focusHelpers;
    window.contista.bootstrapModal = bootstrapModal;
    window.contista.lockScroll = lockScroll;
    window.contista.reminderSound = reminderSound;

    // Versionsstämpel (bra för felsökning)
    window.contista.__version = "1.0.0";
})();
