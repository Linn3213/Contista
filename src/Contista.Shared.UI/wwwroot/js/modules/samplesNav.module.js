// wwwroot/js/modules/samplesNav.module.js
function asArray(x) {
    if (!x) return [];
    return Array.isArray(x) ? x : [x];
}

function numberPx(value) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
}

function getStickyHeight(node) {
    if (!node) return 0;
    const style = getComputedStyle(node);
    if (style.position !== "sticky" && style.position !== "fixed") return 0;
    return node.getBoundingClientRect().height;
}

export const samplesNav = {
    scrollToIdAuto(id, offsetSelectors, extra = 8) {
        const el = document.getElementById(id);
        if (!el) return;

        let offset = 0;
        const selectors = asArray(offsetSelectors);
        for (const sel of selectors) {
            offset += getStickyHeight(document.querySelector(sel));
        }

        offset += (extra ?? 0);

        // Respektera scroll-margin-top om satt i CSS
        offset += numberPx(getComputedStyle(el).scrollMarginTop);

        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

        try {
            window.scrollTo({ top: y, behavior: "smooth" });
        } catch {
            window.scrollTo(0, y);
        }
    }
};
