// wwwroot/js/modules/cssVars.module.js
function toVarsMap(style) {
    const map = {};
    for (let i = 0; i < style.length; i++) {
        const name = style[i];
        if (name && name.startsWith("--")) {
            map[name] = style.getPropertyValue(name).trim();
        }
    }
    return map;
}

function resolveElement(selector) {
    if (!selector || selector === ":root" || selector === "root") {
        return document.documentElement;
    }
    return document.querySelector(selector);
}

export const cssVars = {
    getVarsMap(selector = ":root") {
        const el = resolveElement(selector);
        if (!el) return {};
        return toVarsMap(getComputedStyle(el));
    },

    getRootVarsMap() {
        return toVarsMap(getComputedStyle(document.documentElement));
    },

    async fetchText(url) {
        if (!url) throw new Error("fetchText: url is required.");

        // Cache-busting som brukar funka stabilt i WebView
        const bust = `cb=${Date.now()}`;
        const finalUrl = url.includes("?") ? `${url}&${bust}` : `${url}?${bust}`;

        let res;
        try {
            res = await fetch(finalUrl);
        } catch (e) {
            throw new Error(`fetchText: network error for '${url}': ${e?.message ?? e}`);
        }

        if (!res.ok) {
            throw new Error(`fetchText: failed '${url}' (${res.status} ${res.statusText})`);
        }

        return await res.text();
    }
};
