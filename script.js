// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      19.3
// @match        https://*.e-days.com/*
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// ==/UserScript==

/* === VENDORED DARK READER API 4.9.133 (MIT) === */
/*
MIT License

Copyright (c) 2026 Dark Reader Ltd.

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Dark Reader v4.9.133
 * https://darkreader.org/
 */

(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? factory(exports)
        : typeof define === "function" && define.amd
          ? define(["exports"], factory)
          : ((global =
                typeof globalThis !== "undefined"
                    ? globalThis
                    : global || self),
            factory((global.DarkReader = {})));
})(this, function (exports) {
    "use strict";

    var MessageTypeUItoBG;
    (function (MessageTypeUItoBG) {
        MessageTypeUItoBG["GET_DATA"] = "ui-bg-get-data";
        MessageTypeUItoBG["GET_DEVTOOLS_DATA"] = "ui-bg-get-devtools-data";
        MessageTypeUItoBG["SUBSCRIBE_TO_CHANGES"] =
            "ui-bg-subscribe-to-changes";
        MessageTypeUItoBG["UNSUBSCRIBE_FROM_CHANGES"] =
            "ui-bg-unsubscribe-from-changes";
        MessageTypeUItoBG["CHANGE_SETTINGS"] = "ui-bg-change-settings";
        MessageTypeUItoBG["SET_THEME"] = "ui-bg-set-theme";
        MessageTypeUItoBG["TOGGLE_ACTIVE_TAB"] = "ui-bg-toggle-active-tab";
        MessageTypeUItoBG["MARK_NEWS_AS_READ"] = "ui-bg-mark-news-as-read";
        MessageTypeUItoBG["MARK_NEWS_AS_DISPLAYED"] =
            "ui-bg-mark-news-as-displayed";
        MessageTypeUItoBG["LOAD_CONFIG"] = "ui-bg-load-config";
        MessageTypeUItoBG["APPLY_DEV_FIXES"] = "ui-bg-apply-dev-fixes";
        MessageTypeUItoBG["RESET_DEV_FIXES"] = "ui-bg-reset-dev-fixes";
        MessageTypeUItoBG["START_ACTIVATION"] = "ui-bg-start-activation";
        MessageTypeUItoBG["RESET_ACTIVATION"] = "ui-bg-reset-activation";
        MessageTypeUItoBG["COLOR_SCHEME_CHANGE"] = "ui-bg-color-scheme-change";
        MessageTypeUItoBG["HIDE_HIGHLIGHTS"] = "ui-bg-hide-highlights";
    })(MessageTypeUItoBG || (MessageTypeUItoBG = {}));
    var MessageTypeBGtoUI;
    (function (MessageTypeBGtoUI) {
        MessageTypeBGtoUI["CHANGES"] = "bg-ui-changes";
    })(MessageTypeBGtoUI || (MessageTypeBGtoUI = {}));
    var DebugMessageTypeBGtoUI;
    (function (DebugMessageTypeBGtoUI) {
        DebugMessageTypeBGtoUI["CSS_UPDATE"] = "debug-bg-ui-css-update";
        DebugMessageTypeBGtoUI["UPDATE"] = "debug-bg-ui-update";
    })(DebugMessageTypeBGtoUI || (DebugMessageTypeBGtoUI = {}));
    var MessageTypeBGtoCS;
    (function (MessageTypeBGtoCS) {
        MessageTypeBGtoCS["ADD_CSS_FILTER"] = "bg-cs-add-css-filter";
        MessageTypeBGtoCS["ADD_DYNAMIC_THEME"] = "bg-cs-add-dynamic-theme";
        MessageTypeBGtoCS["ADD_STATIC_THEME"] = "bg-cs-add-static-theme";
        MessageTypeBGtoCS["ADD_SVG_FILTER"] = "bg-cs-add-svg-filter";
        MessageTypeBGtoCS["CLEAN_UP"] = "bg-cs-clean-up";
        MessageTypeBGtoCS["FETCH_RESPONSE"] = "bg-cs-fetch-response";
        MessageTypeBGtoCS["UNSUPPORTED_SENDER"] = "bg-cs-unsupported-sender";
    })(MessageTypeBGtoCS || (MessageTypeBGtoCS = {}));
    var DebugMessageTypeBGtoCS;
    (function (DebugMessageTypeBGtoCS) {
        DebugMessageTypeBGtoCS["RELOAD"] = "debug-bg-cs-reload";
    })(DebugMessageTypeBGtoCS || (DebugMessageTypeBGtoCS = {}));
    var MessageTypeCStoBG;
    (function (MessageTypeCStoBG) {
        MessageTypeCStoBG["COLOR_SCHEME_CHANGE"] = "cs-bg-color-scheme-change";
        MessageTypeCStoBG["DARK_THEME_DETECTED"] = "cs-bg-dark-theme-detected";
        MessageTypeCStoBG["DARK_THEME_NOT_DETECTED"] =
            "cs-bg-dark-theme-not-detected";
        MessageTypeCStoBG["FETCH"] = "cs-bg-fetch";
        MessageTypeCStoBG["DOCUMENT_CONNECT"] = "cs-bg-document-connect";
        MessageTypeCStoBG["DOCUMENT_FORGET"] = "cs-bg-document-forget";
        MessageTypeCStoBG["DOCUMENT_FREEZE"] = "cs-bg-document-freeze";
        MessageTypeCStoBG["DOCUMENT_RESUME"] = "cs-bg-document-resume";
    })(MessageTypeCStoBG || (MessageTypeCStoBG = {}));
    var DebugMessageTypeCStoBG;
    (function (DebugMessageTypeCStoBG) {
        DebugMessageTypeCStoBG["LOG"] = "debug-cs-bg-log";
    })(DebugMessageTypeCStoBG || (DebugMessageTypeCStoBG = {}));
    var MessageTypeCStoUI;
    (function (MessageTypeCStoUI) {
        MessageTypeCStoUI["EXPORT_CSS_RESPONSE"] = "cs-ui-export-css-response";
    })(MessageTypeCStoUI || (MessageTypeCStoUI = {}));
    var MessageTypeUItoCS;
    (function (MessageTypeUItoCS) {
        MessageTypeUItoCS["EXPORT_CSS"] = "ui-cs-export-css";
    })(MessageTypeUItoCS || (MessageTypeUItoCS = {}));

    const isNavigatorDefined = typeof navigator !== "undefined";
    const userAgent = isNavigatorDefined
        ? navigator.userAgentData &&
          Array.isArray(navigator.userAgentData.brands)
            ? navigator.userAgentData.brands
                  .map(
                      (brand) => `${brand.brand.toLowerCase()} ${brand.version}`
                  )
                  .join(" ")
            : navigator.userAgent.toLowerCase()
        : "some useragent";
    const platform = isNavigatorDefined
        ? navigator.userAgentData &&
          typeof navigator.userAgentData.platform === "string"
            ? navigator.userAgentData.platform.toLowerCase()
            : navigator.platform.toLowerCase()
        : "some platform";
    const isChromium =
        userAgent.includes("chrome") || userAgent.includes("chromium");
    const isFirefox =
        userAgent.includes("firefox") ||
        userAgent.includes("thunderbird") ||
        userAgent.includes("librewolf");
    const isSafari = userAgent.includes("safari") && !isChromium;
    const isWindows = platform.startsWith("win");
    const isMacOS = platform.startsWith("mac");
    const isMobile =
        isNavigatorDefined && navigator.userAgentData
            ? navigator.userAgentData.mobile
            : userAgent.includes("mobile") || false;
    const isShadowDomSupported = typeof ShadowRoot === "function";
    const isMatchMediaChangeEventListenerSupported =
        typeof MediaQueryList === "function" &&
        typeof MediaQueryList.prototype.addEventListener === "function";
    const isLayerRuleSupported = typeof CSSLayerBlockRule === "function";
    const isContainerRuleSupported = typeof CSSContainerRule === "function";
    (() => {
        const m = userAgent.match(/chrom(?:e|ium)(?:\/| )([^ ]+)/);
        if (m && m[1]) {
            return m[1];
        }
        return "";
    })();
    (() => {
        const m = userAgent.match(/(?:firefox|librewolf)(?:\/| )([^ ]+)/);
        if (m && m[1]) {
            return m[1];
        }
        return "";
    })();
    const isDefinedSelectorSupported = (() => {
        try {
            document.querySelector(":defined");
            return true;
        } catch (err) {
            return false;
        }
    })();
    const isCSSColorSchemePropSupported = (() => {
        try {
            if (typeof document === "undefined") {
                return false;
            }
            const el = document.createElement("div");
            if (!el || typeof el.style !== "object") {
                return false;
            }
            if (typeof el.style.colorScheme === "string") {
                return true;
            }
            el.setAttribute("style", "color-scheme: dark");
            return el.style.colorScheme === "dark";
        } catch (e) {
            return false;
        }
    })();

    async function getOKResponse(url, mimeType, origin) {
        const sameOrigin = origin && url.startsWith(`${origin}/`);
        const credentials = sameOrigin ? undefined : "omit";
        const redirect = mimeType === "text/css" ? undefined : "error";
        const response = await fetch(url, {
            cache: "force-cache",
            credentials,
            referrer: origin,
            redirect
        });
        if (
            isFirefox &&
            mimeType === "text/css" &&
            url.startsWith("moz-extension://") &&
            url.endsWith(".css")
        ) {
            return response;
        }
        const contentType = response.headers.get("Content-Type");
        if (
            mimeType &&
            !(
                contentType === mimeType ||
                contentType?.startsWith(`${mimeType};`)
            )
        ) {
            throw new Error(`Mime type mismatch when loading ${url}`);
        }
        if (
            response.redirected &&
            response.url &&
            shouldIgnoreCors(new URL(response.url))
        ) {
            throw new Error("Cross-origin limit reached");
        }
        if (!response.ok) {
            throw new Error(
                `Unable to load ${url} ${response.status} ${response.statusText}`
            );
        }
        return response;
    }
    async function loadAsDataURL(url, mimeType, origin) {
        const response = await getOKResponse(url, mimeType, origin);
        return await readResponseAsDataURL(response);
    }
    async function loadAsBlob(url, mimeType, origin) {
        const response = await getOKResponse(url, mimeType, origin);
        return await response.blob();
    }
    async function readResponseAsDataURL(response) {
        const blob = await response.blob();
        const dataURL = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
        });
        return dataURL;
    }
    async function loadAsText(url, mimeType, origin) {
        const response = await getOKResponse(url, mimeType, origin);
        return await response.text();
    }
    const MAX_CORS_HOSTS = 16;
    const corsHosts = new Set();
    const checkedOrigins = new Set();
    const localAliases = [
        "127-0-0-1.org.uk",
        "42foo.com",
        "domaincontrol.com",
        "fbi.com",
        "fuf.me",
        "lacolhost.com",
        "local.sisteminha.com",
        "localfabriek.nl",
        "localhost",
        "localhst.co.uk",
        "localmachine.info",
        "localmachine.name",
        "localtest.me",
        "lvh.me",
        "mouse-potato.com",
        "nip.io",
        "sslip.io",
        "vcap.me",
        "xip.io",
        "yoogle.com"
    ];
    const localSubDomains = [
        ".corp",
        ".direct",
        ".home",
        ".internal",
        ".intranet",
        ".lan",
        ".local",
        ".localdomain",
        ".test",
        ".zz",
        ...localAliases.map((alias) => `.${alias}`)
    ];
    function isIPHost(hostname) {
        if (hostname.startsWith("[")) {
            return true;
        }
        const labels = hostname.split(".");
        const last = labels[labels.length - 1];
        return /^(0x[0-9a-f]+|\d+)$/i.test(last);
    }
    function shouldIgnoreCors(url) {
        const {host, port, protocol} = url;
        const hostname = url.hostname.endsWith(".")
            ? url.hostname.slice(0, -1)
            : url.hostname;
        if (!corsHosts.has(host)) {
            corsHosts.add(host);
        }
        if (checkedOrigins.has(url.origin)) {
            return false;
        }
        if (
            corsHosts.size >= MAX_CORS_HOSTS ||
            protocol !== "https:" ||
            port !== "" ||
            localAliases.includes(hostname) ||
            localSubDomains.some((sub) => hostname.endsWith(sub)) ||
            isIPHost(hostname)
        ) {
            return true;
        }
        checkedOrigins.add(url.origin);
        return false;
    }

    const throwCORSError = async (url) => {
        return Promise.reject(
            new Error(
                [
                    "Embedded Dark Reader cannot access a cross-origin resource",
                    url,
                    "Overview your URLs and CORS policies or use",
                    "`DarkReader.setFetchMethod(fetch: (url) => Promise<Response>))`.",
                    "See if using `DarkReader.setFetchMethod(window.fetch)`",
                    "before `DarkReader.enable()` works."
                ].join(" ")
            )
        );
    };
    let fetcher = throwCORSError;
    function setFetchMethod$1(fetch) {
        if (fetch) {
            fetcher = fetch;
        } else {
            fetcher = throwCORSError;
        }
    }
    async function callFetchMethod(url) {
        return await fetcher(url);
    }

    if (!window.chrome) {
        window.chrome = {};
    }
    if (!chrome.runtime) {
        chrome.runtime = {};
    }
    const messageListeners = new Set();
    async function sendMessage(...args) {
        if (args[0] && args[0].type === MessageTypeCStoBG.FETCH) {
            const {id} = args[0];
            try {
                const {url, responseType} = args[0].data;
                const response = await callFetchMethod(url);
                let text;
                if (responseType === "data-url") {
                    text = await readResponseAsDataURL(response);
                } else {
                    text = await response.text();
                }
                messageListeners.forEach((cb) =>
                    cb({
                        type: MessageTypeBGtoCS.FETCH_RESPONSE,
                        data: text,
                        error: null,
                        id
                    })
                );
            } catch (error) {
                console.error(error);
                messageListeners.forEach((cb) =>
                    cb({
                        type: MessageTypeBGtoCS.FETCH_RESPONSE,
                        data: null,
                        error,
                        id
                    })
                );
            }
        }
    }
    function addMessageListener(callback) {
        messageListeners.add(callback);
    }
    if (typeof chrome.runtime.sendMessage === "function") {
        const nativeSendMessage = chrome.runtime.sendMessage;
        chrome.runtime.sendMessage = (...args) => {
            sendMessage(...args);
            nativeSendMessage.apply(chrome.runtime, args);
        };
    } else {
        chrome.runtime.sendMessage = sendMessage;
    }
    if (!chrome.runtime.onMessage) {
        chrome.runtime.onMessage = {};
    }
    if (typeof chrome.runtime.onMessage.addListener === "function") {
        const nativeAddListener = chrome.runtime.onMessage.addListener;
        chrome.runtime.onMessage.addListener = (...args) => {
            addMessageListener(args[0]);
            nativeAddListener.apply(chrome.runtime.onMessage, args);
        };
    } else {
        chrome.runtime.onMessage.addListener = (...args) =>
            addMessageListener(args[0]);
    }

    var ThemeEngine;
    (function (ThemeEngine) {
        ThemeEngine["cssFilter"] = "cssFilter";
        ThemeEngine["svgFilter"] = "svgFilter";
        ThemeEngine["staticTheme"] = "staticTheme";
        ThemeEngine["dynamicTheme"] = "dynamicTheme";
    })(ThemeEngine || (ThemeEngine = {}));

    var AutomationMode;
    (function (AutomationMode) {
        AutomationMode["NONE"] = "";
        AutomationMode["TIME"] = "time";
        AutomationMode["SYSTEM"] = "system";
        AutomationMode["LOCATION"] = "location";
    })(AutomationMode || (AutomationMode = {}));

    const DEFAULT_COLORS = {
        darkScheme: {
            background: "#181a1b",
            text: "#e8e6e3"
        },
        lightScheme: {
            background: "#dcdad7",
            text: "#181a1b"
        }
    };
    const DEFAULT_THEME = {
        mode: 1,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        sepia: 0,
        useFont: false,
        fontFamily: isMacOS
            ? "Helvetica Neue"
            : isWindows
              ? "Segoe UI"
              : "Open Sans",
        textStroke: 0,
        engine: ThemeEngine.dynamicTheme,
        stylesheet: "",
        darkSchemeBackgroundColor: DEFAULT_COLORS.darkScheme.background,
        darkSchemeTextColor: DEFAULT_COLORS.darkScheme.text,
        lightSchemeBackgroundColor: DEFAULT_COLORS.lightScheme.background,
        lightSchemeTextColor: DEFAULT_COLORS.lightScheme.text,
        scrollbarColor: "",
        selectionColor: "auto",
        styleSystemControls: !isCSSColorSchemePropSupported,
        lightColorScheme: "Default",
        darkColorScheme: "Default",
        immediateModify: false
    };
    const filterModeSites = [
        "*.officeapps.live.com",
        "*.sharepoint.com",
        "docs.google.com",
        "onedrive.live.com"
    ];
    ({
        customThemes: filterModeSites.map((url) => {
            const engine = ThemeEngine.cssFilter;
            return {
                url: [url],
                theme: {...DEFAULT_THEME, engine},
                builtIn: true
            };
        }),
        automation: {
            mode: AutomationMode.NONE
        }
    });

    function getMatches(regex, input, group = 0) {
        const matches = [];
        let m;
        while ((m = regex.exec(input))) {
            matches.push(m[group]);
        }
        return matches;
    }
    function getMatchesWithOffsets(regex, input, group = 0) {
        const matches = [];
        let m;
        while ((m = regex.exec(input))) {
            matches.push({text: m[group], offset: m.index});
        }
        return matches;
    }
    function getHashCode(text) {
        const len = text.length;
        let hash = 0;
        for (let i = 0; i < len; i++) {
            const c = text.charCodeAt(i);
            hash = ((hash << 5) - hash + c) & 4294967295;
        }
        return hash;
    }
    function escapeRegExpSpecialChars(input) {
        return input.replaceAll(/[\^$.*+?\(\)\[\]{}|\-\\]/g, "\\$&");
    }
    function getParenthesesRange(input, searchStartIndex = 0) {
        return getOpenCloseRange(input, searchStartIndex, "(", ")", []);
    }
    function getOpenCloseRange(
        input,
        searchStartIndex,
        openToken,
        closeToken,
        excludeRanges
    ) {
        let indexOf;
        if (excludeRanges.length === 0) {
            indexOf = (token, pos) => input.indexOf(token, pos);
        } else {
            indexOf = (token, pos) =>
                indexOfExcluding(input, token, pos, excludeRanges);
        }
        const {length} = input;
        let depth = 0;
        let firstOpenIndex = -1;
        for (let i = searchStartIndex; i < length; i++) {
            if (depth === 0) {
                const openIndex = indexOf(openToken, i);
                if (openIndex < 0) {
                    break;
                }
                firstOpenIndex = openIndex;
                depth++;
                i = openIndex;
            } else {
                const closeIndex = indexOf(closeToken, i);
                if (closeIndex < 0) {
                    break;
                }
                const openIndex = indexOf(openToken, i);
                if (openIndex < 0 || closeIndex <= openIndex) {
                    depth--;
                    if (depth === 0) {
                        return {start: firstOpenIndex, end: closeIndex + 1};
                    }
                    i = closeIndex;
                } else {
                    depth++;
                    i = openIndex;
                }
            }
        }
        return null;
    }
    function indexOfExcluding(input, search, position, excludeRanges) {
        const i = input.indexOf(search, position);
        const exclusion = excludeRanges.find((r) => i >= r.start && i < r.end);
        if (exclusion) {
            return indexOfExcluding(
                input,
                search,
                exclusion.end,
                excludeRanges
            );
        }
        return i;
    }
    function splitExcluding(input, separator, excludeRanges) {
        const parts = [];
        let commaIndex = -1;
        let currIndex = 0;
        while (
            (commaIndex = indexOfExcluding(
                input,
                separator,
                currIndex,
                excludeRanges
            )) >= 0
        ) {
            parts.push(input.substring(currIndex, commaIndex).trim());
            currIndex = commaIndex + 1;
        }
        parts.push(input.substring(currIndex).trim());
        return parts;
    }

    let anchor;
    const parsedURLCache = new Map();
    function fixBaseURL($url) {
        if (!anchor) {
            anchor = document.createElement("a");
        }
        anchor.href = $url;
        return anchor.href;
    }
    function parseURL($url, $base = null) {
        const key = `${$url}${$base ? `;${$base}` : ""}`;
        if (parsedURLCache.has(key)) {
            return parsedURLCache.get(key);
        }
        if ($base) {
            const parsedURL = new URL($url, fixBaseURL($base));
            parsedURLCache.set(key, parsedURL);
            return parsedURL;
        }
        const parsedURL = new URL(fixBaseURL($url));
        parsedURLCache.set($url, parsedURL);
        return parsedURL;
    }
    function getAbsoluteURL($base, $relative) {
        if ($relative.match(/^data\\?\:/)) {
            return $relative;
        }
        if (/^\/\//.test($relative)) {
            return `${location.protocol}${$relative}`;
        }
        const b = parseURL($base);
        const a = parseURL($relative, b.href);
        return a.href;
    }
    function isRelativeHrefOnAbsolutePath(href) {
        if (href.startsWith("data:")) {
            return true;
        }
        const url = parseURL(href);
        if (url.protocol !== location.protocol) {
            return false;
        }
        if (url.hostname !== location.hostname) {
            return false;
        }
        if (url.port !== location.port) {
            return false;
        }
        return url.pathname === location.pathname;
    }

    const excludedSelectors = [
        "pre",
        "pre *",
        "code",
        '[aria-hidden="true"]',
        '[class*="fa-"]',
        ".fa",
        ".fab",
        ".fad",
        ".fal",
        ".far",
        ".fas",
        ".fass",
        ".fasr",
        ".fat",
        ".icofont",
        '[style*="font-"]',
        '[class*="icon"]',
        '[class*="Icon"]',
        '[class*="symbol"]',
        '[class*="Symbol"]',
        ".glyphicon",
        '[class*="material-symbol"]',
        '[class*="material-icon"]',
        "mu",
        '[class*="mu-"]',
        ".typcn",
        '[class*="vjs-"]'
    ];
    function createTextStyle(config) {
        const lines = [];
        lines.push(`*:not(${excludedSelectors.join(", ")}) {`);
        if (config.useFont && config.fontFamily) {
            lines.push(`  font-family: ${config.fontFamily} !important;`);
        }
        if (config.textStroke > 0) {
            lines.push(
                `  -webkit-text-stroke: ${config.textStroke}px !important;`
            );
            lines.push(`  text-stroke: ${config.textStroke}px !important;`);
        }
        lines.push("}");
        return lines.join("\n");
    }

    function isArrayLike(items) {
        return items.length != null;
    }
    function forEach(items, iterator) {
        if (isArrayLike(items)) {
            for (let i = 0, len = items.length; i < len; i++) {
                iterator(items[i]);
            }
        } else {
            for (const item of items) {
                iterator(item);
            }
        }
    }
    function push(array, addition) {
        forEach(addition, (a) => array.push(a));
    }
    function toArray(items) {
        const results = [];
        for (let i = 0, len = items.length; i < len; i++) {
            results.push(items[i]);
        }
        return results;
    }

    function scale(x, inLow, inHigh, outLow, outHigh) {
        return ((x - inLow) * (outHigh - outLow)) / (inHigh - inLow) + outLow;
    }
    function clamp(x, min, max) {
        return Math.min(max, Math.max(min, x));
    }
    function multiplyMatrices(m1, m2) {
        const result = [];
        for (let i = 0, len = m1.length; i < len; i++) {
            result[i] = [];
            for (let j = 0, len2 = m2[0].length; j < len2; j++) {
                let sum = 0;
                for (let k = 0, len3 = m1[0].length; k < len3; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    function createFilterMatrix(config) {
        let m = Matrix.identity();
        if (config.sepia !== 0) {
            m = multiplyMatrices(m, Matrix.sepia(config.sepia / 100));
        }
        if (config.grayscale !== 0) {
            m = multiplyMatrices(m, Matrix.grayscale(config.grayscale / 100));
        }
        if (config.contrast !== 100) {
            m = multiplyMatrices(m, Matrix.contrast(config.contrast / 100));
        }
        if (config.brightness !== 100) {
            m = multiplyMatrices(m, Matrix.brightness(config.brightness / 100));
        }
        if (config.mode === 1) {
            m = multiplyMatrices(m, Matrix.invertNHue());
        }
        return m;
    }
    function applyColorMatrix([r, g, b], matrix) {
        const rgb = [[r / 255], [g / 255], [b / 255], [1], [1]];
        const result = multiplyMatrices(matrix, rgb);
        return [0, 1, 2].map((i) =>
            clamp(Math.round(result[i][0] * 255), 0, 255)
        );
    }
    const Matrix = {
        identity() {
            return [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        },
        invertNHue() {
            return [
                [0.333, -0.667, -0.667, 0, 1],
                [-0.667, 0.333, -0.667, 0, 1],
                [-0.667, -0.667, 0.333, 0, 1],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        },
        brightness(v) {
            return [
                [v, 0, 0, 0, 0],
                [0, v, 0, 0, 0],
                [0, 0, v, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        },
        contrast(v) {
            const t = (1 - v) / 2;
            return [
                [v, 0, 0, 0, t],
                [0, v, 0, 0, t],
                [0, 0, v, 0, t],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        },
        sepia(v) {
            return [
                [
                    0.393 + 0.607 * (1 - v),
                    0.769 - 0.769 * (1 - v),
                    0.189 - 0.189 * (1 - v),
                    0,
                    0
                ],
                [
                    0.349 - 0.349 * (1 - v),
                    0.686 + 0.314 * (1 - v),
                    0.168 - 0.168 * (1 - v),
                    0,
                    0
                ],
                [
                    0.272 - 0.272 * (1 - v),
                    0.534 - 0.534 * (1 - v),
                    0.131 + 0.869 * (1 - v),
                    0,
                    0
                ],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        },
        grayscale(v) {
            return [
                [
                    0.2126 + 0.7874 * (1 - v),
                    0.7152 - 0.7152 * (1 - v),
                    0.0722 - 0.0722 * (1 - v),
                    0,
                    0
                ],
                [
                    0.2126 - 0.2126 * (1 - v),
                    0.7152 + 0.2848 * (1 - v),
                    0.0722 - 0.0722 * (1 - v),
                    0,
                    0
                ],
                [
                    0.2126 - 0.2126 * (1 - v),
                    0.7152 - 0.7152 * (1 - v),
                    0.0722 + 0.9278 * (1 - v),
                    0,
                    0
                ],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ];
        }
    };

    var FilterMode;
    (function (FilterMode) {
        FilterMode[(FilterMode["light"] = 0)] = "light";
        FilterMode[(FilterMode["dark"] = 1)] = "dark";
    })(FilterMode || (FilterMode = {}));
    function getCSSFilterValue(config) {
        const filters = [];
        if (config.mode === FilterMode.dark) {
            filters.push("invert(100%) hue-rotate(180deg)");
        }
        if (config.brightness !== 100) {
            filters.push(`brightness(${config.brightness}%)`);
        }
        if (config.contrast !== 100) {
            filters.push(`contrast(${config.contrast}%)`);
        }
        if (config.grayscale !== 0) {
            filters.push(`grayscale(${config.grayscale}%)`);
        }
        if (config.sepia !== 0) {
            filters.push(`sepia(${config.sepia}%)`);
        }
        if (filters.length === 0) {
            return null;
        }
        return filters.join(" ");
    }

    function evalMath(expression) {
        const rpnStack = [];
        const workingStack = [];
        let lastToken;
        for (let i = 0, len = expression.length; i < len; i++) {
            const token = expression[i];
            if (!token || token === " ") {
                continue;
            }
            if (operators.has(token)) {
                const op = operators.get(token);
                while (workingStack.length) {
                    const currentOp = operators.get(workingStack[0]);
                    if (!currentOp) {
                        break;
                    }
                    if (op.lessOrEqualThan(currentOp)) {
                        rpnStack.push(workingStack.shift());
                    } else {
                        break;
                    }
                }
                workingStack.unshift(token);
            } else if (!lastToken || operators.has(lastToken)) {
                rpnStack.push(token);
            } else {
                rpnStack[rpnStack.length - 1] += token;
            }
            lastToken = token;
        }
        rpnStack.push(...workingStack);
        const stack = [];
        for (let i = 0, len = rpnStack.length; i < len; i++) {
            const op = operators.get(rpnStack[i]);
            if (op) {
                const args = stack.splice(0, 2);
                stack.push(op.exec(args[1], args[0]));
            } else {
                stack.unshift(parseFloat(rpnStack[i]));
            }
        }
        return stack[0];
    }
    class Operator {
        constructor(precedence, method) {
            this.precendce = precedence;
            this.execMethod = method;
        }
        exec(left, right) {
            return this.execMethod(left, right);
        }
        lessOrEqualThan(op) {
            return this.precendce <= op.precendce;
        }
    }
    const operators = new Map([
        ["+", new Operator(1, (left, right) => left + right)],
        ["-", new Operator(1, (left, right) => left - right)],
        ["*", new Operator(2, (left, right) => left * right)],
        ["/", new Operator(2, (left, right) => left / right)]
    ]);

    const isSystemDarkModeEnabled = () =>
        matchMedia("(prefers-color-scheme: dark)").matches;

    const hslaParseCache = new Map();
    const rgbaParseCache = new Map();
    function parseColorWithCache($color) {
        $color = $color.trim();
        const key = $color;
        if (rgbaParseCache.has(key)) {
            return rgbaParseCache.get(key);
        }
        if ($color.includes("calc(")) {
            $color = lowerCalcExpression($color);
        }
        const color = parse($color);
        rgbaParseCache.set(key, color);
        return color;
    }
    function parseToHSLWithCache(color) {
        if (hslaParseCache.has(color)) {
            return hslaParseCache.get(color);
        }
        const rgb = parseColorWithCache(color);
        if (!rgb) {
            return null;
        }
        const hsl = rgbToHSL(rgb);
        hslaParseCache.set(color, hsl);
        return hsl;
    }
    function clearColorCache() {
        hslaParseCache.clear();
        rgbaParseCache.clear();
    }
    function hslToRGB({h, s, l, a = 1}) {
        if (s === 0) {
            const [r, b, g] = [l, l, l].map((x) => Math.round(x * 255));
            return {r, g, b, a};
        }
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        const [r, g, b] = (
            h < 60
                ? [c, x, 0]
                : h < 120
                  ? [x, c, 0]
                  : h < 180
                    ? [0, c, x]
                    : h < 240
                      ? [0, x, c]
                      : h < 300
                        ? [x, 0, c]
                        : [c, 0, x]
        ).map((n) => Math.round((n + m) * 255));
        return {r, g, b, a};
    }
    function rgbToHSL({r: r255, g: g255, b: b255, a = 1}) {
        const r = r255 / 255;
        const g = g255 / 255;
        const b = b255 / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const c = max - min;
        const l = (max + min) / 2;
        if (c === 0) {
            return {h: 0, s: 0, l, a};
        }
        let h =
            (max === r
                ? ((g - b) / c) % 6
                : max === g
                  ? (b - r) / c + 2
                  : (r - g) / c + 4) * 60;
        if (h < 0) {
            h += 360;
        }
        const s = c / (1 - Math.abs(2 * l - 1));
        return {h, s, l, a};
    }
    function toFixed(n, digits = 0) {
        const fixed = n.toFixed(digits);
        if (digits === 0) {
            return fixed;
        }
        const dot = fixed.indexOf(".");
        if (dot >= 0) {
            const zerosMatch = fixed.match(/0+$/);
            if (zerosMatch) {
                if (zerosMatch.index === dot + 1) {
                    return fixed.substring(0, dot);
                }
                return fixed.substring(0, zerosMatch.index);
            }
        }
        return fixed;
    }
    function rgbToString(rgb) {
        const {r, g, b, a} = rgb;
        if (a != null && a < 1) {
            return `rgba(${toFixed(r)}, ${toFixed(g)}, ${toFixed(b)}, ${toFixed(a, 2)})`;
        }
        return `rgb(${toFixed(r)}, ${toFixed(g)}, ${toFixed(b)})`;
    }
    function rgbToHexString({r, g, b, a}) {
        return `#${(a != null && a < 1
            ? [r, g, b, Math.round(a * 255)]
            : [r, g, b]
        )
            .map((x) => {
                return `${x < 16 ? "0" : ""}${x.toString(16)}`;
            })
            .join("")}`;
    }
    function hslToString(hsl) {
        const {h, s, l, a} = hsl;
        if (a != null && a < 1) {
            return `hsla(${toFixed(h)}, ${toFixed(s * 100)}%, ${toFixed(l * 100)}%, ${toFixed(a, 2)})`;
        }
        return `hsl(${toFixed(h)}, ${toFixed(s * 100)}%, ${toFixed(l * 100)}%)`;
    }
    const rgbMatch = /^rgba?\([^\(\)]+\)$/;
    const hslMatch = /^hsla?\([^\(\)]+\)$/;
    const hexMatch = /^#[0-9a-f]+$/i;
    const supportedColorFuncs = [
        "color",
        "color-mix",
        "hwb",
        "lab",
        "lch",
        "oklab",
        "oklch"
    ];
    function parse($color) {
        const c = $color.trim().toLowerCase();
        if (c.includes("(from ")) {
            if (c.indexOf("(from") !== c.lastIndexOf("(from")) {
                return null;
            }
            return domParseColor(c);
        }
        if (c.match(rgbMatch)) {
            if (c.startsWith("rgb(#") || c.startsWith("rgba(#")) {
                if (c.lastIndexOf("rgb") > 0) {
                    return null;
                }
                return domParseColor(c);
            }
            return parseRGB(c);
        }
        if (c.match(hslMatch)) {
            return parseHSL(c);
        }
        if (c.match(hexMatch)) {
            return parseHex(c);
        }
        if (knownColors.has(c)) {
            return getColorByName(c);
        }
        if (systemColors.has(c)) {
            return getSystemColor(c);
        }
        if (c === "transparent") {
            return {r: 0, g: 0, b: 0, a: 0};
        }
        if (
            c.endsWith(")") &&
            supportedColorFuncs.some(
                (fn) =>
                    c.startsWith(fn) &&
                    c[fn.length] === "(" &&
                    c.lastIndexOf(fn) === 0
            )
        ) {
            return domParseColor(c);
        }
        if (c.startsWith("light-dark(") && c.endsWith(")")) {
            const match = c.match(
                /^light-dark\(\s*([a-z]+(\(.*\))?),\s*([a-z]+(\(.*\))?)\s*\)$/
            );
            if (match) {
                const schemeColor = isSystemDarkModeEnabled()
                    ? match[3]
                    : match[1];
                return parse(schemeColor);
            }
        }
        return null;
    }
    const C_0 = "0".charCodeAt(0);
    const C_9 = "9".charCodeAt(0);
    const C_e = "e".charCodeAt(0);
    const C_DOT = ".".charCodeAt(0);
    const C_PLUS = "+".charCodeAt(0);
    const C_MINUS = "-".charCodeAt(0);
    const C_SPACE = " ".charCodeAt(0);
    const C_COMMA = ",".charCodeAt(0);
    const C_SLASH = "/".charCodeAt(0);
    const C_PERCENT = "%".charCodeAt(0);
    function getNumbersFromString(input, range, units) {
        const numbers = [];
        const searchStart = input.indexOf("(") + 1;
        const searchEnd = input.length - 1;
        let numStart = -1;
        let unitStart = -1;
        const push = (matchEnd) => {
            const numEnd = unitStart > -1 ? unitStart : matchEnd;
            const $num = input.slice(numStart, numEnd);
            let n = parseFloat($num);
            const r = range[numbers.length];
            if (unitStart > -1) {
                const unit = input.slice(unitStart, matchEnd);
                const u = units[unit];
                if (u != null) {
                    n *= r / u;
                }
            }
            if (r > 1) {
                n = Math.round(n);
            }
            numbers.push(n);
            numStart = -1;
            unitStart = -1;
        };
        for (let i = searchStart; i < searchEnd; i++) {
            const c = input.charCodeAt(i);
            const isNumChar =
                (c >= C_0 && c <= C_9) ||
                c === C_DOT ||
                c === C_PLUS ||
                c === C_MINUS ||
                c === C_e;
            const isDelimiter = c === C_SPACE || c === C_COMMA || c === C_SLASH;
            if (isNumChar) {
                if (numStart === -1) {
                    numStart = i;
                }
            } else if (numStart > -1) {
                if (isDelimiter) {
                    push(i);
                } else if (unitStart === -1) {
                    unitStart = i;
                }
            }
        }
        if (numStart > -1) {
            push(searchEnd);
        }
        return numbers;
    }
    const rgbRange = [255, 255, 255, 1];
    const rgbUnits = {"%": 100};
    function getRGBValues(input) {
        const CHAR_CODE_0 = 48;
        const length = input.length;
        let i = 0;
        let digitsCount = 0;
        let digitSequence = false;
        let floatDigitsCount = -1;
        let delimiter = C_SPACE;
        let channel = -1;
        let result = null;
        while (i < length) {
            const c = input.charCodeAt(i);
            if ((c >= C_0 && c <= C_9) || c === C_DOT) {
                if (!digitSequence) {
                    digitSequence = true;
                    digitsCount = 0;
                    floatDigitsCount = -1;
                    channel++;
                    if (channel === 3 && result) {
                        result[3] = 0;
                    }
                    if (channel > 3) {
                        return null;
                    }
                }
                if (c === C_DOT) {
                    if (floatDigitsCount > 0) {
                        return null;
                    }
                    floatDigitsCount = 0;
                } else {
                    const d = c - CHAR_CODE_0;
                    if (!result) {
                        result = [0, 0, 0, 1];
                    }
                    if (floatDigitsCount > -1) {
                        floatDigitsCount++;
                        result[channel] += d / 10 ** floatDigitsCount;
                    } else {
                        digitsCount++;
                        if (digitsCount > 3) {
                            return null;
                        }
                        result[channel] = result[channel] * 10 + d;
                    }
                }
            } else if (c === C_PERCENT) {
                if (
                    channel < 0 ||
                    channel > 3 ||
                    delimiter !== C_SPACE ||
                    !result
                ) {
                    return null;
                }
                result[channel] =
                    channel < 3
                        ? Math.round((result[channel] * 255) / 100)
                        : result[channel] / 100;
                digitSequence = false;
            } else {
                digitSequence = false;
                if (c === C_SPACE) {
                    if (channel === 0) {
                        delimiter = c;
                    }
                } else if (c === C_COMMA) {
                    if (channel === -1) {
                        return null;
                    }
                    delimiter = C_COMMA;
                } else if (c === C_SLASH) {
                    if (channel !== 2 || delimiter !== C_SPACE) {
                        return null;
                    }
                } else {
                    return null;
                }
            }
            i++;
        }
        if (channel < 2 || channel > 3) {
            return null;
        }
        return result;
    }
    function parseRGB($rgb) {
        const [r, g, b, a = 1] = getNumbersFromString($rgb, rgbRange, rgbUnits);
        if (r == null || g == null || b == null || a == null) {
            return null;
        }
        return {r, g, b, a};
    }
    const hslRange = [360, 1, 1, 1];
    const hslUnits = {"%": 100, "deg": 360, "rad": 2 * Math.PI, "turn": 1};
    function parseHSL($hsl) {
        const [h, s, l, a = 1] = getNumbersFromString($hsl, hslRange, hslUnits);
        if (h == null || s == null || l == null || a == null) {
            return null;
        }
        return hslToRGB({h, s, l, a});
    }
    const C_A = "A".charCodeAt(0);
    const C_F = "F".charCodeAt(0);
    const C_a = "a".charCodeAt(0);
    const C_f = "f".charCodeAt(0);
    function parseHex($hex) {
        const length = $hex.length;
        const digitCount = length - 1;
        const isShort = digitCount === 3 || digitCount === 4;
        const isLong = digitCount === 6 || digitCount === 8;
        if (!isShort && !isLong) {
            return null;
        }
        const hex = (i) => {
            const c = $hex.charCodeAt(i);
            if (c >= C_A && c <= C_F) {
                return c + 10 - C_A;
            }
            if (c >= C_a && c <= C_f) {
                return c + 10 - C_a;
            }
            return c - C_0;
        };
        let r;
        let g;
        let b;
        let a = 1;
        if (isShort) {
            r = hex(1) * 17;
            g = hex(2) * 17;
            b = hex(3) * 17;
            if (digitCount === 4) {
                a = (hex(4) * 17) / 255;
            }
        } else {
            r = hex(1) * 16 + hex(2);
            g = hex(3) * 16 + hex(4);
            b = hex(5) * 16 + hex(6);
            if (digitCount === 8) {
                a = (hex(7) * 16 + hex(8)) / 255;
            }
        }
        return {r, g, b, a};
    }
    function getColorByName($color) {
        const n = knownColors.get($color);
        return {
            r: (n >> 16) & 255,
            g: (n >> 8) & 255,
            b: (n >> 0) & 255,
            a: 1
        };
    }
    function getSystemColor($color) {
        const n = systemColors.get($color);
        return {
            r: (n >> 16) & 255,
            g: (n >> 8) & 255,
            b: (n >> 0) & 255,
            a: 1
        };
    }
    function lowerCalcExpression(color) {
        let searchIndex = 0;
        const replaceBetweenIndices = (start, end, replacement) => {
            color =
                color.substring(0, start) + replacement + color.substring(end);
        };
        while ((searchIndex = color.indexOf("calc(")) !== -1) {
            const range = getParenthesesRange(color, searchIndex);
            if (!range) {
                break;
            }
            let slice = color.slice(range.start + 1, range.end - 1);
            const includesPercentage = slice.includes("%");
            slice = slice.split("%").join("");
            const output = Math.round(evalMath(slice));
            replaceBetweenIndices(
                range.start - 4,
                range.end,
                output + (includesPercentage ? "%" : "")
            );
        }
        return color;
    }
    const knownColors = new Map(
        Object.entries({
            aliceblue: 0xf0f8ff,
            antiquewhite: 0xfaebd7,
            aqua: 0x00ffff,
            aquamarine: 0x7fffd4,
            azure: 0xf0ffff,
            beige: 0xf5f5dc,
            bisque: 0xffe4c4,
            black: 0x000000,
            blanchedalmond: 0xffebcd,
            blue: 0x0000ff,
            blueviolet: 0x8a2be2,
            brown: 0xa52a2a,
            burlywood: 0xdeb887,
            cadetblue: 0x5f9ea0,
            chartreuse: 0x7fff00,
            chocolate: 0xd2691e,
            coral: 0xff7f50,
            cornflowerblue: 0x6495ed,
            cornsilk: 0xfff8dc,
            crimson: 0xdc143c,
            cyan: 0x00ffff,
            darkblue: 0x00008b,
            darkcyan: 0x008b8b,
            darkgoldenrod: 0xb8860b,
            darkgray: 0xa9a9a9,
            darkgrey: 0xa9a9a9,
            darkgreen: 0x006400,
            darkkhaki: 0xbdb76b,
            darkmagenta: 0x8b008b,
            darkolivegreen: 0x556b2f,
            darkorange: 0xff8c00,
            darkorchid: 0x9932cc,
            darkred: 0x8b0000,
            darksalmon: 0xe9967a,
            darkseagreen: 0x8fbc8f,
            darkslateblue: 0x483d8b,
            darkslategray: 0x2f4f4f,
            darkslategrey: 0x2f4f4f,
            darkturquoise: 0x00ced1,
            darkviolet: 0x9400d3,
            deeppink: 0xff1493,
            deepskyblue: 0x00bfff,
            dimgray: 0x696969,
            dimgrey: 0x696969,
            dodgerblue: 0x1e90ff,
            firebrick: 0xb22222,
            floralwhite: 0xfffaf0,
            forestgreen: 0x228b22,
            fuchsia: 0xff00ff,
            gainsboro: 0xdcdcdc,
            ghostwhite: 0xf8f8ff,
            gold: 0xffd700,
            goldenrod: 0xdaa520,
            gray: 0x808080,
            grey: 0x808080,
            green: 0x008000,
            greenyellow: 0xadff2f,
            honeydew: 0xf0fff0,
            hotpink: 0xff69b4,
            indianred: 0xcd5c5c,
            indigo: 0x4b0082,
            ivory: 0xfffff0,
            khaki: 0xf0e68c,
            lavender: 0xe6e6fa,
            lavenderblush: 0xfff0f5,
            lawngreen: 0x7cfc00,
            lemonchiffon: 0xfffacd,
            lightblue: 0xadd8e6,
            lightcoral: 0xf08080,
            lightcyan: 0xe0ffff,
            lightgoldenrodyellow: 0xfafad2,
            lightgray: 0xd3d3d3,
            lightgrey: 0xd3d3d3,
            lightgreen: 0x90ee90,
            lightpink: 0xffb6c1,
            lightsalmon: 0xffa07a,
            lightseagreen: 0x20b2aa,
            lightskyblue: 0x87cefa,
            lightslategray: 0x778899,
            lightslategrey: 0x778899,
            lightsteelblue: 0xb0c4de,
            lightyellow: 0xffffe0,
            lime: 0x00ff00,
            limegreen: 0x32cd32,
            linen: 0xfaf0e6,
            magenta: 0xff00ff,
            maroon: 0x800000,
            mediumaquamarine: 0x66cdaa,
            mediumblue: 0x0000cd,
            mediumorchid: 0xba55d3,
            mediumpurple: 0x9370db,
            mediumseagreen: 0x3cb371,
            mediumslateblue: 0x7b68ee,
            mediumspringgreen: 0x00fa9a,
            mediumturquoise: 0x48d1cc,
            mediumvioletred: 0xc71585,
            midnightblue: 0x191970,
            mintcream: 0xf5fffa,
            mistyrose: 0xffe4e1,
            moccasin: 0xffe4b5,
            navajowhite: 0xffdead,
            navy: 0x000080,
            oldlace: 0xfdf5e6,
            olive: 0x808000,
            olivedrab: 0x6b8e23,
            orange: 0xffa500,
            orangered: 0xff4500,
            orchid: 0xda70d6,
            palegoldenrod: 0xeee8aa,
            palegreen: 0x98fb98,
            paleturquoise: 0xafeeee,
            palevioletred: 0xdb7093,
            papayawhip: 0xffefd5,
            peachpuff: 0xffdab9,
            peru: 0xcd853f,
            pink: 0xffc0cb,
            plum: 0xdda0dd,
            powderblue: 0xb0e0e6,
            purple: 0x800080,
            rebeccapurple: 0x663399,
            red: 0xff0000,
            rosybrown: 0xbc8f8f,
            royalblue: 0x4169e1,
            saddlebrown: 0x8b4513,
            salmon: 0xfa8072,
            sandybrown: 0xf4a460,
            seagreen: 0x2e8b57,
            seashell: 0xfff5ee,
            sienna: 0xa0522d,
            silver: 0xc0c0c0,
            skyblue: 0x87ceeb,
            slateblue: 0x6a5acd,
            slategray: 0x708090,
            slategrey: 0x708090,
            snow: 0xfffafa,
            springgreen: 0x00ff7f,
            steelblue: 0x4682b4,
            tan: 0xd2b48c,
            teal: 0x008080,
            thistle: 0xd8bfd8,
            tomato: 0xff6347,
            turquoise: 0x40e0d0,
            violet: 0xee82ee,
            wheat: 0xf5deb3,
            white: 0xffffff,
            whitesmoke: 0xf5f5f5,
            yellow: 0xffff00,
            yellowgreen: 0x9acd32
        })
    );
    const systemColors = new Map(
        Object.entries({
            "ActiveBorder": 0x3b99fc,
            "ActiveCaption": 0x000000,
            "AppWorkspace": 0xaaaaaa,
            "Background": 0x6363ce,
            "ButtonFace": 0xffffff,
            "ButtonHighlight": 0xe9e9e9,
            "ButtonShadow": 0x9fa09f,
            "ButtonText": 0x000000,
            "CaptionText": 0x000000,
            "GrayText": 0x7f7f7f,
            "Highlight": 0xb2d7ff,
            "HighlightText": 0x000000,
            "InactiveBorder": 0xffffff,
            "InactiveCaption": 0xffffff,
            "InactiveCaptionText": 0x000000,
            "InfoBackground": 0xfbfcc5,
            "InfoText": 0x000000,
            "Menu": 0xf6f6f6,
            "MenuText": 0xffffff,
            "Scrollbar": 0xaaaaaa,
            "ThreeDDarkShadow": 0x000000,
            "ThreeDFace": 0xc0c0c0,
            "ThreeDHighlight": 0xffffff,
            "ThreeDLightShadow": 0xffffff,
            "ThreeDShadow": 0x000000,
            "Window": 0xececec,
            "WindowFrame": 0xaaaaaa,
            "WindowText": 0x000000,
            "-webkit-focus-ring-color": 0xe59700
        }).map(([key, value]) => [key.toLowerCase(), value])
    );
    function getSRGBLightness(r, g, b) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }
    let canvas$1;
    let context$1;
    function domParseColor($color) {
        if (!context$1) {
            canvas$1 = document.createElement("canvas");
            canvas$1.width = 1;
            canvas$1.height = 1;
            context$1 = canvas$1.getContext("2d", {willReadFrequently: true});
        }
        context$1.fillStyle = $color;
        context$1.fillRect(0, 0, 1, 1);
        const d = context$1.getImageData(0, 0, 1, 1).data;
        const color = `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${(d[3] / 255).toFixed(2)})`;
        return parseRGB(color);
    }

    function throttle(callback) {
        let pending = false;
        let frameId = null;
        let lastArgs;
        const throttled = (...args) => {
            lastArgs = args;
            if (frameId) {
                pending = true;
            } else {
                callback(...lastArgs);
                frameId = requestAnimationFrame(() => {
                    frameId = null;
                    if (pending) {
                        callback(...lastArgs);
                        pending = false;
                    }
                });
            }
        };
        const cancel = () => {
            cancelAnimationFrame(frameId);
            pending = false;
            frameId = null;
        };
        return Object.assign(throttled, {cancel});
    }
    function createAsyncTasksQueue() {
        const tasks = [];
        let frameId = null;
        function runTasks() {
            let task;
            while ((task = tasks.shift())) {
                task();
            }
            frameId = null;
        }
        function add(task) {
            tasks.push(task);
            if (!frameId) {
                frameId = requestAnimationFrame(runTasks);
            }
        }
        function cancel() {
            tasks.splice(0);
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        return {add, cancel};
    }

    function hexify(number) {
        return (number < 16 ? "0" : "") + number.toString(16);
    }
    function generateUID() {
        if ("randomUUID" in crypto) {
            const uuid = crypto.randomUUID();
            return (
                uuid.substring(0, 8) +
                uuid.substring(9, 13) +
                uuid.substring(14, 18) +
                uuid.substring(19, 23) +
                uuid.substring(24)
            );
        }
        if ("getRandomValues" in crypto) {
            return Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map((x) => hexify(x))
                .join("");
        }
        return Math.floor(Math.random() * 2 ** 55).toString(36);
    }

    let documentVisibilityListener = null;
    let documentIsVisible_ = !document.hidden;
    const listenerOptions = {
        capture: true,
        passive: true
    };
    function watchForDocumentVisibility() {
        document.addEventListener(
            "visibilitychange",
            documentVisibilityListener,
            listenerOptions
        );
        window.addEventListener(
            "pageshow",
            documentVisibilityListener,
            listenerOptions
        );
        window.addEventListener(
            "focus",
            documentVisibilityListener,
            listenerOptions
        );
    }
    function stopWatchingForDocumentVisibility() {
        document.removeEventListener(
            "visibilitychange",
            documentVisibilityListener,
            listenerOptions
        );
        window.removeEventListener(
            "pageshow",
            documentVisibilityListener,
            listenerOptions
        );
        window.removeEventListener(
            "focus",
            documentVisibilityListener,
            listenerOptions
        );
    }
    function setDocumentVisibilityListener(callback) {
        const alreadyWatching = Boolean(documentVisibilityListener);
        documentVisibilityListener = () => {
            if (!document.hidden) {
                removeDocumentVisibilityListener();
                callback();
                documentIsVisible_ = true;
            }
        };
        if (!alreadyWatching) {
            watchForDocumentVisibility();
        }
    }
    function removeDocumentVisibilityListener() {
        stopWatchingForDocumentVisibility();
        documentVisibilityListener = null;
    }
    function documentIsVisible() {
        return documentIsVisible_;
    }

    function getDuration(time) {
        let duration = 0;
        if (time.seconds) {
            duration += time.seconds * 1000;
        }
        if (time.minutes) {
            duration += time.minutes * 60 * 1000;
        }
        if (time.hours) {
            duration += time.hours * 60 * 60 * 1000;
        }
        if (time.days) {
            duration += time.days * 24 * 60 * 60 * 1000;
        }
        return duration;
    }

    function logInfo(...args) {}
    function logWarn(...args) {}

    function removeNode(node) {
        node && node.parentNode && node.parentNode.removeChild(node);
    }
    function watchForNodePosition(node, mode, onRestore = Function.prototype) {
        const MAX_ATTEMPTS_COUNT = 10;
        const RETRY_TIMEOUT = getDuration({seconds: 2});
        const ATTEMPTS_INTERVAL = getDuration({seconds: 10});
        let prevSibling = node.previousSibling;
        let parent = node.parentNode;
        if (!parent) {
            throw new Error(
                "Unable to watch for node position: parent element not found"
            );
        }
        if (mode === "prev-sibling" && !prevSibling) {
            throw new Error(
                "Unable to watch for node position: there is no previous sibling"
            );
        }
        let attempts = 0;
        let start = null;
        let timeoutId = null;
        const restore = throttle(() => {
            if (timeoutId) {
                return;
            }
            attempts++;
            const now = Date.now();
            if (start == null) {
                start = now;
            } else if (attempts >= MAX_ATTEMPTS_COUNT) {
                if (now - start < ATTEMPTS_INTERVAL) {
                    logWarn(
                        `Node position watcher paused: retry in ${RETRY_TIMEOUT}ms`,
                        node,
                        prevSibling
                    );
                    timeoutId = setTimeout(() => {
                        start = null;
                        attempts = 0;
                        timeoutId = null;
                        restore();
                    }, RETRY_TIMEOUT);
                    return;
                }
                start = now;
                attempts = 1;
            }
            if (mode === "head") {
                if (prevSibling && prevSibling.parentNode !== parent) {
                    logWarn(
                        "Sibling moved, moving node to the head end",
                        node,
                        prevSibling,
                        parent
                    );
                    prevSibling = document.head.lastChild;
                }
            }
            if (mode === "prev-sibling") {
                if (prevSibling.parentNode == null) {
                    logWarn(
                        "Unable to restore node position: sibling was removed",
                        node,
                        prevSibling,
                        parent
                    );
                    stop();
                    return;
                }
                if (prevSibling.parentNode !== parent) {
                    logWarn(
                        "Style was moved to another parent",
                        node,
                        prevSibling,
                        parent
                    );
                    updateParent(prevSibling.parentNode);
                }
            }
            if (mode === "head" && !parent.isConnected) {
                parent = document.head;
            }
            logWarn("Restoring node position", node, prevSibling, parent);
            parent.insertBefore(
                node,
                prevSibling && prevSibling.isConnected
                    ? prevSibling.nextSibling
                    : parent.firstChild
            );
            observer.takeRecords();
            onRestore && onRestore();
        });
        const observer = new MutationObserver(() => {
            if (
                (mode === "head" &&
                    (node.parentNode !== parent ||
                        !node.parentNode.isConnected)) ||
                (mode === "prev-sibling" &&
                    node.previousSibling !== prevSibling)
            ) {
                restore();
            }
        });
        const run = () => {
            observer.observe(parent, {childList: true});
        };
        const stop = () => {
            clearTimeout(timeoutId);
            observer.disconnect();
            restore.cancel();
        };
        const skip = () => {
            observer.takeRecords();
        };
        const updateParent = (parentNode) => {
            parent = parentNode;
            stop();
            run();
        };
        run();
        return {run, stop, skip};
    }
    function iterateShadowHosts(root, iterator) {
        if (root == null) {
            return;
        }
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode(node) {
                    return node.shadowRoot == null
                        ? NodeFilter.FILTER_SKIP
                        : NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        for (
            let node = root.shadowRoot ? walker.currentNode : walker.nextNode();
            node != null;
            node = walker.nextNode()
        ) {
            if (node.classList.contains("surfingkeys_hints_host")) {
                continue;
            }
            iterator(node);
            iterateShadowHosts(node.shadowRoot, iterator);
        }
    }
    let isDOMReady = () => {
        return (
            document.readyState === "complete" ||
            document.readyState === "interactive"
        );
    };
    function setIsDOMReady(newFunc) {
        isDOMReady = newFunc;
    }
    const readyStateListeners = new Set();
    function addDOMReadyListener(listener) {
        isDOMReady() ? listener() : readyStateListeners.add(listener);
    }
    function removeDOMReadyListener(listener) {
        readyStateListeners.delete(listener);
    }
    function isReadyStateComplete() {
        return document.readyState === "complete";
    }
    const readyStateCompleteListeners = new Set();
    function addReadyStateCompleteListener(listener) {
        isReadyStateComplete()
            ? listener()
            : readyStateCompleteListeners.add(listener);
    }
    function cleanReadyStateCompleteListeners() {
        readyStateCompleteListeners.clear();
    }
    if (!isDOMReady()) {
        const onReadyStateChange = () => {
            if (isDOMReady()) {
                readyStateListeners.forEach((listener) => listener());
                readyStateListeners.clear();
                if (isReadyStateComplete()) {
                    document.removeEventListener(
                        "readystatechange",
                        onReadyStateChange
                    );
                    readyStateCompleteListeners.forEach((listener) =>
                        listener()
                    );
                    readyStateCompleteListeners.clear();
                }
            }
        };
        document.addEventListener("readystatechange", onReadyStateChange);
    }
    const HUGE_MUTATIONS_COUNT = 1000;
    function isHugeMutation(mutations) {
        if (mutations.length > HUGE_MUTATIONS_COUNT) {
            return true;
        }
        let addedNodesCount = 0;
        for (let i = 0; i < mutations.length; i++) {
            addedNodesCount += mutations[i].addedNodes.length;
            if (addedNodesCount > HUGE_MUTATIONS_COUNT) {
                return true;
            }
        }
        return false;
    }
    function getElementsTreeOperations(mutations) {
        const additions = new Set();
        const deletions = new Set();
        const moves = new Set();
        mutations.forEach((m) => {
            forEach(m.addedNodes, (n) => {
                if (n instanceof Element && n.isConnected) {
                    additions.add(n);
                }
            });
            forEach(m.removedNodes, (n) => {
                if (n instanceof Element) {
                    if (n.isConnected) {
                        moves.add(n);
                        additions.delete(n);
                    } else {
                        deletions.add(n);
                    }
                }
            });
        });
        const duplicateAdditions = [];
        const duplicateDeletions = [];
        additions.forEach((node) => {
            if (additions.has(node.parentElement)) {
                duplicateAdditions.push(node);
            }
        });
        deletions.forEach((node) => {
            if (deletions.has(node.parentElement)) {
                duplicateDeletions.push(node);
            }
        });
        duplicateAdditions.forEach((node) => additions.delete(node));
        duplicateDeletions.forEach((node) => deletions.delete(node));
        return {additions, moves, deletions};
    }
    const optimizedTreeObservers = new Map();
    const optimizedTreeCallbacks = new WeakMap();
    function createOptimizedTreeObserver(root, callbacks) {
        let observer;
        let observerCallbacks;
        let domReadyListener;
        if (optimizedTreeObservers.has(root)) {
            observer = optimizedTreeObservers.get(root);
            observerCallbacks = optimizedTreeCallbacks.get(observer);
        } else {
            let hadHugeMutationsBefore = false;
            let subscribedForReadyState = false;
            observer = new MutationObserver((mutations) => {
                if (isHugeMutation(mutations)) {
                    if (!hadHugeMutationsBefore || isDOMReady()) {
                        observerCallbacks.forEach(({onHugeMutations}) =>
                            onHugeMutations(root)
                        );
                    } else if (!subscribedForReadyState) {
                        domReadyListener = () =>
                            observerCallbacks.forEach(({onHugeMutations}) =>
                                onHugeMutations(root)
                            );
                        addDOMReadyListener(domReadyListener);
                        subscribedForReadyState = true;
                    }
                    hadHugeMutationsBefore = true;
                } else {
                    const elementsOperations =
                        getElementsTreeOperations(mutations);
                    observerCallbacks.forEach(({onMinorMutations}) =>
                        onMinorMutations(root, elementsOperations)
                    );
                }
            });
            observer.observe(root, {childList: true, subtree: true});
            optimizedTreeObservers.set(root, observer);
            observerCallbacks = new Set();
            optimizedTreeCallbacks.set(observer, observerCallbacks);
        }
        observerCallbacks.add(callbacks);
        return {
            disconnect() {
                observerCallbacks.delete(callbacks);
                if (domReadyListener) {
                    removeDOMReadyListener(domReadyListener);
                }
                if (observerCallbacks.size === 0) {
                    observer.disconnect();
                    optimizedTreeCallbacks.delete(observer);
                    optimizedTreeObservers.delete(root);
                }
            }
        };
    }

    function iterateCSSRules(
        rules,
        iterate,
        onImportError,
        importedSheets = new Set()
    ) {
        forEach(rules, (rule) => {
            if (isStyleRule(rule)) {
                iterate(rule);
                if (rule.cssRules?.length > 0) {
                    iterateCSSRules(
                        rule.cssRules,
                        iterate,
                        onImportError,
                        importedSheets
                    );
                }
            } else if (isImportRule(rule)) {
                try {
                    const importedSheet = rule.styleSheet;
                    if (!importedSheets.has(importedSheet)) {
                        importedSheets.add(importedSheet);
                        iterateCSSRules(
                            importedSheet.cssRules,
                            iterate,
                            onImportError,
                            importedSheets
                        );
                    }
                } catch (err) {
                    onImportError?.();
                }
            } else if (isMediaRule(rule)) {
                const media = Array.from(rule.media);
                const isScreenOrAllOrQuery = media.some(
                    (m) =>
                        m.startsWith("screen") ||
                        m.startsWith("all") ||
                        m.startsWith("(")
                );
                const isNotScreen =
                    !isScreenOrAllOrQuery &&
                    media.some((m) =>
                        ignoredMedia.some((i) => m.startsWith(i))
                    );
                if (isScreenOrAllOrQuery || !isNotScreen) {
                    iterateCSSRules(
                        rule.cssRules,
                        iterate,
                        onImportError,
                        importedSheets
                    );
                }
            } else if (isSupportsRule(rule)) {
                if (CSS.supports(rule.conditionText)) {
                    iterateCSSRules(
                        rule.cssRules,
                        iterate,
                        onImportError,
                        importedSheets
                    );
                }
            } else if (isLayerRule(rule)) {
                iterateCSSRules(
                    rule.cssRules,
                    iterate,
                    onImportError,
                    importedSheets
                );
            } else if (isContainerRule(rule)) {
                iterateCSSRules(
                    rule.cssRules,
                    iterate,
                    onImportError,
                    importedSheets
                );
            } else {
                logWarn(`CSSRule type not supported`, rule);
            }
        });
    }
    const ignoredMedia = [
        "aural",
        "braille",
        "embossed",
        "handheld",
        "print",
        "projection",
        "speech",
        "tty",
        "tv"
    ];
    const shorthandVarDependantProperties = [
        "background",
        "border",
        "border-color",
        "border-bottom",
        "border-left",
        "border-right",
        "border-top",
        "outline",
        "outline-color"
    ];
    const shorthandVarDepPropRegexps = isSafari
        ? shorthandVarDependantProperties.map((prop) => {
              const regexp = new RegExp(`${prop}:\\s*(.*?)\\s*;`);
              return [prop, regexp];
          })
        : null;
    function iterateCSSDeclarations(style, iterate) {
        const cssText = style.cssText;
        if (cssText.includes("var(")) {
            if (isSafari) {
                shorthandVarDepPropRegexps.forEach(([prop, regexp]) => {
                    const match = cssText.match(regexp);
                    if (match && match[1]) {
                        const val = match[1].trim();
                        iterate(prop, val);
                    }
                });
            } else {
                shorthandVarDependantProperties.forEach((prop) => {
                    const val = style.getPropertyValue(prop);
                    if (val && val.includes("var(")) {
                        iterate(prop, val);
                    }
                });
            }
        }
        if (
            (cssText.includes("background-color: ;") ||
                cssText.includes("background-image: ;")) &&
            !style.getPropertyValue("background")
        ) {
            handleEmptyShorthand("background", style, iterate);
        }
        if (
            cssText.includes("border-") &&
            cssText.includes("-color: ;") &&
            !style.getPropertyValue("border")
        ) {
            handleEmptyShorthand("border", style, iterate);
        }
        forEach(style, (property) => {
            const value = style.getPropertyValue(property).trim();
            if (!value) {
                return;
            }
            iterate(property, value);
        });
    }
    function handleEmptyShorthand(shorthand, style, iterate) {
        const parentRule = style.parentRule;
        if (isStyleRule(parentRule)) {
            const sourceCSSText =
                parentRule.parentStyleSheet?.ownerNode?.textContent;
            if (sourceCSSText) {
                let escapedSelector = escapeRegExpSpecialChars(
                    parentRule.selectorText
                );
                escapedSelector = escapedSelector.replaceAll(/\s+/g, "\\s*");
                escapedSelector = escapedSelector.replaceAll(/::/g, "::?");
                const regexp = new RegExp(
                    `${escapedSelector}\\s*{[^}]*${shorthand}:\\s*([^;}]+)`
                );
                const match = sourceCSSText.match(regexp);
                if (match) {
                    iterate(shorthand, match[1]);
                }
            } else if (shorthand === "background") {
                iterate("background-color", "#ffffff");
                iterate("background-image", "none");
            }
        }
    }
    const cssURLRegex = /url\((('.*?')|(".*?")|([^\)]*?))\)/g;
    const cssImportRegex =
        /@import\s*(url\()?(('.+?')|(".+?")|([^\)]*?))\)? ?(screen)?;?/gi;
    function getCSSURLValue(cssURL) {
        return cssURL
            .trim()
            .replace(/[\n\r\\]+/g, "")
            .replace(/^url\((.*)\)$/, "$1")
            .trim()
            .replace(/^"(.*)"$/, "$1")
            .replace(/^'(.*)'$/, "$1")
            .replace(/(?:\\(.))/g, "$1");
    }
    function getCSSBaseBath(url) {
        const cssURL = parseURL(url);
        return `${cssURL.origin}${cssURL.pathname.replace(/\?.*$/, "").replace(/(\/)([^\/]+)$/i, "$1")}`;
    }
    function replaceCSSRelativeURLsWithAbsolute($css, cssBasePath) {
        return $css.replace(cssURLRegex, (match) => {
            try {
                const url = getCSSURLValue(match);
                const absoluteURL = getAbsoluteURL(cssBasePath, url);
                const escapedURL = absoluteURL.replaceAll("'", "\\'");
                return `url('${escapedURL}')`;
            } catch (err) {
                logWarn(
                    "Not able to replace relative URL with Absolute URL, skipping"
                );
                return match;
            }
        });
    }
    const fontFaceRegex = /@font-face\s*{[^}]*}/g;
    function replaceCSSFontFace($css) {
        return $css.replace(fontFaceRegex, "");
    }
    const styleRules = new WeakSet();
    const importRules = new WeakSet();
    const mediaRules = new WeakSet();
    const supportsRules = new WeakSet();
    const layerRules = new WeakSet();
    const containerRules = new WeakSet();
    function isStyleRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return true;
        }
        if (rule.selectorText) {
            styleRules.add(rule);
            return true;
        }
        return false;
    }
    function isImportRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return false;
        }
        if (importRules.has(rule)) {
            return true;
        }
        if (rule.href) {
            importRules.add(rule);
            return true;
        }
        return false;
    }
    function isMediaRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return false;
        }
        if (mediaRules.has(rule)) {
            return true;
        }
        if (rule.media) {
            mediaRules.add(rule);
            return true;
        }
        return false;
    }
    function isSupportsRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return false;
        }
        if (supportsRules.has(rule)) {
            return true;
        }
        if (rule instanceof CSSSupportsRule) {
            supportsRules.add(rule);
            return true;
        }
        return false;
    }
    function isLayerRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return false;
        }
        if (layerRules.has(rule)) {
            return true;
        }
        if (isLayerRuleSupported && rule instanceof CSSLayerBlockRule) {
            layerRules.add(rule);
            return true;
        }
        return false;
    }
    function isContainerRule(rule) {
        if (!rule) {
            return false;
        }
        if (styleRules.has(rule)) {
            return false;
        }
        if (containerRules.has(rule)) {
            return true;
        }
        if (isContainerRuleSupported && rule instanceof CSSContainerRule) {
            containerRules.add(rule);
            return true;
        }
        return false;
    }

    const sheetsScopes = new WeakMap();
    function defineSheetScope(sheet, node) {
        sheetsScopes.set(sheet, node);
    }
    function getSheetScope(sheet) {
        if (!sheet.ownerNode) {
            return null;
        }
        if (sheetsScopes.has(sheet)) {
            return sheetsScopes.get(sheet);
        }
        let node = sheet.ownerNode;
        while (node) {
            if (node instanceof ShadowRoot || node instanceof Document) {
                defineSheetScope(sheet, node);
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    let variablesSheet;
    const registeredColors = new Map();
    function registerVariablesSheet(sheet) {
        variablesSheet = sheet;
        const types = ["background", "text", "border"];
        registeredColors.forEach((registered) => {
            types.forEach((type) => {
                if (registered[type]) {
                    const {variable, value} = registered[type];
                    variablesSheet?.cssRules[0]?.style.setProperty(
                        variable,
                        value
                    );
                }
            });
        });
    }
    function releaseVariablesSheet() {
        variablesSheet = null;
        clearColorPalette();
    }
    function getRegisteredVariableValue(type, registered) {
        return `var(${registered[type].variable}, ${registered[type].value})`;
    }
    function getRegisteredColor(type, parsed) {
        const hex = rgbToHexString(parsed);
        const registered = registeredColors.get(hex);
        if (registered?.[type]) {
            return getRegisteredVariableValue(type, registered);
        }
        return null;
    }
    function registerColor(type, parsed, value) {
        const hex = rgbToHexString(parsed);
        let registered;
        if (registeredColors.has(hex)) {
            registered = registeredColors.get(hex);
        } else {
            const parsed = parseColorWithCache(hex);
            registered = {parsed};
            registeredColors.set(hex, registered);
        }
        const variable = `--darkreader-${type}-${hex.replace("#", "")}`;
        registered[type] = {variable, value};
        if (variablesSheet?.cssRules[0]?.style) {
            (variablesSheet?.cssRules[0]).style.setProperty(variable, value);
        }
        return getRegisteredVariableValue(type, registered);
    }
    function getColorPalette() {
        const background = [];
        const border = [];
        const text = [];
        registeredColors.forEach((registered) => {
            if (registered.background) {
                background.push(registered.parsed);
            }
            if (registered.border) {
                border.push(registered.parsed);
            }
            if (registered.text) {
                text.push(registered.parsed);
            }
        });
        return {background, border, text};
    }
    function clearColorPalette() {
        registeredColors.clear();
    }

    function getBgPole(theme) {
        const isDarkScheme = theme.mode === 1;
        const prop = isDarkScheme
            ? "darkSchemeBackgroundColor"
            : "lightSchemeBackgroundColor";
        return theme[prop];
    }
    function getFgPole(theme) {
        const isDarkScheme = theme.mode === 1;
        const prop = isDarkScheme
            ? "darkSchemeTextColor"
            : "lightSchemeTextColor";
        return theme[prop];
    }
    const colorModificationCache = new Map();
    function clearColorModificationCache() {
        colorModificationCache.clear();
    }
    const rgbCacheKeys = ["r", "g", "b", "a"];
    const themeCacheKeys = [
        "mode",
        "brightness",
        "contrast",
        "grayscale",
        "sepia",
        "darkSchemeBackgroundColor",
        "darkSchemeTextColor",
        "lightSchemeBackgroundColor",
        "lightSchemeTextColor"
    ];
    function getCacheId(rgb, theme, poleA, poleB) {
        let resultId = "";
        rgbCacheKeys.forEach((key) => {
            resultId += `${rgb[key]};`;
        });
        themeCacheKeys.forEach((key) => {
            resultId += `${theme[key]};`;
        });
        resultId += `${poleA};${poleB}`;
        return resultId;
    }
    function modifyColorWithCache(
        rgb,
        theme,
        modifyHSL,
        poleColor,
        anotherPoleColor
    ) {
        let fnCache;
        if (colorModificationCache.has(modifyHSL)) {
            fnCache = colorModificationCache.get(modifyHSL);
        } else {
            fnCache = new Map();
            colorModificationCache.set(modifyHSL, fnCache);
        }
        const id = getCacheId(rgb, theme, poleColor, anotherPoleColor);
        if (fnCache.has(id)) {
            return fnCache.get(id);
        }
        const hsl = rgbToHSL(rgb);
        const pole = poleColor == null ? null : parseToHSLWithCache(poleColor);
        const anotherPole =
            anotherPoleColor == null
                ? null
                : parseToHSLWithCache(anotherPoleColor);
        const modified = modifyHSL(hsl, pole, anotherPole);
        const {r, g, b, a} = hslToRGB(modified);
        const matrix = createFilterMatrix({...theme, mode: 0});
        const [rf, gf, bf] = applyColorMatrix([r, g, b], matrix);
        const color =
            a === 1
                ? rgbToHexString({r: rf, g: gf, b: bf})
                : rgbToString({r: rf, g: gf, b: bf, a});
        fnCache.set(id, color);
        return color;
    }
    function modifyAndRegisterColor(type, rgb, theme, modifier) {
        const registered = getRegisteredColor(type, rgb);
        if (registered) {
            return registered;
        }
        const value = modifier(rgb, theme);
        return registerColor(type, rgb, value);
    }
    function modifyLightSchemeColor(rgb, theme) {
        const poleBg = getBgPole(theme);
        const poleFg = getFgPole(theme);
        return modifyColorWithCache(
            rgb,
            theme,
            modifyLightModeHSL,
            poleFg,
            poleBg
        );
    }
    function modifyLightModeHSL({h, s, l, a}, poleFg, poleBg) {
        const isDark = l < 0.5;
        let isNeutral;
        if (isDark) {
            isNeutral = l < 0.2 || s < 0.12;
        } else {
            const isBlue = h > 200 && h < 280;
            isNeutral = s < 0.24 || (l > 0.8 && isBlue);
        }
        let hx = h;
        let sx = s;
        if (isNeutral) {
            if (isDark) {
                hx = poleFg.h;
                sx = poleFg.s;
            } else {
                hx = poleBg.h;
                sx = poleBg.s;
            }
        }
        const lx = scale(l, 0, 1, poleFg.l, poleBg.l);
        return {h: hx, s: sx, l: lx, a};
    }
    const MAX_BG_LIGHTNESS = 0.4;
    function modifyBgHSL({h, s, l, a}, pole) {
        const isDark = l < 0.5;
        const isBlue = h > 200 && h < 280;
        const isNeutral = s < 0.12 || (l > 0.8 && isBlue);
        if (isDark) {
            const lx = scale(l, 0, 0.5, 0, MAX_BG_LIGHTNESS);
            if (isNeutral) {
                const hx = pole.h;
                const sx = pole.s;
                return {h: hx, s: sx, l: lx, a};
            }
            return {h, s, l: lx, a};
        }
        let lx = scale(l, 0.5, 1, MAX_BG_LIGHTNESS, pole.l);
        if (isNeutral) {
            const hx = pole.h;
            const sx = pole.s;
            return {h: hx, s: sx, l: lx, a};
        }
        let hx = h;
        const isYellow = h > 60 && h < 180;
        if (isYellow) {
            const isCloserToGreen = h > 120;
            if (isCloserToGreen) {
                hx = scale(h, 120, 180, 135, 180);
            } else {
                hx = scale(h, 60, 120, 60, 105);
            }
        }
        if (hx > 40 && hx < 80) {
            lx *= 0.75;
        }
        return {h: hx, s, l: lx, a};
    }
    function _modifyBackgroundColor(rgb, theme) {
        if (theme.mode === 0) {
            return modifyLightSchemeColor(rgb, theme);
        }
        const pole = getBgPole(theme);
        return modifyColorWithCache(rgb, theme, modifyBgHSL, pole);
    }
    function modifyBackgroundColor(
        rgb,
        theme,
        shouldRegisterColorVariable = true
    ) {
        if (!shouldRegisterColorVariable) {
            return _modifyBackgroundColor(rgb, theme);
        }
        return modifyAndRegisterColor(
            "background",
            rgb,
            theme,
            _modifyBackgroundColor
        );
    }
    const MIN_FG_LIGHTNESS = 0.55;
    function modifyBlueFgHue(hue) {
        return scale(hue, 205, 245, 205, 220);
    }
    function modifyFgHSL({h, s, l, a}, pole) {
        const isLight = l > 0.5;
        const isNeutral = l < 0.2 || s < 0.24;
        const isBlue = !isNeutral && h > 205 && h < 245;
        if (isLight) {
            const lx = scale(l, 0.5, 1, MIN_FG_LIGHTNESS, pole.l);
            if (isNeutral) {
                const hx = pole.h;
                const sx = pole.s;
                return {h: hx, s: sx, l: lx, a};
            }
            let hx = h;
            if (isBlue) {
                hx = modifyBlueFgHue(h);
            }
            return {h: hx, s, l: lx, a};
        }
        if (isNeutral) {
            const hx = pole.h;
            const sx = pole.s;
            const lx = scale(l, 0, 0.5, pole.l, MIN_FG_LIGHTNESS);
            return {h: hx, s: sx, l: lx, a};
        }
        let hx = h;
        let lx;
        if (isBlue) {
            hx = modifyBlueFgHue(h);
            lx = scale(l, 0, 0.5, pole.l, Math.min(1, MIN_FG_LIGHTNESS + 0.05));
        } else {
            lx = scale(l, 0, 0.5, pole.l, MIN_FG_LIGHTNESS);
        }
        return {h: hx, s, l: lx, a};
    }
    function _modifyForegroundColor(rgb, theme) {
        if (theme.mode === 0) {
            return modifyLightSchemeColor(rgb, theme);
        }
        const pole = getFgPole(theme);
        return modifyColorWithCache(rgb, theme, modifyFgHSL, pole);
    }
    function modifyForegroundColor(
        rgb,
        theme,
        shouldRegisterColorVariable = true
    ) {
        if (!shouldRegisterColorVariable) {
            return _modifyForegroundColor(rgb, theme);
        }
        return modifyAndRegisterColor(
            "text",
            rgb,
            theme,
            _modifyForegroundColor
        );
    }
    function modifyBorderHSL({h, s, l, a}, poleFg, poleBg) {
        const isDark = l < 0.5;
        const isNeutral = l < 0.2 || s < 0.24;
        let hx = h;
        let sx = s;
        if (isNeutral) {
            if (isDark) {
                hx = poleFg.h;
                sx = poleFg.s;
            } else {
                hx = poleBg.h;
                sx = poleBg.s;
            }
        }
        const lx = scale(l, 0, 1, 0.5, 0.2);
        return {h: hx, s: sx, l: lx, a};
    }
    function _modifyBorderColor(rgb, theme) {
        if (theme.mode === 0) {
            return modifyLightSchemeColor(rgb, theme);
        }
        const poleFg = getFgPole(theme);
        const poleBg = getBgPole(theme);
        return modifyColorWithCache(
            rgb,
            theme,
            modifyBorderHSL,
            poleFg,
            poleBg
        );
    }
    function modifyBorderColor(rgb, theme, shouldRegisterColorVariable = true) {
        if (!shouldRegisterColorVariable) {
            return _modifyBorderColor(rgb, theme);
        }
        return modifyAndRegisterColor("border", rgb, theme, _modifyBorderColor);
    }
    function modifyShadowColor(rgb, theme) {
        return modifyBackgroundColor(rgb, theme);
    }
    function modifyGradientColor(rgb, theme) {
        return modifyBackgroundColor(rgb, theme);
    }

    const gradientLength = "gradient".length;
    const conicGradient = "conic-";
    const conicGradientLength = conicGradient.length;
    const radialGradient = "radial-";
    const linearGradient = "linear-";
    function parseGradient(value) {
        const result = [];
        let index = 0;
        let startIndex = conicGradient.length;
        while ((index = value.indexOf("gradient", startIndex)) !== -1) {
            let typeGradient;
            [linearGradient, radialGradient, conicGradient].find(
                (possibleType) => {
                    if (index - possibleType.length >= 0) {
                        const possibleGradient = value.substring(
                            index - possibleType.length,
                            index
                        );
                        if (possibleGradient === possibleType) {
                            if (
                                value.slice(
                                    index - possibleType.length - 10,
                                    index - possibleType.length - 1
                                ) === "repeating"
                            ) {
                                typeGradient = `repeating-${possibleType}gradient`;
                                return true;
                            }
                            if (
                                value.slice(
                                    index - possibleType.length - 8,
                                    index - possibleType.length - 1
                                ) === "-webkit"
                            ) {
                                typeGradient = `-webkit-${possibleType}gradient`;
                                return true;
                            }
                            typeGradient = `${possibleType}gradient`;
                            return true;
                        }
                    }
                }
            );
            if (!typeGradient) {
                break;
            }
            const {start, end} = getParenthesesRange(
                value,
                index + gradientLength
            );
            const match = value.substring(start + 1, end - 1);
            startIndex = end + 1 + conicGradientLength;
            result.push({
                typeGradient,
                match,
                offset: typeGradient.length + 2,
                index: index - typeGradient.length + gradientLength,
                hasComma: true
            });
        }
        if (result.length) {
            result[result.length - 1].hasComma = false;
        }
        return result;
    }

    const STORAGE_KEY_IMAGE_DETAILS_LIST = "__darkreader__imageDetails_v2_list";
    const STORAGE_KEY_IMAGE_DETAILS_PREFIX = "__darkreader__imageDetails_v2_";
    const STORAGE_KEY_CSS_FETCH_PREFIX = "__darkreader__cssFetch_";
    let imageCacheTimeout = 0;
    const imageDetailsCacheQueue = new Map();
    const cachedImageUrls = [];
    function writeImageDetailsQueue() {
        imageDetailsCacheQueue.forEach((details, url) => {
            if (url && url.startsWith("https://")) {
                try {
                    const json = JSON.stringify(details);
                    sessionStorage.setItem(
                        `${STORAGE_KEY_IMAGE_DETAILS_PREFIX}${url}`,
                        json
                    );
                    cachedImageUrls.push(url);
                } catch (err) {}
            }
        });
        imageDetailsCacheQueue.clear();
        sessionStorage.setItem(
            STORAGE_KEY_IMAGE_DETAILS_LIST,
            JSON.stringify(cachedImageUrls)
        );
    }
    function writeImageDetailsCache(url, imageDetails) {
        if (!url || !url.startsWith("https://")) {
            return;
        }
        imageDetailsCacheQueue.set(url, imageDetails);
        clearTimeout(imageCacheTimeout);
        imageCacheTimeout = setTimeout(writeImageDetailsQueue, 1000);
    }
    function readImageDetailsCache(targetMap) {
        try {
            const jsonList = sessionStorage.getItem(
                STORAGE_KEY_IMAGE_DETAILS_LIST
            );
            if (!jsonList) {
                return;
            }
            const list = JSON.parse(jsonList);
            list.forEach((url) => {
                const json = sessionStorage.getItem(
                    `${STORAGE_KEY_IMAGE_DETAILS_PREFIX}${url}`
                );
                if (json) {
                    const details = JSON.parse(json);
                    targetMap.set(url, details);
                }
            });
        } catch (err) {}
    }
    function writeCSSFetchCache(url, cssText) {
        const key = `${STORAGE_KEY_CSS_FETCH_PREFIX}${url}`;
        try {
            sessionStorage.setItem(key, cssText);
        } catch (err) {}
    }
    function readCSSFetchCache(url) {
        const key = `${STORAGE_KEY_CSS_FETCH_PREFIX}${url}`;
        try {
            return sessionStorage.getItem(key) ?? null;
        } catch (err) {}
        return null;
    }

    function toSVGMatrix(matrix) {
        return matrix
            .slice(0, 4)
            .map((m) => m.map((m) => m.toFixed(3)).join(" "))
            .join(" ");
    }
    function getSVGFilterMatrixValue(config) {
        return toSVGMatrix(createFilterMatrix(config));
    }

    const MAX_FRAME_DURATION = 1000 / 60;
    class AsyncQueue {
        constructor() {
            this.queue = [];
            this.timerId = null;
        }
        addTask(task) {
            this.queue.push(task);
            this.scheduleFrame();
        }
        stop() {
            if (this.timerId !== null) {
                cancelAnimationFrame(this.timerId);
                this.timerId = null;
            }
            this.queue = [];
        }
        scheduleFrame() {
            if (this.timerId) {
                return;
            }
            this.timerId = requestAnimationFrame(() => {
                this.timerId = null;
                const start = Date.now();
                let cb;
                while ((cb = this.queue.shift())) {
                    cb();
                    if (Date.now() - start >= MAX_FRAME_DURATION) {
                        this.scheduleFrame();
                        break;
                    }
                }
            });
        }
    }

    const resolvers$1 = new Map();
    const rejectors = new Map();
    async function bgFetch(request) {
        if (window.DarkReader?.Plugins?.fetch) {
            return window.DarkReader.Plugins.fetch(request);
        }
        const parsedURL = new URL(request.url);
        if (
            parsedURL.origin !== request.origin &&
            shouldIgnoreCors(parsedURL)
        ) {
            throw new Error("Cross-origin limit reached");
        }
        return new Promise((resolve, reject) => {
            const id = generateUID();
            resolvers$1.set(id, resolve);
            rejectors.set(id, reject);
            chrome.runtime.sendMessage({
                type: MessageTypeCStoBG.FETCH,
                data: request,
                id
            });
        });
    }
    chrome.runtime.onMessage.addListener(({type, data, error, id}) => {
        if (type === MessageTypeBGtoCS.FETCH_RESPONSE) {
            const resolve = resolvers$1.get(id);
            const reject = rejectors.get(id);
            resolvers$1.delete(id);
            rejectors.delete(id);
            if (error) {
                reject &&
                    reject(
                        typeof error === "string" ? new Error(error) : error
                    );
            } else {
                resolve && resolve(data);
            }
        }
    });

    const imageManager = new AsyncQueue();
    async function getImageDetails(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let dataURL = url.startsWith("data:")
                    ? url
                    : await getDataURL(url);
                const blob =
                    tryConvertDataURLToBlobSync(dataURL) ??
                    (await loadAsBlob(url));
                let image;
                let useViewBox = false;
                if (dataURL.startsWith("data:image/svg+xml")) {
                    const commaIndex = dataURL.indexOf(",");
                    if (commaIndex >= 0) {
                        let svgText = dataURL.slice(commaIndex + 1);
                        const encoding = dataURL
                            .slice(0, commaIndex)
                            .split(";")[1];
                        if (encoding === "base64") {
                            if (svgText.includes("%")) {
                                svgText = decodeURIComponent(svgText);
                            }
                            svgText = atob(svgText);
                        } else if (svgText.startsWith("%3c")) {
                            svgText = decodeURIComponent(svgText);
                        }
                        if (svgText.startsWith("<svg ")) {
                            const closingIndex = svgText.indexOf(">");
                            const svgOpening = svgText
                                .slice(0, closingIndex + 1)
                                .toLocaleLowerCase();
                            if (
                                svgOpening.includes("viewbox=") &&
                                !svgOpening.includes("width=") &&
                                !svgOpening.includes("height=")
                            ) {
                                useViewBox = true;
                                const viewboxIndex =
                                    svgOpening.indexOf("viewbox=");
                                const quote = svgOpening[viewboxIndex + 8];
                                const viewboxCloseIndex = svgOpening.indexOf(
                                    quote,
                                    viewboxIndex + 9
                                );
                                const viewBox = svgOpening
                                    .slice(viewboxIndex + 9, viewboxCloseIndex)
                                    .split(" ")
                                    .map((x) => parseFloat(x));
                                if (
                                    viewBox.length === 4 &&
                                    !viewBox.some((x) => isNaN(x))
                                ) {
                                    const width = viewBox[2] - viewBox[0];
                                    const height = viewBox[3] - viewBox[1];
                                    dataURL = `data:image/svg+xml;base64,${btoa(`<svg width="${width}" height="${height}" ${svgText.slice(5)}`)}`;
                                }
                            }
                        }
                    }
                    image = await loadImage(dataURL);
                } else {
                    image =
                        (await tryCreateImageBitmap(blob)) ??
                        (await loadImage(dataURL));
                }
                imageManager.addTask(() => {
                    const analysis = analyzeImage(image);
                    resolve({
                        src: url,
                        dataURL: analysis.isLarge ? "" : dataURL,
                        width: image.width,
                        height: image.height,
                        useViewBox,
                        ...analysis
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    async function getDataURL(url) {
        const parsedURL = new URL(url);
        if (parsedURL.origin === location.origin) {
            return await loadAsDataURL(url);
        }
        return await bgFetch({
            url,
            responseType: "data-url",
            origin: location.origin
        });
    }
    async function tryCreateImageBitmap(blob) {
        try {
            return await createImageBitmap(blob);
        } catch (err) {
            logWarn(
                `Unable to create image bitmap for type ${blob.type}: ${String(err)}`
            );
            return null;
        }
    }
    const INCOMPLETE_DOC_LOADING_IMAGE_LIMIT = 256;
    let loadingImagesCount = 0;
    async function loadImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(`Unable to load image ${url}`);
            if (
                ++loadingImagesCount <= INCOMPLETE_DOC_LOADING_IMAGE_LIMIT ||
                isReadyStateComplete()
            ) {
                image.src = url;
            } else {
                addReadyStateCompleteListener(() => (image.src = url));
            }
        });
    }
    const MAX_ANALYSIS_PIXELS_COUNT = 32 * 32;
    let canvas;
    let context;
    function createCanvas() {
        const maxWidth = MAX_ANALYSIS_PIXELS_COUNT;
        const maxHeight = MAX_ANALYSIS_PIXELS_COUNT;
        canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        context = canvas.getContext("2d", {willReadFrequently: true});
        context.imageSmoothingEnabled = false;
    }
    function removeCanvas() {
        canvas = null;
        context = null;
    }
    const LARGE_IMAGE_PIXELS_COUNT = 512 * 512;
    function analyzeImage(image) {
        if (!canvas) {
            createCanvas();
        }
        let sw;
        let sh;
        if (image instanceof HTMLImageElement) {
            sw = image.naturalWidth;
            sh = image.naturalHeight;
        } else {
            sw = image.width;
            sh = image.height;
        }
        if (sw === 0 || sh === 0) {
            logWarn("Image is empty");
            return {
                isDark: false,
                isLight: false,
                isTransparent: false,
                isLarge: false,
                averageColor: null
            };
        }
        const isLarge = sw * sh > LARGE_IMAGE_PIXELS_COUNT;
        const sourcePixelsCount = sw * sh;
        const k = Math.min(
            1,
            Math.sqrt(MAX_ANALYSIS_PIXELS_COUNT / sourcePixelsCount)
        );
        const width = Math.ceil(sw * k);
        const height = Math.ceil(sh * k);
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, sw, sh, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const d = imageData.data;
        const TRANSPARENT_ALPHA_THRESHOLD = 0.05;
        const DARK_LIGHTNESS_THRESHOLD = 0.4;
        const LIGHT_LIGHTNESS_THRESHOLD = 0.7;
        let transparentPixelsCount = 0;
        let darkPixelsCount = 0;
        let lightPixelsCount = 0;
        let minLightness = 1;
        let maxLightness = 0;
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let sumA = 0;
        let i, x, y;
        let r, g, b, a;
        let l;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                i = 4 * (y * width + x);
                r = d[i + 0];
                g = d[i + 1];
                b = d[i + 2];
                a = d[i + 3];
                sumR += r;
                sumG += g;
                sumB += b;
                sumA += a;
                if (a / 255 < TRANSPARENT_ALPHA_THRESHOLD) {
                    transparentPixelsCount++;
                } else {
                    l = getSRGBLightness(r, g, b);
                    if (l < DARK_LIGHTNESS_THRESHOLD) {
                        darkPixelsCount++;
                    }
                    if (l > LIGHT_LIGHTNESS_THRESHOLD) {
                        lightPixelsCount++;
                    }
                    if (l < minLightness) {
                        minLightness = l;
                    }
                    if (l > maxLightness) {
                        maxLightness = l;
                    }
                }
            }
        }
        const totalPixelsCount = width * height;
        const opaquePixelsCount = totalPixelsCount - transparentPixelsCount;
        const DARK_IMAGE_THRESHOLD = 0.7;
        const LIGHT_IMAGE_THRESHOLD = 0.7;
        const TRANSPARENT_IMAGE_THRESHOLD = 0.1;
        const SOLID_LIGHTNESS_DIFF_THRESHOLD = 0.1;
        const isSolid =
            sumA === totalPixelsCount * 255 &&
            maxLightness - minLightness < SOLID_LIGHTNESS_DIFF_THRESHOLD;
        const solidColor = isSolid
            ? {
                  r: Math.round(sumR / opaquePixelsCount),
                  g: Math.round(sumG / opaquePixelsCount),
                  b: Math.round(sumB / opaquePixelsCount),
                  a: transparentPixelsCount / totalPixelsCount
              }
            : null;
        return {
            isDark: darkPixelsCount / opaquePixelsCount >= DARK_IMAGE_THRESHOLD,
            isLight:
                lightPixelsCount / opaquePixelsCount >= LIGHT_IMAGE_THRESHOLD,
            isTransparent:
                transparentPixelsCount / totalPixelsCount >=
                TRANSPARENT_IMAGE_THRESHOLD,
            isLarge,
            solidColor
        };
    }
    let isBlobURLSupported = null;
    let canUseProxy = false;
    let blobURLCheckRequested = false;
    const blobURLCheckAwaiters = [];
    document.addEventListener(
        "__darkreader__inlineScriptsAllowed",
        () => (canUseProxy = true),
        {once: true}
    );
    async function requestBlobURLCheck() {
        if (!canUseProxy) {
            return;
        }
        if (blobURLCheckRequested) {
            return await new Promise((resolve) =>
                blobURLCheckAwaiters.push(resolve)
            );
        }
        blobURLCheckRequested = true;
        await new Promise((resolve) => {
            document.addEventListener(
                "__darkreader__blobURLCheckResponse",
                (e) => {
                    isBlobURLSupported = e.detail.blobURLAllowed;
                    resolve();
                    blobURLCheckAwaiters.forEach((r) => r());
                    blobURLCheckAwaiters.splice(0);
                },
                {once: true}
            );
            document.dispatchEvent(
                new CustomEvent("__darkreader__blobURLCheckRequest")
            );
        });
    }
    function isBlobURLCheckResultReady() {
        return isBlobURLSupported != null || !canUseProxy;
    }
    function onCSPError(err) {
        if (err.blockedURI === "blob") {
            isBlobURLSupported = false;
            document.removeEventListener("securitypolicyviolation", onCSPError);
        }
    }
    document.addEventListener("securitypolicyviolation", onCSPError);
    const filteredImageURLs = new Map();
    function getFilteredImageURL(
        {dataURL, width, height, useViewBox, src},
        theme
    ) {
        if (dataURL.startsWith("data:image/svg+xml")) {
            dataURL = escapeXML(dataURL);
        }
        const matrix = getSVGFilterMatrixValue(theme);
        const size = useViewBox
            ? `viewBox="0 0 ${width} ${height}"`
            : `width="${width}" height="${height}"`;
        const svg = [
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${size}>`,
            "<defs>",
            '<filter id="darkreader-image-filter">',
            `<feColorMatrix type="matrix" values="${matrix}" />`,
            "</filter>",
            "</defs>",
            `<image width="${width}" height="${height}" filter="url(#darkreader-image-filter)" xlink:href="${dataURL}" />`,
            "</svg>"
        ].join("");
        if (!isBlobURLSupported) {
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        }
        const cached = filteredImageURLs.get(src);
        if (cached && cached.matrix === matrix) {
            return cached.url;
        }
        const bytes = new Uint8Array(svg.length);
        for (let i = 0; i < svg.length; i++) {
            bytes[i] = svg.charCodeAt(i);
        }
        const blob = new Blob([bytes], {type: "image/svg+xml"});
        const objectURL = URL.createObjectURL(blob);
        if (cached) {
            URL.revokeObjectURL(cached.url);
        }
        filteredImageURLs.set(src, {matrix, url: objectURL});
        return objectURL;
    }
    function getSolidColorImageURL({width, height, useViewBox}, color) {
        const size = useViewBox
            ? `viewBox="0 0 ${width} ${height}"`
            : `width="${width}" height="${height}"`;
        const svg = [
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${size}>`,
            `<rect width="100%" height="100%" fill="${escapeXML(color)}" />`,
            "</svg>"
        ].join("");
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    const xmlEscapeChars = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;"
    };
    function escapeXML(str) {
        return str.replace(/[<>&'"]/g, (c) => xmlEscapeChars[c] ?? c);
    }
    const dataURLBlobURLs = new Map();
    function tryConvertDataURLToBlobSync(dataURL) {
        const colonIndex = dataURL.indexOf(":");
        const semicolonIndex = dataURL.indexOf(";", colonIndex + 1);
        const commaIndex = dataURL.indexOf(",", semicolonIndex + 1);
        const encoding = dataURL
            .substring(semicolonIndex + 1, commaIndex)
            .toLocaleLowerCase();
        const mediaType = dataURL.substring(colonIndex + 1, semicolonIndex);
        if (encoding !== "base64" || !mediaType) {
            return null;
        }
        let base64Content = dataURL.substring(commaIndex + 1);
        if (base64Content.includes("%")) {
            base64Content = decodeURIComponent(base64Content);
        }
        const characters = atob(base64Content);
        const bytes = new Uint8Array(characters.length);
        for (let i = 0; i < characters.length; i++) {
            bytes[i] = characters.charCodeAt(i);
        }
        return new Blob([bytes], {type: mediaType});
    }
    async function tryConvertDataURLToBlobURL(dataURL) {
        if (!isBlobURLSupported) {
            return null;
        }
        const hash = getHashCode(dataURL);
        let blobURL = dataURLBlobURLs.get(hash);
        if (blobURL) {
            return blobURL;
        }
        let blob = tryConvertDataURLToBlobSync(dataURL);
        if (!blob) {
            const response = await fetch(dataURL);
            blob = await response.blob();
        }
        blobURL = URL.createObjectURL(blob);
        dataURLBlobURLs.set(hash, blobURL);
        return blobURL;
    }
    function cleanImageProcessingCache() {
        imageManager && imageManager.stop();
        removeCanvas();
        filteredImageURLs.forEach(({url}) => URL.revokeObjectURL(url));
        filteredImageURLs.clear();
        dataURLBlobURLs.forEach((u) => URL.revokeObjectURL(u));
        dataURLBlobURLs.clear();
    }

    function getPriority(ruleStyle, property) {
        return Boolean(ruleStyle && ruleStyle.getPropertyPriority(property));
    }
    function canFilterImage(url) {
        if (url.startsWith("data:")) {
            return true;
        }
        try {
            return new URL(url).origin === location.origin;
        } catch {
            return false;
        }
    }
    const bgPropsToCopy = [
        "background-clip",
        "background-position",
        "background-repeat",
        "background-size"
    ];
    function getModifiableCSSDeclaration(
        property,
        value,
        rule,
        variablesStore,
        ignoreImageSelectors,
        isCancelled
    ) {
        let modifier = null;
        if (property.startsWith("--")) {
            modifier = getVariableModifier(
                variablesStore,
                property,
                value,
                rule,
                ignoreImageSelectors,
                isCancelled
            );
        } else if (value.includes("var(")) {
            modifier = getVariableDependantModifier(
                variablesStore,
                property,
                value,
                rule
            );
        } else if (property === "color-scheme") {
            modifier = getColorSchemeModifier();
        } else if (property === "scrollbar-color") {
            modifier = getScrollbarColorModifier(value);
        } else if (
            (property.includes("color") &&
                property !== "-webkit-print-color-adjust") ||
            property === "fill" ||
            property === "stroke" ||
            property === "stop-color"
        ) {
            if (
                property.startsWith("border") &&
                property !== "border-color" &&
                (value === "initial" || value === "currentcolor")
            ) {
                const borderSideProp = property.substring(
                    0,
                    property.length - 6
                );
                const borderSideVal =
                    rule.style.getPropertyValue(borderSideProp);
                const borderStyleVal =
                    rule.style.getPropertyValue("border-style");
                if (
                    borderSideVal.startsWith("0px") ||
                    borderSideVal === "none" ||
                    borderStyleVal === "none"
                ) {
                    property = borderSideProp;
                    modifier = borderSideVal;
                } else {
                    modifier = value;
                }
            } else {
                modifier = getColorModifier(property, value, rule);
            }
        } else if (
            property === "background-image" ||
            property === "list-style-image"
        ) {
            const selectorText = rule.selectorText;
            const pushFilter = selectorText
                ? (type) => pushFilterSelector(selectorText, type)
                : null;
            modifier = getBgImageModifier(
                value,
                rule,
                ignoreImageSelectors,
                isCancelled,
                pushFilter
            );
        } else if (property.includes("shadow")) {
            modifier = getShadowModifier(value);
        } else if (bgPropsToCopy.includes(property) && value !== "initial") {
            modifier = value;
        }
        if (!modifier) {
            return null;
        }
        return {
            property,
            value: modifier,
            important: getPriority(rule.style, property),
            sourceValue: value
        };
    }
    function joinSelectors(...selectors) {
        return selectors.filter(Boolean).join(", ");
    }
    const hostsWithOddScrollbars = ["calendar.google.com"];
    function getModifiedUserAgentStyle(theme, isIFrame, styleSystemControls) {
        const lines = [];
        if (!isIFrame) {
            lines.push("html {");
            lines.push(
                `    background-color: ${modifyBackgroundColor({r: 255, g: 255, b: 255}, theme)} !important;`
            );
            lines.push("}");
        }
        if (isCSSColorSchemePropSupported && theme.mode === 1) {
            lines.push("html {");
            lines.push(`    color-scheme: dark !important;`);
            lines.push("}");
            lines.push("iframe {");
            lines.push(`    color-scheme: dark !important;`);
            lines.push("}");
        }
        const bgSelectors = joinSelectors(
            isIFrame ? "" : "html, body",
            styleSystemControls ? "input, textarea, select, button, dialog" : ""
        );
        if (bgSelectors) {
            lines.push(`${bgSelectors} {`);
            lines.push(
                `    background-color: ${modifyBackgroundColor({r: 255, g: 255, b: 255}, theme)};`
            );
            lines.push("}");
        }
        lines.push(
            `${joinSelectors("html, body", styleSystemControls ? "input, textarea, select, button" : "")} {`
        );
        lines.push(
            `    border-color: ${modifyBorderColor({r: 76, g: 76, b: 76}, theme)};`
        );
        lines.push(
            `    color: ${modifyForegroundColor({r: 0, g: 0, b: 0}, theme)};`
        );
        lines.push("}");
        lines.push("a {");
        lines.push(
            `    color: ${modifyForegroundColor({r: 0, g: 64, b: 255}, theme)};`
        );
        lines.push("}");
        lines.push("table {");
        lines.push(
            `    border-color: ${modifyBorderColor({r: 128, g: 128, b: 128}, theme)};`
        );
        lines.push("}");
        lines.push("mark {");
        lines.push(
            `    color: ${modifyForegroundColor({r: 0, g: 0, b: 0}, theme)};`
        );
        lines.push("}");
        lines.push("::placeholder {");
        lines.push(
            `    color: ${modifyForegroundColor({r: 169, g: 169, b: 169}, theme)};`
        );
        lines.push("}");
        lines.push("input:-webkit-autofill,");
        lines.push("textarea:-webkit-autofill,");
        lines.push("select:-webkit-autofill {");
        lines.push(
            `    background-color: ${modifyBackgroundColor({r: 250, g: 255, b: 189}, theme)} !important;`
        );
        lines.push(
            `    color: ${modifyForegroundColor({r: 0, g: 0, b: 0}, theme)} !important;`
        );
        lines.push("}");
        if (
            theme.scrollbarColor &&
            !hostsWithOddScrollbars.includes(location.hostname)
        ) {
            lines.push(getModifiedScrollbarStyle(theme));
        }
        if (theme.selectionColor) {
            lines.push(getModifiedSelectionStyle(theme));
        }
        if (isLayerRuleSupported) {
            lines.unshift("@layer {");
            lines.push("}");
        }
        return lines.join("\n");
    }
    function getSelectionColor(theme) {
        let backgroundColorSelection;
        let foregroundColorSelection;
        if (theme.selectionColor === "auto") {
            backgroundColorSelection = modifyBackgroundColor(
                {r: 0, g: 96, b: 212},
                {...theme, grayscale: 0}
            );
            foregroundColorSelection = modifyForegroundColor(
                {r: 255, g: 255, b: 255},
                {...theme, grayscale: 0}
            );
        } else {
            const rgb = parseColorWithCache(theme.selectionColor);
            const hsl = rgbToHSL(rgb);
            backgroundColorSelection = theme.selectionColor;
            if (hsl.l < 0.5) {
                foregroundColorSelection = "#FFF";
            } else {
                foregroundColorSelection = "#000";
            }
        }
        return {backgroundColorSelection, foregroundColorSelection};
    }
    function getModifiedSelectionStyle(theme) {
        const lines = [];
        const modifiedSelectionColor = getSelectionColor(theme);
        const backgroundColorSelection =
            modifiedSelectionColor.backgroundColorSelection;
        const foregroundColorSelection =
            modifiedSelectionColor.foregroundColorSelection;
        ["::selection", "::-moz-selection"].forEach((selection) => {
            lines.push(`${selection} {`);
            lines.push(
                `    background-color: ${backgroundColorSelection} !important;`
            );
            lines.push(`    color: ${foregroundColorSelection} !important;`);
            lines.push("}");
        });
        return lines.join("\n");
    }
    function getModifiedScrollbarStyle(theme) {
        let colorTrack;
        let colorThumb;
        if (theme.scrollbarColor === "auto") {
            colorTrack = modifyBackgroundColor({r: 241, g: 241, b: 241}, theme);
            colorThumb = modifyBackgroundColor({r: 176, g: 176, b: 176}, theme);
        } else {
            const rgb = parseColorWithCache(theme.scrollbarColor);
            const hsl = rgbToHSL(rgb);
            const darken = (darker) => ({
                ...hsl,
                l: clamp(hsl.l - darker, 0, 1)
            });
            colorTrack = hslToString(darken(0.4));
            colorThumb = hslToString(hsl);
        }
        return [
            `* {`,
            `    scrollbar-color: ${colorThumb} ${colorTrack};`,
            `}`
        ].join("\n");
    }
    function getModifiedFallbackStyle(theme, {strict}) {
        const factory = defaultFallbackFactory;
        return factory(theme, {strict});
    }
    function defaultFallbackFactory(theme, {strict}) {
        const lines = [];
        lines.push(
            `html, body, ${strict ? "body :not(iframe)" : "body > :not(iframe)"} {`
        );
        lines.push(
            `    background-color: ${modifyBackgroundColor({r: 255, g: 255, b: 255}, theme)} !important;`
        );
        lines.push(
            `    border-color: ${modifyBorderColor({r: 64, g: 64, b: 64}, theme)} !important;`
        );
        lines.push(
            `    color: ${modifyForegroundColor({r: 0, g: 0, b: 0}, theme)} !important;`
        );
        lines.push("}");
        lines.push(`div[style*="background-color: rgb(135, 135, 135)"] {`);
        lines.push(`    background-color: #878787 !important;`);
        lines.push("}");
        return lines.join("\n");
    }
    let addFilterSelector$1 = null;
    function setFilterSelectorHandler(fn) {
        addFilterSelector$1 = fn;
    }
    function pushFilterSelector(selector, type) {
        if (selector && addFilterSelector$1) {
            addFilterSelector$1(selector, type);
        }
    }
    const filterCompatibleProps = new Set([
        "background",
        "background-image",
        "list-style-image"
    ]);
    function isFilterCompatibleProp(property) {
        return filterCompatibleProps.has(property);
    }
    const unparsableColors = new Set([
        "inherit",
        "transparent",
        "initial",
        "currentcolor",
        "none",
        "unset",
        "auto"
    ]);
    function getColorModifier(prop, value, rule) {
        if (
            unparsableColors.has(value.toLowerCase()) &&
            !(prop === "color" && value === "initial")
        ) {
            return value;
        }
        let rgb = null;
        if (prop === "color" && value === "initial") {
            rgb = {r: 0, g: 0, b: 0, a: 1};
        } else {
            rgb = parseColorWithCache(value);
        }
        if (!rgb) {
            logWarn("Couldn't parse color", value);
            return null;
        }
        if (prop.includes("background")) {
            const maskImageValue = rule.style.maskImage ?? rule.style.mask;
            if (
                maskImageValue &&
                !maskImageValue.startsWith("none") &&
                !maskImageValue.startsWith("linear-gradient")
            ) {
                return (theme) => modifyForegroundColor(rgb, theme);
            }
            return (theme) => modifyBackgroundColor(rgb, theme);
        }
        if (prop.includes("border") || prop.includes("outline")) {
            return (theme) => modifyBorderColor(rgb, theme);
        }
        return (theme) => modifyForegroundColor(rgb, theme);
    }
    const imageDetailsCache = new Map();
    const awaitingForImageLoading = new Map();
    let didTryLoadCache = false;
    function shouldIgnoreImage(selectorText, selectors) {
        if (!selectorText || selectors.length === 0) {
            return false;
        }
        if (selectors.some((s) => s === "*")) {
            return true;
        }
        const ruleSelectors = selectorText.split(/,\s*/g);
        for (let i = 0; i < selectors.length; i++) {
            const ignoredSelector = selectors[i];
            if (ignoredSelector.startsWith("^")) {
                const beginning = ignoredSelector.slice(1);
                if (ruleSelectors.some((s) => s.startsWith(beginning))) {
                    return true;
                }
            } else if (ignoredSelector.endsWith("$")) {
                const ending = ignoredSelector.slice(
                    0,
                    ignoredSelector.length - 1
                );
                if (ruleSelectors.some((s) => s.endsWith(ending))) {
                    return true;
                }
            } else if (ruleSelectors.some((s) => s === ignoredSelector)) {
                return true;
            }
        }
        return false;
    }
    const imageSelectorQueue = new Map();
    const imageSelectorNodeQueue = new Set();
    let imageSelectorQueueFrameId = null;
    let classObserver = null;
    function checkImageSelectors(node) {
        for (const [selector, callbacks] of imageSelectorQueue) {
            if (
                node.querySelector(selector) ||
                (node instanceof Element && node.matches(selector))
            ) {
                imageSelectorQueue.delete(selector);
                callbacks.forEach((cb) => cb());
            }
        }
        if (imageSelectorQueue.size === 0) {
            classObserver?.disconnect();
            classObserver = null;
            return;
        }
        if (!classObserver) {
            classObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    imageSelectorNodeQueue.add(mutation.target);
                    if (!imageSelectorQueueFrameId) {
                        imageSelectorQueueFrameId = requestAnimationFrame(
                            () => {
                                imageSelectorNodeQueue.forEach((element) => {
                                    checkImageSelectors(element);
                                });
                                imageSelectorNodeQueue.clear();
                                imageSelectorQueueFrameId = null;
                            }
                        );
                    }
                });
            });
            classObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
                subtree: true
            });
        }
    }
    function getBgImageModifier(
        value,
        rule,
        ignoreImageSelectors,
        isCancelled,
        pushFilter = null
    ) {
        try {
            if (shouldIgnoreImage(rule.selectorText, ignoreImageSelectors)) {
                return value;
            }
            const gradients = parseGradient(value);
            const urls = getMatches(cssURLRegex, value);
            if (urls.length === 0 && gradients.length === 0) {
                return value;
            }
            const getIndices = (matches) => {
                let index = 0;
                return matches.map((match) => {
                    const valueIndex = value.indexOf(match, index);
                    index = valueIndex + match.length;
                    return {match, index: valueIndex};
                });
            };
            const matches = gradients
                .map((i) => ({type: "gradient", ...i}))
                .concat(
                    getIndices(urls).map((i) => ({
                        type: "url",
                        offset: 0,
                        ...i
                    }))
                )
                .sort((a, b) => (a.index > b.index ? 1 : -1));
            const getGradientModifier = (gradient) => {
                const {typeGradient, match, hasComma} = gradient;
                const partsRegex =
                    /([^\(\),]+(\([^\(\)]*(\([^\(\)]*\)*[^\(\)]*)?\))?([^\(\), ]|( (?!calc)))*),?/g;
                const colorStopRegex =
                    /^(from|color-stop|to)\(([^\(\)]*?,\s*)?(.*?)\)$/;
                const parts = getMatches(partsRegex, match, 1).map((part) => {
                    part = part.trim();
                    let rgb = parseColorWithCache(part);
                    if (rgb) {
                        return (theme) => modifyGradientColor(rgb, theme);
                    }
                    const space = part.lastIndexOf(" ");
                    rgb = parseColorWithCache(part.substring(0, space));
                    if (rgb) {
                        return (theme) =>
                            `${modifyGradientColor(rgb, theme)} ${part.substring(space + 1)}`;
                    }
                    const colorStopMatch = part.match(colorStopRegex);
                    if (colorStopMatch) {
                        rgb = parseColorWithCache(colorStopMatch[3]);
                        if (rgb) {
                            return (theme) =>
                                `${colorStopMatch[1]}(${colorStopMatch[2] ? `${colorStopMatch[2]}, ` : ""}${modifyGradientColor(rgb, theme)})`;
                        }
                    }
                    return () => part;
                });
                return (theme) => {
                    return `${typeGradient}(${parts.map((modify) => modify(theme)).join(", ")})${hasComma ? ", " : ""}`;
                };
            };
            const getURLModifier = (urlValue) => {
                if (!didTryLoadCache) {
                    didTryLoadCache = true;
                    readImageDetailsCache(imageDetailsCache);
                }
                let url = getCSSURLValue(urlValue);
                const isURLEmpty = url.length === 0;
                const {parentStyleSheet} = rule;
                const ownerNode = parentStyleSheet?.ownerNode;
                const scope =
                    (parentStyleSheet && getSheetScope(parentStyleSheet)) ??
                    document;
                const baseURL =
                    parentStyleSheet && parentStyleSheet.href
                        ? getCSSBaseBath(parentStyleSheet.href)
                        : ownerNode?.baseURI || location.origin;
                url = getAbsoluteURL(baseURL, url);
                return async (theme) => {
                    if (isURLEmpty) {
                        return "url('')";
                    }
                    let selector = rule.selectorText;
                    if (selector) {
                        if (selector.includes("::before")) {
                            selector = selector.replaceAll("::before", "");
                        }
                        if (selector.includes("::after")) {
                            selector = selector.replaceAll("::after", "");
                        }
                        if (!scope.querySelector(selector)) {
                            await new Promise((resolve) => {
                                if (imageSelectorQueue.has(selector)) {
                                    imageSelectorQueue
                                        .get(selector)
                                        .push(resolve);
                                } else {
                                    imageSelectorQueue.set(selector, [resolve]);
                                }
                            });
                        }
                    }
                    let imageDetails = null;
                    if (imageDetailsCache.has(url)) {
                        imageDetails = imageDetailsCache.get(url);
                    } else {
                        try {
                            if (!isBlobURLCheckResultReady()) {
                                await requestBlobURLCheck();
                            }
                            if (awaitingForImageLoading.has(url)) {
                                const awaiters =
                                    awaitingForImageLoading.get(url);
                                imageDetails = await new Promise((resolve) =>
                                    awaiters.push(resolve)
                                );
                                if (!imageDetails) {
                                    return null;
                                }
                            } else {
                                awaitingForImageLoading.set(url, []);
                                imageDetails = await getImageDetails(url);
                                imageDetailsCache.set(url, imageDetails);
                                if (!url.startsWith("data:")) {
                                    const parsedURL = new URL(url);
                                    if (parsedURL.origin === location.origin) {
                                        writeImageDetailsCache(
                                            url,
                                            imageDetails
                                        );
                                    }
                                }
                                awaitingForImageLoading
                                    .get(url)
                                    .forEach((resolve) =>
                                        resolve(imageDetails)
                                    );
                                awaitingForImageLoading.delete(url);
                            }
                            if (isCancelled()) {
                                return null;
                            }
                        } catch (err) {
                            logWarn(err);
                            if (awaitingForImageLoading.has(url)) {
                                awaitingForImageLoading
                                    .get(url)
                                    .forEach((resolve) => resolve(null));
                                awaitingForImageLoading.delete(url);
                            }
                        }
                    }
                    if (imageDetails) {
                        const bgImageValue = getBgImageValue(
                            imageDetails,
                            theme
                        );
                        if (bgImageValue) {
                            return bgImageValue;
                        }
                    }
                    if (url.startsWith("data:")) {
                        const blobURL = await tryConvertDataURLToBlobURL(url);
                        if (blobURL) {
                            return `url("${blobURL}")`;
                        }
                    }
                    return `url("${url}")`;
                };
            };
            const isSafeToInvert = () => {
                const repeat = (
                    rule.style.backgroundRepeat || ""
                ).toLowerCase();
                const size = (rule.style.backgroundSize || "").toLowerCase();
                const isTiled =
                    repeat.length > 0 &&
                    repeat !== "no-repeat" &&
                    !repeat.includes("no-repeat");
                const isStretched =
                    size.includes("cover") ||
                    size.includes("contain") ||
                    size.includes("100%");
                return !isTiled && !isStretched;
            };
            const getBgImageValue = (imageDetails, theme) => {
                const {
                    isDark,
                    isLight,
                    isTransparent,
                    isLarge,
                    solidColor,
                    width
                } = imageDetails;
                let result = null;
                const logSrc = imageDetails.src.startsWith("data:")
                    ? "data:"
                    : imageDetails.src;
                if (isLarge && isLight && !isTransparent && theme.mode === 1) {
                    logInfo(`Hiding large light image ${logSrc}`);
                    result = "none";
                } else if (
                    isDark &&
                    isTransparent &&
                    theme.mode === 1 &&
                    width > 2
                ) {
                    logInfo(`Inverting dark image ${logSrc}`);
                    if (canFilterImage(imageDetails.src)) {
                        const inverted = getFilteredImageURL(imageDetails, {
                            ...theme,
                            sepia: clamp(theme.sepia + 10, 0, 100)
                        });
                        result = `url("${inverted}")`;
                    } else if (isSafeToInvert()) {
                        pushFilter?.("invert");
                    }
                } else if (isLight && !isTransparent && theme.mode === 1) {
                    if (solidColor) {
                        logInfo(`Replacing image with a solid color ${logSrc}`);
                        const darkColor = modifyBackgroundColor(
                            solidColor,
                            theme,
                            false
                        );
                        const solid = getSolidColorImageURL(
                            imageDetails,
                            darkColor
                        );
                        result = `url("${solid}")`;
                    } else if (canFilterImage(imageDetails.src)) {
                        logInfo(`Inverting light image ${logSrc}`);
                        const inverted = getFilteredImageURL(
                            imageDetails,
                            theme
                        );
                        result = `url("${inverted}")`;
                    } else if (isSafeToInvert()) {
                        pushFilter?.("invert");
                    }
                } else if (
                    theme.mode === 0 &&
                    isLight &&
                    imageDetails.dataURL
                ) {
                    logInfo(`Applying filter to image ${logSrc}`);
                    if (canFilterImage(imageDetails.src)) {
                        const filtered = getFilteredImageURL(imageDetails, {
                            ...theme,
                            brightness: clamp(theme.brightness - 10, 5, 200),
                            sepia: clamp(theme.sepia + 10, 0, 100)
                        });
                        result = `url("${filtered}")`;
                    } else {
                        pushFilter?.("dim");
                    }
                } else {
                    if (theme.mode === 1 && !canFilterImage(imageDetails.src)) {
                        pushFilter?.("none");
                    }
                    logInfo(`Not modifying the image ${logSrc}`);
                }
                return result;
            };
            const modifiers = [];
            let matchIndex = 0;
            let prevHasComma = false;
            matches.forEach(
                ({type, match, index, typeGradient, hasComma, offset}, i) => {
                    const matchStart = index;
                    const prefixStart = matchIndex;
                    const matchEnd = matchStart + match.length + offset;
                    matchIndex = matchEnd;
                    if (prefixStart !== matchStart) {
                        if (prevHasComma) {
                            modifiers.push(() => {
                                let betweenValue = value.substring(
                                    prefixStart,
                                    matchStart
                                );
                                if (betweenValue[0] === ",") {
                                    betweenValue = betweenValue.substring(1);
                                }
                                return betweenValue;
                            });
                        } else {
                            modifiers.push(() =>
                                value.substring(prefixStart, matchStart)
                            );
                        }
                    }
                    prevHasComma = hasComma || false;
                    if (type === "url") {
                        modifiers.push(getURLModifier(match));
                    } else if (type === "gradient") {
                        modifiers.push(
                            getGradientModifier({
                                match,
                                index,
                                typeGradient: typeGradient,
                                hasComma: hasComma || false,
                                offset
                            })
                        );
                    }
                    if (i === matches.length - 1) {
                        modifiers.push(() => value.substring(matchEnd));
                    }
                }
            );
            return (theme) => {
                const results = modifiers
                    .filter(Boolean)
                    .map((modify) => modify(theme));
                if (results.some((r) => r instanceof Promise)) {
                    return Promise.all(results).then((asyncResults) => {
                        return asyncResults.filter(Boolean).join("");
                    });
                }
                const combinedResult = results.join("");
                if (combinedResult.endsWith(", initial")) {
                    return combinedResult.slice(0, -9);
                }
                return combinedResult;
            };
        } catch (err) {
            logWarn(`Unable to parse gradient ${value}`, err);
            return null;
        }
    }
    function getShadowModifierWithInfo(value) {
        try {
            let index = 0;
            const colorMatches = getMatches(
                /(^|\s)(?!calc)([a-z]+\(.+?\)|#[0-9a-f]+|[a-z]+)(.*?(inset|outset)?($|,))/gi,
                value,
                2
            );
            let notParsed = 0;
            const modifiers = colorMatches.map((match, i) => {
                const prefixIndex = index;
                const matchIndex = value.indexOf(match, index);
                const matchEnd = matchIndex + match.length;
                index = matchEnd;
                const rgb = parseColorWithCache(match);
                if (!rgb) {
                    notParsed++;
                    return () => value.substring(prefixIndex, matchEnd);
                }
                return (theme) =>
                    `${value.substring(prefixIndex, matchIndex)}${modifyShadowColor(rgb, theme)}${i === colorMatches.length - 1 ? value.substring(matchEnd) : ""}`;
            });
            return (theme) => {
                const modified = modifiers
                    .map((modify) => modify(theme))
                    .join("");
                return {
                    matchesLength: colorMatches.length,
                    unparsableMatchesLength: notParsed,
                    result: modified
                };
            };
        } catch (err) {
            logWarn(`Unable to parse shadow ${value}`, err);
            return null;
        }
    }
    function getShadowModifier(value) {
        const shadowModifier = getShadowModifierWithInfo(value);
        if (!shadowModifier) {
            return null;
        }
        return (theme) => shadowModifier(theme).result;
    }
    function getScrollbarColorModifier(value) {
        const colorsMatch = value.match(
            /^\s*([a-z]+(\(.*\))?)\s+([a-z]+(\(.*\))?)\s*$/
        );
        if (!colorsMatch) {
            return value;
        }
        const thumb = parseColorWithCache(colorsMatch[1]);
        const track = parseColorWithCache(colorsMatch[3]);
        if (!thumb || !track) {
            logWarn(
                "Couldn't parse color",
                ...[thumb, track].filter((c) => !c)
            );
            return null;
        }
        return (theme) =>
            `${modifyForegroundColor(thumb, theme)} ${modifyBackgroundColor(track, theme)}`;
    }
    function getColorSchemeModifier() {
        return (theme) => (theme.mode === 0 ? "dark light" : "dark");
    }
    function getVariableModifier(
        variablesStore,
        prop,
        value,
        rule,
        ignoredImgSelectors,
        isCancelled
    ) {
        return variablesStore.getModifierForVariable({
            varName: prop,
            sourceValue: value,
            rule,
            ignoredImgSelectors,
            isCancelled
        });
    }
    function getVariableDependantModifier(variablesStore, prop, value, rule) {
        return variablesStore.getModifierForVarDependant(prop, value, rule);
    }
    function cleanModificationCache() {
        clearColorModificationCache();
        imageDetailsCache.clear();
        cleanImageProcessingCache();
        awaitingForImageLoading.clear();
        imageSelectorQueue.clear();
        classObserver?.disconnect();
        classObserver = null;
    }

    const VAR_TYPE_BG_COLOR = 1 << 0;
    const VAR_TYPE_TEXT_COLOR = 1 << 1;
    const VAR_TYPE_BORDER_COLOR = 1 << 2;
    const VAR_TYPE_BG_IMG = 1 << 3;
    const shouldSetDefaultColor =
        !location.hostname.startsWith("www.ebay.") &&
        !location.hostname.includes(".ebay.");
    class VariablesStore {
        constructor() {
            this.varTypes = new Map();
            this.rulesQueue = new Set();
            this.inlineStyleQueue = [];
            this.definedVars = new Set();
            this.varRefs = new Map();
            this.unknownColorVars = new Set();
            this.unknownBgVars = new Set();
            this.undefinedVars = new Set();
            this.initialVarTypes = new Map();
            this.changedTypeVars = new Set();
            this.typeChangeSubscriptions = new Map();
            this.unstableVarValues = new Map();
            this.varFilterTypes = new Map();
            this.notifyingVarFilterTypes = new Set();
            this.varsChanged = false;
        }
        clear() {
            this.varTypes.clear();
            this.rulesQueue.clear();
            this.inlineStyleQueue.splice(0);
            this.definedVars.clear();
            this.varRefs.clear();
            this.unknownColorVars.clear();
            this.unknownBgVars.clear();
            this.undefinedVars.clear();
            this.initialVarTypes.clear();
            this.changedTypeVars.clear();
            this.typeChangeSubscriptions.clear();
            this.unstableVarValues.clear();
            this.varFilterTypes.clear();
            this.notifyingVarFilterTypes.clear();
        }
        isVarType(varName, typeNum) {
            return (
                this.varTypes.has(varName) &&
                (this.varTypes.get(varName) & typeNum) > 0
            );
        }
        addRulesForMatching(rules) {
            this.rulesQueue.add(rules);
        }
        addInlineStyleForMatching(style) {
            this.inlineStyleQueue.push(style);
        }
        matchVariablesAndDependents() {
            if (
                this.rulesQueue.size === 0 &&
                this.inlineStyleQueue.length === 0
            ) {
                return;
            }
            this.changedTypeVars.clear();
            this.initialVarTypes = new Map(this.varTypes);
            this.varsChanged = false;
            this.collectRootVariables();
            this.collectVariablesAndVarDep();
            this.collectRootVarDependents();
            if (!this.varsChanged) {
                return;
            }
            this.varRefs.forEach((refs, v) => {
                refs.forEach((r) => {
                    if (this.varTypes.has(v)) {
                        this.resolveVariableType(r, this.varTypes.get(v));
                    }
                });
            });
            this.unknownColorVars.forEach((v) => {
                if (this.unknownBgVars.has(v)) {
                    this.unknownColorVars.delete(v);
                    this.unknownBgVars.delete(v);
                    this.resolveVariableType(v, VAR_TYPE_BG_COLOR);
                } else if (
                    this.isVarType(
                        v,
                        VAR_TYPE_BG_COLOR |
                            VAR_TYPE_TEXT_COLOR |
                            VAR_TYPE_BORDER_COLOR
                    )
                ) {
                    this.unknownColorVars.delete(v);
                } else {
                    this.undefinedVars.add(v);
                }
            });
            this.unknownBgVars.forEach((v) => {
                const hasColor =
                    this.findVarRef(v, (ref) => {
                        return (
                            this.unknownColorVars.has(ref) ||
                            this.isVarType(
                                ref,
                                VAR_TYPE_BG_COLOR |
                                    VAR_TYPE_TEXT_COLOR |
                                    VAR_TYPE_BORDER_COLOR
                            )
                        );
                    }) != null;
                if (hasColor) {
                    this.iterateVarRefs(v, (ref) => {
                        this.resolveVariableType(ref, VAR_TYPE_BG_COLOR);
                    });
                } else if (
                    this.isVarType(v, VAR_TYPE_BG_COLOR | VAR_TYPE_BG_IMG)
                ) {
                    this.unknownBgVars.delete(v);
                } else {
                    this.undefinedVars.add(v);
                }
            });
            this.changedTypeVars.forEach((varName) => {
                if (this.typeChangeSubscriptions.has(varName)) {
                    this.typeChangeSubscriptions
                        .get(varName)
                        .forEach((callback) => {
                            callback();
                        });
                }
            });
            this.changedTypeVars.clear();
        }
        getModifierForVariable(options) {
            return (theme) => {
                const {
                    varName,
                    sourceValue,
                    rule,
                    ignoredImgSelectors,
                    isCancelled
                } = options;
                const getDeclarations = () => {
                    const declarations = [];
                    const addModifiedValue = (
                        typeNum,
                        varNameWrapper,
                        colorModifier
                    ) => {
                        if (!this.isVarType(varName, typeNum)) {
                            return;
                        }
                        const property = varNameWrapper(varName);
                        let modifiedValue;
                        if (isVarDependant(sourceValue)) {
                            if (isConstructedColorVar(sourceValue)) {
                                let value = insertVarValues(
                                    sourceValue,
                                    this.unstableVarValues
                                );
                                if (!value) {
                                    value =
                                        typeNum === VAR_TYPE_BG_COLOR
                                            ? "#ffffff"
                                            : "#000000";
                                }
                                modifiedValue = colorModifier(value, theme);
                            } else {
                                modifiedValue = replaceCSSVariablesNames(
                                    sourceValue,
                                    (v) => varNameWrapper(v),
                                    (fallback) => colorModifier(fallback, theme)
                                );
                            }
                        } else {
                            modifiedValue = colorModifier(sourceValue, theme);
                        }
                        declarations.push({
                            property,
                            value: modifiedValue
                        });
                    };
                    addModifiedValue(
                        VAR_TYPE_BG_COLOR,
                        wrapBgColorVariableName,
                        tryModifyBgColor
                    );
                    addModifiedValue(
                        VAR_TYPE_TEXT_COLOR,
                        wrapTextColorVariableName,
                        tryModifyTextColor
                    );
                    addModifiedValue(
                        VAR_TYPE_BORDER_COLOR,
                        wrapBorderColorVariableName,
                        tryModifyBorderColor
                    );
                    if (this.isVarType(varName, VAR_TYPE_BG_IMG)) {
                        const property = wrapBgImgVariableName(varName);
                        let modifiedValue = sourceValue;
                        if (isVarDependant(sourceValue)) {
                            modifiedValue = replaceCSSVariablesNames(
                                sourceValue,
                                (v) => wrapBgColorVariableName(v),
                                (fallback) => tryModifyBgColor(fallback, theme)
                            );
                        }
                        const pushFilter = rule.selectorText
                            ? (type) => this.setVarFilterType(varName, type)
                            : null;
                        const bgModifier = getBgImageModifier(
                            modifiedValue,
                            rule,
                            ignoredImgSelectors,
                            isCancelled,
                            pushFilter
                        );
                        modifiedValue =
                            typeof bgModifier === "function"
                                ? bgModifier(theme)
                                : bgModifier;
                        declarations.push({
                            property,
                            value: modifiedValue
                        });
                    }
                    return declarations;
                };
                const callbacks = new Set();
                const addListener = (onTypeChange) => {
                    if (!rule.selectorText) {
                        return;
                    }
                    const callback = () => {
                        const decs = getDeclarations();
                        onTypeChange(decs);
                    };
                    callbacks.add(callback);
                    this.subscribeForVarTypeChange(varName, callback);
                };
                const removeListeners = () => {
                    callbacks.forEach((callback) => {
                        this.unsubscribeFromVariableTypeChanges(
                            varName,
                            callback
                        );
                    });
                };
                return {
                    declarations: getDeclarations(),
                    onTypeChange: {addListener, removeListeners}
                };
            };
        }
        getModifierForVarDependant(property, sourceValue, rule) {
            if (rule && rule.selectorText && isFilterCompatibleProp(property)) {
                this.watchFilterVars(sourceValue, rule.selectorText);
            }
            const isConstructedColor = sourceValue.match(/^\s*(rgb|hsl)a?\(/);
            const isSimpleConstructedColor = sourceValue.match(
                /^rgba?\(var\(--[\-_A-Za-z0-9]+\)(\s*,?\/?\s*0?\.\d+)?\)$/
            );
            if (isConstructedColor && !isSimpleConstructedColor) {
                const isBg = property.startsWith("background");
                const isText = isTextColorProperty(property);
                return (theme) => {
                    let value = insertVarValues(
                        sourceValue,
                        this.unstableVarValues
                    );
                    if (!value) {
                        value = isBg ? "#ffffff" : "#000000";
                    }
                    const modifier = isBg
                        ? tryModifyBgColor
                        : isText
                          ? tryModifyTextColor
                          : tryModifyBorderColor;
                    return modifier(value, theme);
                };
            }
            if (
                property === "background-color" ||
                (isSimpleConstructedColor && property === "background")
            ) {
                return (theme) => {
                    const defaultFallback = shouldSetDefaultColor
                        ? tryModifyBgColor(
                              isConstructedColor ? "255, 255, 255" : "#ffffff",
                              theme
                          )
                        : "transparent";
                    return replaceCSSVariablesNames(
                        sourceValue,
                        (v) => wrapBgColorVariableName(v),
                        (fallback) => tryModifyBgColor(fallback, theme),
                        defaultFallback
                    );
                };
            }
            if (isTextColorProperty(property)) {
                return (theme) => {
                    const defaultFallback = tryModifyTextColor(
                        isConstructedColor ? "0, 0, 0" : "#000000",
                        theme
                    );
                    return replaceCSSVariablesNames(
                        sourceValue,
                        (v) => wrapTextColorVariableName(v),
                        (fallback) => tryModifyTextColor(fallback, theme),
                        defaultFallback
                    );
                };
            }
            if (
                property === "background" ||
                property === "background-image" ||
                property === "box-shadow"
            ) {
                return (theme) => {
                    const unknownVars = new Set();
                    const modify = () => {
                        const variableReplaced = replaceCSSVariablesNames(
                            sourceValue,
                            (v) => {
                                if (this.isVarType(v, VAR_TYPE_BG_COLOR)) {
                                    return wrapBgColorVariableName(v);
                                }
                                if (this.isVarType(v, VAR_TYPE_BG_IMG)) {
                                    return wrapBgImgVariableName(v);
                                }
                                unknownVars.add(v);
                                return v;
                            },
                            (fallback) => tryModifyBgColor(fallback, theme)
                        );
                        if (property === "box-shadow") {
                            const shadowModifier =
                                getShadowModifierWithInfo(variableReplaced);
                            const modifiedShadow = shadowModifier(theme);
                            if (
                                modifiedShadow.unparsableMatchesLength !==
                                modifiedShadow.matchesLength
                            ) {
                                return modifiedShadow.result;
                            }
                        }
                        return variableReplaced;
                    };
                    const modified = modify();
                    if (unknownVars.size > 0) {
                        if (isFallbackResolved(modified)) {
                            return modified;
                        }
                        return new Promise((resolve) => {
                            for (const unknownVar of unknownVars.values()) {
                                const callback = () => {
                                    this.unsubscribeFromVariableTypeChanges(
                                        unknownVar,
                                        callback
                                    );
                                    const newValue = modify();
                                    resolve(newValue);
                                };
                                this.subscribeForVarTypeChange(
                                    unknownVar,
                                    callback
                                );
                            }
                        });
                    }
                    return modified;
                };
            }
            if (
                property.startsWith("border") ||
                property.startsWith("outline")
            ) {
                return (theme) => {
                    return replaceCSSVariablesNames(
                        sourceValue,
                        (v) => wrapBorderColorVariableName(v),
                        (fallback) => tryModifyBorderColor(fallback, theme)
                    );
                };
            }
            return null;
        }
        subscribeForVarTypeChange(varName, callback) {
            if (!this.typeChangeSubscriptions.has(varName)) {
                this.typeChangeSubscriptions.set(varName, new Set());
            }
            const rootStore = this.typeChangeSubscriptions.get(varName);
            if (!rootStore.has(callback)) {
                rootStore.add(callback);
            }
        }
        unsubscribeFromVariableTypeChanges(varName, callback) {
            if (this.typeChangeSubscriptions.has(varName)) {
                this.typeChangeSubscriptions.get(varName).delete(callback);
            }
        }
        setVarFilterType(varName, type) {
            if (this.varFilterTypes.get(varName) === type) {
                return;
            }
            this.varFilterTypes.set(varName, type);
            if (this.notifyingVarFilterTypes.has(varName)) {
                return;
            }
            const subs = this.typeChangeSubscriptions.get(varName);
            if (subs && subs.size > 0) {
                this.notifyingVarFilterTypes.add(varName);
                subs.forEach((callback) => callback());
                this.notifyingVarFilterTypes.delete(varName);
            }
        }
        pushFilterSelectorsForValue(sourceValue, selector) {
            const directRefs = new Set();
            iterateVarDependencies(sourceValue, (v) => directRefs.add(v));
            const allRefs = new Set();
            directRefs.forEach((v) => {
                allRefs.add(v);
                this.iterateVarRefs(v, (ref) => allRefs.add(ref));
            });
            allRefs.forEach((v) => {
                const type = this.varFilterTypes.get(v);
                if (type) {
                    pushFilterSelector(selector, type);
                }
            });
        }
        watchFilterVars(sourceValue, selector) {
            const directRefs = new Set();
            iterateVarDependencies(sourceValue, (v) => directRefs.add(v));
            const allRefs = new Set();
            directRefs.forEach((v) => {
                allRefs.add(v);
                this.iterateVarRefs(v, (ref) => allRefs.add(ref));
            });
            this.pushFilterSelectorsForValue(sourceValue, selector);
            const callback = () =>
                this.pushFilterSelectorsForValue(sourceValue, selector);
            allRefs.forEach((v) => this.subscribeForVarTypeChange(v, callback));
        }
        collectVariablesAndVarDep() {
            this.rulesQueue.forEach((rules) => {
                iterateCSSRules(rules, (rule) => {
                    if (rule.style) {
                        this.collectVarsFromCSSDeclarations(rule.style);
                    }
                });
            });
            this.inlineStyleQueue.forEach((style) => {
                this.collectVarsFromCSSDeclarations(style);
            });
            this.rulesQueue.clear();
            this.inlineStyleQueue.splice(0);
        }
        collectVarsFromCSSDeclarations(style) {
            iterateCSSDeclarations(style, (property, value) => {
                if (isVariable(property)) {
                    this.inspectVariable(property, value);
                }
                if (isVarDependant(value)) {
                    this.inspectVarDependant(property, value);
                }
            });
        }
        shouldProcessRootVariables() {
            return (
                this.rulesQueue.size > 0 &&
                document.documentElement.getAttribute("style")?.includes("--")
            );
        }
        collectRootVariables() {
            if (!this.shouldProcessRootVariables()) {
                return;
            }
            iterateCSSDeclarations(
                document.documentElement.style,
                (property, value) => {
                    if (isVariable(property)) {
                        this.inspectVariable(property, value);
                    }
                }
            );
        }
        inspectVariable(varName, value) {
            this.unstableVarValues.set(varName, value);
            const hasVar = isVarDependant(value);
            if (hasVar && isConstructedColorVar(value)) {
                if (!this.unknownColorVars.has(varName)) {
                    this.unknownColorVars.add(varName);
                    this.varsChanged = true;
                }
                this.definedVars.add(varName);
            }
            if (this.definedVars.has(varName)) {
                return;
            }
            this.definedVars.add(varName);
            this.varsChanged = true;
            const valueOrFallback = hasVar ? getVarFallback(value) : value;
            const isColor = Boolean(
                getRGBValues(valueOrFallback) ||
                parseColorWithCache(valueOrFallback)
            );
            if (isColor) {
                this.unknownColorVars.add(varName);
            } else if (
                valueOrFallback.includes("url(") ||
                valueOrFallback.includes("linear-gradient(") ||
                valueOrFallback.includes("radial-gradient(")
            ) {
                this.resolveVariableType(varName, VAR_TYPE_BG_IMG);
            }
        }
        resolveVariableType(varName, typeNum) {
            const initialType = this.initialVarTypes.get(varName) || 0;
            const currentType = this.varTypes.get(varName) || 0;
            const newType = currentType | typeNum;
            this.varTypes.set(varName, newType);
            if (newType !== initialType || this.undefinedVars.has(varName)) {
                this.changedTypeVars.add(varName);
                this.undefinedVars.delete(varName);
            }
            if (
                newType !== currentType ||
                this.unknownColorVars.has(varName) ||
                this.unknownBgVars.has(varName)
            ) {
                this.varsChanged = true;
            }
            this.unknownColorVars.delete(varName);
            this.unknownBgVars.delete(varName);
        }
        collectRootVarDependents() {
            if (!this.shouldProcessRootVariables()) {
                return;
            }
            iterateCSSDeclarations(
                document.documentElement.style,
                (property, value) => {
                    if (isVarDependant(value)) {
                        this.inspectVarDependant(property, value);
                    }
                }
            );
        }
        inspectVarDependant(property, value) {
            if (isVariable(property)) {
                this.iterateVarDeps(value, (ref) => {
                    if (!this.varRefs.has(property)) {
                        this.varRefs.set(property, new Set());
                    }
                    const refs = this.varRefs.get(property);
                    if (!refs.has(ref)) {
                        refs.add(ref);
                        this.varsChanged = true;
                    }
                });
            } else if (
                property === "background-color" ||
                property === "box-shadow"
            ) {
                this.iterateVarDeps(value, (v) =>
                    this.resolveVariableType(v, VAR_TYPE_BG_COLOR)
                );
            } else if (isTextColorProperty(property)) {
                this.iterateVarDeps(value, (v) =>
                    this.resolveVariableType(v, VAR_TYPE_TEXT_COLOR)
                );
            } else if (
                property.startsWith("border") ||
                property.startsWith("outline")
            ) {
                this.iterateVarDeps(value, (v) =>
                    this.resolveVariableType(v, VAR_TYPE_BORDER_COLOR)
                );
            } else if (
                property === "background" ||
                property === "background-image"
            ) {
                this.iterateVarDeps(value, (v) => {
                    if (
                        this.isVarType(v, VAR_TYPE_BG_COLOR | VAR_TYPE_BG_IMG)
                    ) {
                        return;
                    }
                    const isBgColor =
                        this.findVarRef(v, (ref) => {
                            return (
                                this.unknownColorVars.has(ref) ||
                                this.isVarType(
                                    ref,
                                    VAR_TYPE_BG_COLOR |
                                        VAR_TYPE_TEXT_COLOR |
                                        VAR_TYPE_BORDER_COLOR
                                )
                            );
                        }) != null;
                    this.iterateVarRefs(v, (ref) => {
                        if (isBgColor) {
                            this.resolveVariableType(ref, VAR_TYPE_BG_COLOR);
                        } else if (!this.unknownBgVars.has(ref)) {
                            this.unknownBgVars.add(ref);
                            this.varsChanged = true;
                        }
                    });
                });
            }
        }
        iterateVarDeps(value, iterator) {
            const varDeps = new Set();
            iterateVarDependencies(value, (v) => varDeps.add(v));
            varDeps.forEach((v) => iterator(v));
        }
        findVarRef(varName, iterator, visited = new Set()) {
            const queue = [varName];
            while (queue.length > 0) {
                const v = queue.pop();
                if (visited.has(v)) {
                    continue;
                }
                visited.add(v);
                if (iterator(v)) {
                    return v;
                }
                const refs = this.varRefs.get(v);
                if (refs) {
                    refs.forEach((ref) => queue.push(ref));
                }
            }
            return null;
        }
        iterateVarRefs(varName, iterator) {
            this.findVarRef(varName, (ref) => {
                iterator(ref);
                return false;
            });
        }
        setOnRootVariableChange(callback) {
            this.onRootVariableDefined = callback;
        }
        putRootVars(styleElement, theme) {
            const declarations = new Map();
            iterateCSSDeclarations(
                document.documentElement.style,
                (property, value) => {
                    if (isVariable(property)) {
                        if (this.isVarType(property, VAR_TYPE_BG_COLOR)) {
                            declarations.set(
                                wrapBgColorVariableName(property),
                                tryModifyBgColor(value, theme)
                            );
                        }
                        if (this.isVarType(property, VAR_TYPE_TEXT_COLOR)) {
                            declarations.set(
                                wrapTextColorVariableName(property),
                                tryModifyTextColor(value, theme)
                            );
                        }
                        if (this.isVarType(property, VAR_TYPE_BORDER_COLOR)) {
                            declarations.set(
                                wrapBorderColorVariableName(property),
                                tryModifyBorderColor(value, theme)
                            );
                        }
                        this.subscribeForVarTypeChange(
                            property,
                            this.onRootVariableDefined
                        );
                    }
                }
            );
            const cssLines = [];
            cssLines.push(":root {");
            for (const [property, value] of declarations) {
                cssLines.push(`    ${property}: ${value};`);
            }
            cssLines.push("}");
            const cssText = cssLines.join("\n");
            const sheet = styleElement.sheet;
            if (sheet) {
                if (sheet.cssRules.length > 0) {
                    sheet.deleteRule(0);
                }
                sheet.insertRule(cssText);
            } else {
                styleElement.textContent = cssText;
            }
        }
    }
    const variablesStore = new VariablesStore();
    function getVariableRange(input, searchStart = 0) {
        const start = input.indexOf("var(", searchStart);
        if (start >= 0) {
            const range = getParenthesesRange(input, start + 3);
            if (range) {
                return {start, end: range.end};
            }
        }
        return null;
    }
    function getVariablesMatches(input) {
        const ranges = [];
        let i = 0;
        let range;
        while ((range = getVariableRange(input, i))) {
            const {start, end} = range;
            ranges.push({start, end, value: input.substring(start, end)});
            i = range.end + 1;
        }
        return ranges;
    }
    function replaceVariablesMatches(input, replacer) {
        const matches = getVariablesMatches(input);
        const matchesCount = matches.length;
        if (matchesCount === 0) {
            return input;
        }
        const inputLength = input.length;
        const replacements = matches.map((m) =>
            replacer(m.value, matches.length)
        );
        const parts = [];
        parts.push(input.substring(0, matches[0].start));
        for (let i = 0; i < matchesCount; i++) {
            parts.push(replacements[i]);
            const start = matches[i].end;
            const end =
                i < matchesCount - 1 ? matches[i + 1].start : inputLength;
            parts.push(input.substring(start, end));
        }
        return parts.join("");
    }
    function getVariableNameAndFallback(match) {
        const commaIndex = match.indexOf(",");
        let name;
        let fallback;
        if (commaIndex >= 0) {
            name = match.substring(4, commaIndex).trim();
            fallback = match.substring(commaIndex + 1, match.length - 1).trim();
        } else {
            name = match.substring(4, match.length - 1).trim();
            fallback = "";
        }
        return {name, fallback};
    }
    function replaceCSSVariablesNames(
        value,
        nameReplacer,
        fallbackReplacer,
        finalFallback
    ) {
        const matchReplacer = (match) => {
            const {name, fallback} = getVariableNameAndFallback(match);
            const newName = nameReplacer(name);
            if (!fallback) {
                if (finalFallback) {
                    return `var(${newName}, ${finalFallback})`;
                }
                return `var(${newName})`;
            }
            let newFallback;
            if (isVarDependant(fallback)) {
                newFallback = replaceCSSVariablesNames(
                    fallback,
                    nameReplacer,
                    fallbackReplacer
                );
            } else if (fallbackReplacer) {
                newFallback = fallbackReplacer(fallback);
            } else {
                newFallback = fallback;
            }
            return `var(${newName}, ${newFallback})`;
        };
        return replaceVariablesMatches(value, matchReplacer);
    }
    function getVarFallback(value) {
        return replaceVariablesMatches(value, (match) => {
            const {fallback} = getVariableNameAndFallback(match);
            if (!fallback) {
                return "";
            }
            return isVarDependant(fallback)
                ? getVarFallback(fallback)
                : fallback;
        });
    }
    function iterateVarDependencies(value, iterator) {
        replaceCSSVariablesNames(value, (varName) => {
            iterator(varName);
            return varName;
        });
    }
    function wrapBgColorVariableName(name) {
        return `--darkreader-bg${name}`;
    }
    function wrapTextColorVariableName(name) {
        return `--darkreader-text${name}`;
    }
    function wrapBorderColorVariableName(name) {
        return `--darkreader-border${name}`;
    }
    function wrapBgImgVariableName(name) {
        return `--darkreader-bgimg${name}`;
    }
    function isVariable(property) {
        return property.startsWith("--");
    }
    function isVarDependant(value) {
        return value.includes("var(");
    }
    function isConstructedColorVar(value) {
        return (
            value.match(/^\s*(rgb|hsl)a?\(/) ||
            value.match(/^(((\d{1,3})|(var\([\-_A-Za-z0-9]+\))),?\s*?){3}$/)
        );
    }
    function isFallbackResolved(modified) {
        if (modified.startsWith("var(") && modified.endsWith(")")) {
            const hasNestedBrackets = modified.endsWith("))");
            const hasDoubleNestedBrackets = modified.endsWith(")))");
            const lastOpenBracketIndex = hasNestedBrackets
                ? modified.lastIndexOf("(")
                : -1;
            const firstOpenBracketIndex = hasDoubleNestedBrackets
                ? modified.lastIndexOf("(", lastOpenBracketIndex - 1)
                : lastOpenBracketIndex;
            const commaIndex = modified.lastIndexOf(
                ",",
                hasNestedBrackets ? firstOpenBracketIndex : modified.length
            );
            if (commaIndex < 0 || modified[commaIndex + 1] !== " ") {
                return false;
            }
            const fallback = modified.slice(
                commaIndex + 2,
                modified.length - 1
            );
            if (hasNestedBrackets) {
                return (
                    fallback.startsWith("rgb(") ||
                    fallback.startsWith("rgba(") ||
                    fallback.startsWith("hsl(") ||
                    fallback.startsWith("hsla(") ||
                    fallback.startsWith("var(--darkreader-bg--") ||
                    fallback.startsWith("var(--darkreader-background-") ||
                    (hasDoubleNestedBrackets &&
                        fallback.includes("var(--darkreader-background-"))
                );
            }
            return fallback.match(/^(#[0-9a-f]+)|([a-z]+)$/i);
        }
        return false;
    }
    const textColorProps = [
        "color",
        "caret-color",
        "-webkit-text-fill-color",
        "fill",
        "stroke"
    ];
    function isTextColorProperty(property) {
        return textColorProps.includes(property);
    }
    function parseRawColorValue(input) {
        const v = getRGBValues(input);
        if (v) {
            const color =
                v[3] < 1
                    ? `rgb(${v[0]} ${v[1]} ${v[2]} / ${v[3]})`
                    : `rgb(${v[0]} ${v[1]} ${v[2]})`;
            return {isRaw: true, color};
        }
        return {isRaw: false, color: input};
    }
    function handleRawColorValue(input, theme, modifyFunction) {
        const {isRaw, color} = parseRawColorValue(input);
        const rgb = parseColorWithCache(color);
        if (rgb) {
            const outputColor = modifyFunction(rgb, theme, !isRaw);
            if (isRaw) {
                const outputInRGB = parseColorWithCache(outputColor);
                return outputInRGB
                    ? Number.isNaN(outputInRGB.a) || outputInRGB.a === 1
                        ? `${outputInRGB.r}, ${outputInRGB.g}, ${outputInRGB.b}`
                        : `${outputInRGB.r}, ${outputInRGB.g}, ${outputInRGB.b}, ${outputInRGB.a}`
                    : outputColor;
            }
            return outputColor;
        }
        return color;
    }
    function tryModifyBgColor(color, theme) {
        return handleRawColorValue(color, theme, modifyBackgroundColor);
    }
    function tryModifyTextColor(color, theme) {
        return handleRawColorValue(color, theme, modifyForegroundColor);
    }
    function tryModifyBorderColor(color, theme) {
        return handleRawColorValue(color, theme, modifyBorderColor);
    }
    const MAX_VARIABLE_SUBSTITUTIONS = 100000;
    const MAX_VARIABLE_DEPTH = 1000;
    function insertVarValues(
        source,
        varValues,
        stack = new Set(),
        cache = new Map(),
        depth = 0
    ) {
        if (depth > MAX_VARIABLE_DEPTH) {
            return null;
        }
        let containsUnresolvedVar = false;
        const matchReplacer = (match) => {
            const {name, fallback} = getVariableNameAndFallback(match);
            const varValue = varValues.get(name);
            let inserted = null;
            if (varValue) {
                if (cache.has(name)) {
                    inserted = cache.get(name);
                } else if (!stack.has(name)) {
                    stack.add(name);
                    if (isVarDependant(varValue)) {
                        inserted = insertVarValues(
                            varValue,
                            varValues,
                            stack,
                            cache,
                            depth + 1
                        );
                    } else {
                        inserted = varValue;
                    }
                    stack.delete(name);
                    cache.set(name, inserted);
                }
            } else if (fallback) {
                if (isVarDependant(fallback)) {
                    inserted = insertVarValues(
                        fallback,
                        varValues,
                        stack,
                        cache,
                        depth + 1
                    );
                } else {
                    inserted = fallback;
                }
            }
            if (!inserted) {
                containsUnresolvedVar = true;
                return null;
            }
            return inserted;
        };
        const replaced = replaceVariablesMatches(source, matchReplacer);
        if (
            containsUnresolvedVar ||
            replaced.length > MAX_VARIABLE_SUBSTITUTIONS
        ) {
            return null;
        }
        return replaced;
    }

    function getThemeKey$1(theme) {
        let resultKey = "";
        themeCacheKeys.forEach((key) => {
            resultKey += `${key}:${theme[key]};`;
        });
        return resultKey;
    }
    const asyncQueue = createAsyncTasksQueue();
    function createStyleSheetModifier() {
        let renderId = 0;
        let cssTextCounter = 0;
        const cssTextIds = new Map();
        function getCSSTextKey(cssText) {
            const existing = cssTextIds.get(cssText);
            if (existing !== undefined) {
                return existing;
            }
            let n = ++cssTextCounter;
            let key = "";
            do {
                key = String.fromCharCode(n & 0xffff) + key;
                n >>>= 16;
            } while (n > 0);
            cssTextIds.set(cssText, key);
            return key;
        }
        function getStyleRuleKey(rule) {
            let key = getCSSTextKey(rule.cssText);
            if (isMediaRule(rule.parentRule)) {
                key = `${getCSSTextKey(rule.parentRule.media.mediaText)}{${key}}`;
            }
            if (isLayerRule(rule.parentRule)) {
                key = `${getCSSTextKey(rule.parentRule.name)}{${key}}`;
            }
            if (isContainerRule(rule.parentRule)) {
                const {containerName, containerQuery} = rule.parentRule;
                key = `${getCSSTextKey(`${containerName} ${containerQuery}`)}{${key}}`;
            }
            return key;
        }
        const rulesTextCache = new Set();
        const rulesModCache = new Map();
        const varTypeChangeCleaners = new Set();
        let prevFilterKey = null;
        let hasNonLoadedLink = false;
        let wasRebuilt = false;
        function shouldRebuildStyle() {
            return hasNonLoadedLink && !wasRebuilt;
        }
        function modifySheet(options) {
            const rules = options.sourceCSSRules;
            const {
                theme,
                ignoreImageAnalysis,
                force,
                prepareSheet,
                isAsyncCancelled
            } = options;
            let rulesChanged = rulesModCache.size === 0;
            const notFoundCacheKeys = new Set(rulesModCache.keys());
            const themeKey = getThemeKey$1(theme);
            const themeChanged = themeKey !== prevFilterKey;
            if (hasNonLoadedLink) {
                wasRebuilt = true;
            }
            const modRules = [];
            iterateCSSRules(
                rules,
                (rule) => {
                    const key = getStyleRuleKey(rule);
                    let textDiffersFromPrev = false;
                    notFoundCacheKeys.delete(key);
                    if (!rulesTextCache.has(key)) {
                        rulesTextCache.add(key);
                        textDiffersFromPrev = true;
                    }
                    if (textDiffersFromPrev) {
                        rulesChanged = true;
                    } else {
                        modRules.push(rulesModCache.get(key));
                        return;
                    }
                    if (rule.style.all === "revert") {
                        return;
                    }
                    const modDecs = [];
                    rule.style &&
                        iterateCSSDeclarations(
                            rule.style,
                            (property, value) => {
                                const mod = getModifiableCSSDeclaration(
                                    property,
                                    value,
                                    rule,
                                    variablesStore,
                                    ignoreImageAnalysis,
                                    isAsyncCancelled
                                );
                                if (mod) {
                                    modDecs.push(mod);
                                }
                            }
                        );
                    let modRule = null;
                    if (modDecs.length > 0) {
                        const parentRule = rule.parentRule;
                        modRule = {
                            selector: rule.selectorText,
                            declarations: modDecs,
                            parentRule
                        };
                        modRules.push(modRule);
                    }
                    rulesModCache.set(key, modRule);
                },
                () => {
                    hasNonLoadedLink = true;
                }
            );
            notFoundCacheKeys.forEach((key) => {
                rulesTextCache.delete(key);
                rulesModCache.delete(key);
            });
            prevFilterKey = themeKey;
            if (!force && !rulesChanged && !themeChanged) {
                return;
            }
            renderId++;
            function setRule(target, index, rule) {
                const {selector, declarations} = rule;
                let selectorText = selector;
                const emptyIsWhereSelector =
                    isChromium &&
                    selector.startsWith(":is(") &&
                    (selector.includes(":is()") ||
                        selector.includes(":where()") ||
                        (selector.includes(":where(") &&
                            selector.includes(":-moz")));
                const viewTransitionSelector =
                    selector.includes("::view-transition-");
                if (emptyIsWhereSelector || viewTransitionSelector) {
                    selectorText = ".darkreader-unsupported-selector";
                }
                if (isChromium && selectorText.endsWith("::picker")) {
                    selectorText = selectorText.replaceAll(
                        "::picker",
                        "::picker(select)"
                    );
                }
                let ruleText = `${selectorText} {`;
                for (const dec of declarations) {
                    const {property, value, important} = dec;
                    if (value) {
                        ruleText += ` ${property}: ${value}${important ? " !important" : ""};`;
                    }
                }
                ruleText += " }";
                target.insertRule(ruleText, index);
            }
            const asyncDeclarations = new Map();
            const varDeclarations = new Map();
            let asyncDeclarationCounter = 0;
            let varDeclarationCounter = 0;
            const rootReadyGroup = {rule: null, rules: [], isGroup: true};
            const groupRefs = new WeakMap();
            function getGroup(rule) {
                if (rule == null) {
                    return rootReadyGroup;
                }
                if (groupRefs.has(rule)) {
                    return groupRefs.get(rule);
                }
                const group = {rule, rules: [], isGroup: true};
                groupRefs.set(rule, group);
                const parentGroup = getGroup(rule.parentRule);
                parentGroup.rules.push(group);
                return group;
            }
            varTypeChangeCleaners.forEach((clear) => clear());
            varTypeChangeCleaners.clear();
            modRules
                .filter((r) => r)
                .forEach(({selector, declarations, parentRule}) => {
                    const group = getGroup(parentRule);
                    const readyStyleRule = {
                        selector,
                        declarations: [],
                        isGroup: false
                    };
                    const readyDeclarations = readyStyleRule.declarations;
                    group.rules.push(readyStyleRule);
                    function handleAsyncDeclaration(
                        property,
                        modified,
                        important,
                        sourceValue
                    ) {
                        const asyncKey = ++asyncDeclarationCounter;
                        const asyncDeclaration = {
                            property,
                            value: null,
                            important,
                            asyncKey,
                            sourceValue
                        };
                        readyDeclarations.push(asyncDeclaration);
                        const currentRenderId = renderId;
                        modified.then((asyncValue) => {
                            if (
                                !asyncValue ||
                                isAsyncCancelled() ||
                                currentRenderId !== renderId
                            ) {
                                return;
                            }
                            asyncDeclaration.value = asyncValue;
                            asyncQueue.add(() => {
                                if (
                                    isAsyncCancelled() ||
                                    currentRenderId !== renderId
                                ) {
                                    return;
                                }
                                rebuildAsyncRule(asyncKey);
                            });
                        });
                    }
                    function handleVarDeclarations(
                        property,
                        modified,
                        important,
                        sourceValue
                    ) {
                        const {declarations: varDecs, onTypeChange} = modified;
                        const varKey = ++varDeclarationCounter;
                        const currentRenderId = renderId;
                        const initialIndex = readyDeclarations.length;
                        let oldDecs = [];
                        if (varDecs.length === 0) {
                            const tempDec = {
                                property,
                                value: sourceValue,
                                important,
                                sourceValue,
                                varKey
                            };
                            readyDeclarations.push(tempDec);
                            oldDecs = [tempDec];
                        }
                        varDecs.forEach((mod) => {
                            if (mod.value instanceof Promise) {
                                handleAsyncDeclaration(
                                    mod.property,
                                    mod.value,
                                    important,
                                    sourceValue
                                );
                            } else {
                                const readyDec = {
                                    property: mod.property,
                                    value: mod.value,
                                    important,
                                    sourceValue,
                                    varKey
                                };
                                readyDeclarations.push(readyDec);
                                oldDecs.push(readyDec);
                            }
                        });
                        onTypeChange.addListener((newDecs) => {
                            if (
                                isAsyncCancelled() ||
                                currentRenderId !== renderId
                            ) {
                                return;
                            }
                            const readyVarDecs = newDecs.map((mod) => {
                                return {
                                    property: mod.property,
                                    value: mod.value,
                                    important,
                                    sourceValue,
                                    varKey
                                };
                            });
                            const index = readyDeclarations.indexOf(
                                oldDecs[0],
                                initialIndex
                            );
                            readyDeclarations.splice(
                                index,
                                oldDecs.length,
                                ...readyVarDecs
                            );
                            oldDecs = readyVarDecs;
                            rebuildVarRule(varKey);
                        });
                        varTypeChangeCleaners.add(() =>
                            onTypeChange.removeListeners()
                        );
                    }
                    declarations.forEach(
                        ({property, value, important, sourceValue}) => {
                            if (typeof value === "function") {
                                const modified = value(theme);
                                if (modified instanceof Promise) {
                                    handleAsyncDeclaration(
                                        property,
                                        modified,
                                        important,
                                        sourceValue
                                    );
                                } else if (property.startsWith("--")) {
                                    handleVarDeclarations(
                                        property,
                                        modified,
                                        important,
                                        sourceValue
                                    );
                                } else {
                                    readyDeclarations.push({
                                        property,
                                        value: modified,
                                        important,
                                        sourceValue
                                    });
                                }
                            } else {
                                readyDeclarations.push({
                                    property,
                                    value,
                                    important,
                                    sourceValue
                                });
                            }
                        }
                    );
                });
            const sheet = prepareSheet();
            function buildStyleSheet() {
                function createTarget(group, parent) {
                    const {rule} = group;
                    if (isStyleRule(rule)) {
                        const {selectorText} = rule;
                        const index = parent.cssRules.length;
                        parent.insertRule(`${selectorText} {}`, index);
                        return parent.cssRules[index];
                    }
                    if (isMediaRule(rule)) {
                        const {media} = rule;
                        const index = parent.cssRules.length;
                        parent.insertRule(
                            `@media ${media.mediaText} {}`,
                            index
                        );
                        return parent.cssRules[index];
                    }
                    if (isLayerRule(rule)) {
                        const {name} = rule;
                        const index = parent.cssRules.length;
                        parent.insertRule(`@layer ${name} {}`, index);
                        return parent.cssRules[index];
                    }
                    if (isContainerRule(rule)) {
                        const {containerName, containerQuery} = rule;
                        const index = parent.cssRules.length;
                        const query = containerName
                            ? `${containerName} ${containerQuery}`
                            : containerQuery;
                        parent.insertRule(`@container ${query} {}`, index);
                        return parent.cssRules[index];
                    }
                    return parent;
                }
                function iterateReadyRules(group, target, styleIterator) {
                    group.rules.forEach((r) => {
                        if (r.isGroup) {
                            const t = createTarget(r, target);
                            iterateReadyRules(r, t, styleIterator);
                        } else {
                            styleIterator(r, target);
                        }
                    });
                }
                iterateReadyRules(rootReadyGroup, sheet, (rule, target) => {
                    const index = target.cssRules.length;
                    rule.declarations.forEach(({asyncKey, varKey}) => {
                        if (asyncKey != null) {
                            asyncDeclarations.set(asyncKey, {
                                rule,
                                target,
                                index
                            });
                        }
                        if (varKey != null) {
                            varDeclarations.set(varKey, {rule, target, index});
                        }
                    });
                    setRule(target, index, rule);
                });
            }
            function rebuildAsyncRule(key) {
                const {rule, target, index} = asyncDeclarations.get(key);
                target.deleteRule(index);
                setRule(target, index, rule);
                asyncDeclarations.delete(key);
            }
            function rebuildVarRule(key) {
                const {rule, target, index} = varDeclarations.get(key);
                target.deleteRule(index);
                setRule(target, index, rule);
            }
            buildStyleSheet();
        }
        return {modifySheet, shouldRebuildStyle};
    }

    let canUseSheetProxy$1 = false;
    document.addEventListener(
        "__darkreader__inlineScriptsAllowed",
        () => (canUseSheetProxy$1 = true),
        {once: true}
    );
    const overrides$1 = new WeakSet();
    const overridesBySource = new WeakMap();
    function canHaveAdoptedStyleSheets(node) {
        return Array.isArray(node.adoptedStyleSheets);
    }
    const getAdoptedSheets = isFirefox
        ? (node) =>
              node.adoptedStyleSheets.wrappedJSObject ?? node.adoptedStyleSheets
        : (node) => node.adoptedStyleSheets;
    const createOverrideSheet = isFirefox
        ? () => {
              const pageWindow = window.wrappedJSObject ?? window;
              return new pageWindow.CSSStyleSheet();
          }
        : () => new CSSStyleSheet();
    function createAdoptedStyleSheetOverride(node) {
        let cancelAsyncOperations = false;
        function iterateSourceSheets(iterator) {
            forEach(getAdoptedSheets(node), (sheet) => {
                if (!overrides$1.has(sheet)) {
                    iterator(sheet);
                }
                defineSheetScope(sheet, node);
            });
        }
        function injectSheet(sheet, override) {
            const newSheets = isFirefox
                ? getAdoptedSheets(node)
                : [...node.adoptedStyleSheets];
            const sheetIndex = newSheets.indexOf(sheet);
            const overrideIndex = newSheets.indexOf(override);
            if (overrideIndex >= 0) {
                newSheets.splice(overrideIndex, 1);
            }
            newSheets.splice(sheetIndex + 1, 0, override);
            if (!isFirefox) {
                node.adoptedStyleSheets = newSheets;
            }
        }
        function clear() {
            const newSheets = isFirefox
                ? getAdoptedSheets(node)
                : [...node.adoptedStyleSheets];
            for (let i = newSheets.length - 1; i >= 0; i--) {
                const sheet = newSheets[i];
                if (overrides$1.has(sheet)) {
                    newSheets.splice(i, 1);
                }
            }
            if (
                !isFirefox &&
                node.adoptedStyleSheets.length !== newSheets.length
            ) {
                node.adoptedStyleSheets = newSheets;
            }
            sourceSheets = new WeakSet();
            sourceDeclarations = new WeakSet();
        }
        const cleaners = [];
        function destroy() {
            cleaners.forEach((c) => c());
            cleaners.splice(0);
            cancelAsyncOperations = true;
            clear();
            if (frameId) {
                cancelAnimationFrame(frameId);
                frameId = null;
            }
        }
        let rulesChangeKey = 0;
        function getRulesChangeKey() {
            let count = 0;
            iterateSourceSheets((sheet) => {
                count += sheet.cssRules.length;
            });
            if (count === 1) {
                const rule = getAdoptedSheets(node)[0].cssRules[0];
                return rule instanceof CSSStyleRule ? rule.style.length : count;
            }
            return count;
        }
        let sourceSheets = new WeakSet();
        let sourceDeclarations = new WeakSet();
        function render(theme, ignoreImageAnalysis) {
            clear();
            const sheets = getAdoptedSheets(node);
            for (let i = sheets.length - 1; i >= 0; i--) {
                const sheet = sheets[i];
                if (overrides$1.has(sheet)) {
                    continue;
                }
                sourceSheets.add(sheet);
                const readyOverride = overridesBySource.get(sheet);
                if (readyOverride) {
                    rulesChangeKey = getRulesChangeKey();
                    injectSheet(sheet, readyOverride);
                    continue;
                }
                const rules = sheet.cssRules;
                const override = createOverrideSheet();
                overridesBySource.set(sheet, override);
                iterateCSSRules(rules, (rule) =>
                    sourceDeclarations.add(rule.style)
                );
                const prepareSheet = () => {
                    for (let i = override.cssRules.length - 1; i >= 0; i--) {
                        override.deleteRule(i);
                    }
                    override.insertRule("#__darkreader__adoptedOverride {}");
                    injectSheet(sheet, override);
                    overrides$1.add(override);
                    return override;
                };
                const sheetModifier = createStyleSheetModifier();
                sheetModifier.modifySheet({
                    prepareSheet,
                    sourceCSSRules: rules,
                    theme,
                    ignoreImageAnalysis,
                    force: false,
                    isAsyncCancelled: () => cancelAsyncOperations
                });
            }
            rulesChangeKey = getRulesChangeKey();
        }
        let callbackRequested = false;
        function handleArrayChange(callback) {
            if (callbackRequested) {
                return;
            }
            callbackRequested = true;
            queueMicrotask(() => {
                callbackRequested = false;
                const sheets = getAdoptedSheets(node).filter(
                    (s) => !overrides$1.has(s)
                );
                sheets.forEach((sheet) => overridesBySource.delete(sheet));
                callback(sheets);
            });
        }
        function checkForUpdates() {
            return getRulesChangeKey() !== rulesChangeKey;
        }
        let frameId = null;
        function watchUsingRAF(callback) {
            frameId = requestAnimationFrame(() => {
                if (canUseSheetProxy$1) {
                    return;
                }
                if (checkForUpdates()) {
                    handleArrayChange(callback);
                }
                watchUsingRAF(callback);
            });
        }
        function addSheetChangeEventListener(type, listener) {
            node.addEventListener(type, listener);
            cleaners.push(() => node.removeEventListener(type, listener));
        }
        function watch(callback) {
            const onAdoptedSheetsChange = () => {
                canUseSheetProxy$1 = true;
                handleArrayChange(callback);
            };
            addSheetChangeEventListener(
                "__darkreader__adoptedStyleSheetsChange",
                onAdoptedSheetsChange
            );
            addSheetChangeEventListener(
                "__darkreader__adoptedStyleSheetChange",
                onAdoptedSheetsChange
            );
            addSheetChangeEventListener(
                "__darkreader__adoptedStyleDeclarationChange",
                onAdoptedSheetsChange
            );
            if (canUseSheetProxy$1) {
                return;
            }
            watchUsingRAF(callback);
        }
        return {
            render,
            destroy,
            watch
        };
    }

    const hostsBreakingOnStylePosition = [
        "chat.google.com",
        "gogoprivate.com",
        "gprivate.com",
        "www.berlingske.dk",
        "www.bloomberg.com",
        "www.diffusioneshop.com",
        "www.weekendavisen.dk",
        "zhale.me"
    ];
    const mode = hostsBreakingOnStylePosition.includes(location.hostname)
        ? "away"
        : "next";
    function getStyleInjectionMode() {
        return mode;
    }
    const stylesWaitingForBody = new Set();
    let bodyObserver = null;
    function injectStyleAway(styleElement) {
        if (!document.body) {
            stylesWaitingForBody.add(styleElement);
            if (!bodyObserver) {
                bodyObserver = new MutationObserver(() => {
                    if (document.body) {
                        bodyObserver.disconnect();
                        bodyObserver = null;
                        stylesWaitingForBody.forEach((el) =>
                            injectStyleAway(el)
                        );
                        stylesWaitingForBody.clear();
                    }
                });
                bodyObserver.observe(document, {
                    childList: true,
                    subtree: true
                });
            }
            return;
        }
        let container = document.body.querySelector(
            ".darkreader-style-container"
        );
        if (!container) {
            container = document.createElement("div");
            container.classList.add("darkreader");
            container.classList.add("darkreader-style-container");
            container.style.display = "none";
            document.body.append(container);
            containerObserver = new MutationObserver(() => {
                if (container?.nextElementSibling != null) {
                    container
                        .querySelectorAll(".darkreader--sync")
                        .forEach((el) => {
                            if (el.sheet.cssRules.length > 0) {
                                let cssText = "";
                                for (const rule of el.sheet.cssRules) {
                                    cssText += rule.cssText;
                                }
                                el.textContent = cssText;
                            }
                        });
                    document.body.append(container);
                }
            });
            containerObserver.observe(document.body, {childList: true});
        }
        container.append(styleElement);
    }
    let containerObserver;
    function removeStyleContainer() {
        bodyObserver?.disconnect();
        bodyObserver = null;
        stylesWaitingForBody.clear();
        containerObserver?.disconnect();
        document.querySelector(".darkreader-style-container")?.remove();
    }

    const overrides = {
        "background-color": {
            customProp: "--darkreader-inline-bgcolor",
            cssProp: "background-color",
            dataAttr: "data-darkreader-inline-bgcolor"
        },
        "background-image": {
            customProp: "--darkreader-inline-bgimage",
            cssProp: "background-image",
            dataAttr: "data-darkreader-inline-bgimage"
        },
        "border-color": {
            customProp: "--darkreader-inline-border",
            cssProp: "border-color",
            dataAttr: "data-darkreader-inline-border"
        },
        "border-bottom-color": {
            customProp: "--darkreader-inline-border-bottom",
            cssProp: "border-bottom-color",
            dataAttr: "data-darkreader-inline-border-bottom"
        },
        "border-left-color": {
            customProp: "--darkreader-inline-border-left",
            cssProp: "border-left-color",
            dataAttr: "data-darkreader-inline-border-left"
        },
        "border-right-color": {
            customProp: "--darkreader-inline-border-right",
            cssProp: "border-right-color",
            dataAttr: "data-darkreader-inline-border-right"
        },
        "border-top-color": {
            customProp: "--darkreader-inline-border-top",
            cssProp: "border-top-color",
            dataAttr: "data-darkreader-inline-border-top"
        },
        "box-shadow": {
            customProp: "--darkreader-inline-boxshadow",
            cssProp: "box-shadow",
            dataAttr: "data-darkreader-inline-boxshadow"
        },
        "color": {
            customProp: "--darkreader-inline-color",
            cssProp: "color",
            dataAttr: "data-darkreader-inline-color"
        },
        "fill": {
            customProp: "--darkreader-inline-fill",
            cssProp: "fill",
            dataAttr: "data-darkreader-inline-fill"
        },
        "stroke": {
            customProp: "--darkreader-inline-stroke",
            cssProp: "stroke",
            dataAttr: "data-darkreader-inline-stroke"
        },
        "outline-color": {
            customProp: "--darkreader-inline-outline",
            cssProp: "outline-color",
            dataAttr: "data-darkreader-inline-outline"
        },
        "stop-color": {
            customProp: "--darkreader-inline-stopcolor",
            cssProp: "stop-color",
            dataAttr: "data-darkreader-inline-stopcolor"
        }
    };
    const shorthandOverrides = {
        "background": {
            customProp: "--darkreader-inline-bg",
            cssProp: "background",
            dataAttr: "data-darkreader-inline-bg"
        },
        "border": {
            customProp: "--darkreader-inline-border-short",
            cssProp: "border",
            dataAttr: "data-darkreader-inline-border-short"
        },
        "border-bottom": {
            customProp: "--darkreader-inline-border-bottom-short",
            cssProp: "border-bottom",
            dataAttr: "data-darkreader-inline-border-bottom-short"
        },
        "border-left": {
            customProp: "--darkreader-inline-border-left-short",
            cssProp: "border-left",
            dataAttr: "data-darkreader-inline-border-left-short"
        },
        "border-right": {
            customProp: "--darkreader-inline-border-right-short",
            cssProp: "border-right",
            dataAttr: "data-darkreader-inline-border-right-short"
        },
        "border-top": {
            customProp: "--darkreader-inline-border-top-short",
            cssProp: "border-top",
            dataAttr: "data-darkreader-inline-border-top-short"
        }
    };
    const overridesList = Object.values(overrides);
    const normalizedPropList = {};
    overridesList.forEach(
        ({cssProp, customProp}) => (normalizedPropList[customProp] = cssProp)
    );
    const INLINE_STYLE_ATTRS = [
        "style",
        "fill",
        "stop-color",
        "stroke",
        "bgcolor",
        "color",
        "background"
    ];
    const INLINE_STYLE_SELECTOR = INLINE_STYLE_ATTRS.map(
        (attr) => `[${attr}]`
    ).join(", ");
    function getInlineOverrideStyle() {
        const allOverrides = overridesList.concat(
            Object.values(shorthandOverrides)
        );
        return allOverrides
            .map(({dataAttr, customProp, cssProp}) => {
                return [
                    `[${dataAttr}] {`,
                    `  ${cssProp}: var(${customProp}) !important;`,
                    "}"
                ].join("\n");
            })
            .concat([
                "[data-darkreader-inline-invert] {",
                "    filter: invert(100%) hue-rotate(180deg);",
                "}"
            ])
            .join("\n");
    }
    function getInlineStyleElements(root) {
        const results = [];
        if (root instanceof Element && root.matches(INLINE_STYLE_SELECTOR)) {
            results.push(root);
        }
        if (
            root instanceof Element ||
            (isShadowDomSupported && root instanceof ShadowRoot) ||
            root instanceof Document
        ) {
            push(results, root.querySelectorAll(INLINE_STYLE_SELECTOR));
        }
        return results;
    }
    const treeObservers = new Map();
    const attrObservers = new Map();
    let asyncCancelled = true;
    function isAsyncCancelled() {
        return asyncCancelled;
    }
    function watchForInlineStyles(elementStyleDidChange, shadowRootDiscovered) {
        deepWatchForInlineStyles(
            document,
            elementStyleDidChange,
            shadowRootDiscovered
        );
        iterateShadowHosts(document.documentElement, (host) => {
            deepWatchForInlineStyles(
                host.shadowRoot,
                elementStyleDidChange,
                shadowRootDiscovered
            );
        });
    }
    function deepWatchForInlineStyles(
        root,
        elementStyleDidChange,
        shadowRootDiscovered
    ) {
        if (treeObservers.has(root)) {
            treeObservers.get(root).disconnect();
            attrObservers.get(root).disconnect();
        }
        const discoveredNodes = new WeakSet();
        function discoverNodes(node) {
            getInlineStyleElements(node).forEach((el) => {
                if (discoveredNodes.has(el)) {
                    return;
                }
                discoveredNodes.add(el);
                elementStyleDidChange(el);
            });
            iterateShadowHosts(node, (n) => {
                if (discoveredNodes.has(n)) {
                    return;
                }
                discoveredNodes.add(n);
                shadowRootDiscovered(n.shadowRoot);
                deepWatchForInlineStyles(
                    n.shadowRoot,
                    elementStyleDidChange,
                    shadowRootDiscovered
                );
            });
        }
        const treeObserver = createOptimizedTreeObserver(root, {
            onMinorMutations: (_root, {additions}) => {
                additions.forEach((added) => discoverNodes(added));
                variablesStore.matchVariablesAndDependents();
            },
            onHugeMutations: () => {
                discoverNodes(root);
                variablesStore.matchVariablesAndDependents();
            }
        });
        treeObservers.set(root, treeObserver);
        let attemptCount = 0;
        let start = null;
        const ATTEMPTS_INTERVAL = getDuration({seconds: 10});
        const RETRY_TIMEOUT = getDuration({seconds: 2});
        const MAX_ATTEMPTS_COUNT = 50;
        let cache = [];
        let timeoutId = null;
        const handleAttributeMutations = throttle((mutations) => {
            const handledTargets = new Set();
            mutations.forEach((m) => {
                const target = m.target;
                if (handledTargets.has(target)) {
                    return;
                }
                if (INLINE_STYLE_ATTRS.includes(m.attributeName)) {
                    handledTargets.add(target);
                    elementStyleDidChange(target);
                }
            });
            variablesStore.matchVariablesAndDependents();
        });
        const attrObserver = new MutationObserver((mutations) => {
            if (timeoutId) {
                cache.push(...mutations);
                return;
            }
            attemptCount++;
            const now = Date.now();
            if (start == null) {
                start = now;
            } else if (attemptCount >= MAX_ATTEMPTS_COUNT) {
                if (now - start < ATTEMPTS_INTERVAL) {
                    timeoutId = setTimeout(() => {
                        start = null;
                        attemptCount = 0;
                        timeoutId = null;
                        const attributeCache = cache;
                        cache = [];
                        handleAttributeMutations(attributeCache);
                    }, RETRY_TIMEOUT);
                    cache.push(...mutations);
                    return;
                }
                start = now;
                attemptCount = 1;
            }
            handleAttributeMutations(mutations);
        });
        attrObserver.observe(root, {
            attributes: true,
            attributeFilter: INLINE_STYLE_ATTRS.concat(
                overridesList.map(({dataAttr}) => dataAttr)
            ),
            subtree: true
        });
        attrObservers.set(root, attrObserver);
    }
    function stopWatchingForInlineStyles() {
        asyncCancelled = true;
        treeObservers.forEach((o) => o.disconnect());
        attrObservers.forEach((o) => o.disconnect());
        treeObservers.clear();
        attrObservers.clear();
        inlineStringValueCache.clear();
        resetInlineStyleLoopDetection();
    }
    const inlineStyleCache = new WeakMap();
    const svgInversionCache = new WeakSet();
    const svgAnalysisConditionCache = new WeakMap();
    const themeProps = ["brightness", "contrast", "grayscale", "sepia", "mode"];
    function shouldAnalyzeSVGAsImage(svg) {
        if (svgAnalysisConditionCache.has(svg)) {
            return svgAnalysisConditionCache.get(svg);
        }
        const shouldAnalyze = Boolean(
            svg &&
            (svg.getAttribute("class")?.includes("logo") ||
                svg.parentElement?.getAttribute("class")?.includes("logo"))
        );
        svgAnalysisConditionCache.set(svg, shouldAnalyze);
        return shouldAnalyze;
    }
    let prevTheme$1 = null;
    let themeKey = "";
    function getThemeKey(theme) {
        if (theme === prevTheme$1) {
            return themeKey;
        }
        themeKey = "";
        for (let i = 0; i < themeProps.length; i++) {
            const prop = themeProps[i];
            themeKey += `${prop}="${theme[prop]}" `;
        }
        prevTheme$1 = theme;
        return themeKey;
    }
    function getInlineStyleCacheKey(el, theme) {
        const attrKey = INLINE_STYLE_ATTRS.filter((attr) =>
            el.hasAttribute(attr)
        ).map((attr) => `${attr}="${el.getAttribute(attr)}"`);
        return `${attrKey} ${getThemeKey(theme)}`;
    }
    function shouldIgnoreInlineStyle(element, selectors) {
        for (let i = 0, len = selectors.length; i < len; i++) {
            const ingnoredSelector = selectors[i];
            if (element.matches(ingnoredSelector)) {
                return true;
            }
        }
        return false;
    }
    const SMALL_SVG_THRESHOLD = 32;
    const svgNodesRoots = new WeakMap();
    const svgRootSizeTestResults = new WeakMap();
    function getSVGElementRoot(svgElement) {
        if (!svgElement) {
            return null;
        }
        if (svgNodesRoots.has(svgElement)) {
            return svgNodesRoots.get(svgElement);
        }
        if (svgElement instanceof SVGSVGElement) {
            return svgElement;
        }
        const parent = svgElement.parentNode;
        const root = getSVGElementRoot(parent);
        svgNodesRoots.set(svgElement, root);
        return root;
    }
    const inlineStringValueCache = new Map();
    const MAX_LOOP_TEARDOWNS = 10;
    const inlineStyleParents = new Map();
    let parentTeardownCounts = new WeakMap();
    function trackInlineStyleTeardown(element) {
        if (!element.parentElement) {
            return;
        }
        if (inlineStyleParents.size === 0) {
            queueMicrotask(checkForTeardown);
        }
        inlineStyleParents.set(element, element.parentElement);
    }
    function checkForTeardown() {
        inlineStyleParents.forEach((parent, element) => {
            if (element.isConnected || !parent.isConnected) {
                return;
            }
            const count = (parentTeardownCounts.get(parent) ?? 0) + 1;
            parentTeardownCounts.set(parent, count);
            if (count === MAX_LOOP_TEARDOWNS) {
                logWarn(
                    "Inline style change causes DOM teardown. Suspending changes for the container",
                    parent
                );
            }
        });
        inlineStyleParents.clear();
    }
    function parentHadTeardown(element) {
        const parent = element.parentElement;
        if (!parent) {
            return true;
        }
        return (parentTeardownCounts.get(parent) ?? 0) >= MAX_LOOP_TEARDOWNS;
    }
    function resetInlineStyleLoopDetection() {
        inlineStyleParents.clear();
        parentTeardownCounts = new WeakMap();
    }
    function overrideInlineStyle(
        element,
        theme,
        ignoreInlineSelectors,
        ignoreImageSelectors
    ) {
        if (parentHadTeardown(element)) {
            return;
        }
        if (element.parentElement?.dataset.nodeViewContent) {
            return;
        }
        const cacheKey = getInlineStyleCacheKey(element, theme);
        if (cacheKey === inlineStyleCache.get(element)) {
            return;
        }
        const unsetProps = new Set(Object.keys(overrides));
        function setCustomProp(targetCSSProp, modifierCSSProp, cssVal) {
            const cachedStringValue = inlineStringValueCache
                .get(modifierCSSProp)
                ?.get(cssVal);
            if (cachedStringValue) {
                setStaticValue(cachedStringValue);
                return;
            }
            asyncCancelled = false;
            const mod = getModifiableCSSDeclaration(
                modifierCSSProp,
                cssVal,
                {style: element.style},
                variablesStore,
                ignoreImageSelectors,
                isAsyncCancelled
            );
            if (!mod) {
                return;
            }
            function setStaticValue(value) {
                const {customProp, dataAttr} =
                    overrides[targetCSSProp] ??
                    shorthandOverrides[targetCSSProp];
                element.style.setProperty(customProp, value);
                if (!element.hasAttribute(dataAttr)) {
                    element.setAttribute(dataAttr, "");
                }
                trackInlineStyleTeardown(element);
                unsetProps.delete(targetCSSProp);
            }
            function setVarDeclaration(mod) {
                let prevDeclarations = [];
                function setProps(declarations) {
                    prevDeclarations.forEach(({property}) => {
                        element.style.removeProperty(property);
                    });
                    declarations.forEach(({property, value}) => {
                        if (!(value instanceof Promise)) {
                            element.style.setProperty(property, value);
                        }
                    });
                    prevDeclarations = declarations;
                }
                setProps(mod.declarations);
                mod.onTypeChange.addListener(setProps);
            }
            function setAsyncValue(promise, sourceValue) {
                promise.then((value) => {
                    if (
                        value &&
                        targetCSSProp === "background" &&
                        value.startsWith("var(--darkreader-bg--")
                    ) {
                        setStaticValue(value);
                    }
                    if (value && targetCSSProp === "background-image") {
                        if (
                            (element === document.documentElement ||
                                element === document.body) &&
                            value === sourceValue
                        ) {
                            value = "none";
                        }
                        setStaticValue(value);
                    }
                    inlineStyleCache.set(
                        element,
                        getInlineStyleCacheKey(element, theme)
                    );
                });
            }
            const value =
                typeof mod.value === "function" ? mod.value(theme) : mod.value;
            if (typeof value === "string") {
                setStaticValue(value);
                if (!inlineStringValueCache.has(modifierCSSProp)) {
                    inlineStringValueCache.set(modifierCSSProp, new Map());
                }
                inlineStringValueCache.get(modifierCSSProp).set(cssVal, value);
            } else if (value instanceof Promise) {
                setAsyncValue(value, cssVal);
            } else if (typeof value === "object") {
                setVarDeclaration(value);
            }
        }
        if (ignoreInlineSelectors.length > 0) {
            if (shouldIgnoreInlineStyle(element, ignoreInlineSelectors)) {
                unsetProps.forEach((cssProp) => {
                    element.removeAttribute(overrides[cssProp].dataAttr);
                });
                return;
            }
        }
        const isSVGElement = element instanceof SVGElement;
        const svg = isSVGElement
            ? (element.ownerSVGElement ??
              (element instanceof SVGSVGElement ? element : null))
            : null;
        if (isSVGElement && theme.mode === 1 && svg) {
            if (svgInversionCache.has(svg)) {
                return;
            }
            if (shouldAnalyzeSVGAsImage(svg)) {
                svgInversionCache.add(svg);
                const analyzeSVGAsImage = () => {
                    let svgString = svg.outerHTML;
                    svgString = svgString.replaceAll(
                        '<style class="darkreader darkreader--sync" media="screen"></style>',
                        ""
                    );
                    const dataURL = `data:image/svg+xml;base64,${btoa(svgString)}`;
                    getImageDetails(dataURL).then((details) => {
                        if (
                            (details.isDark && details.isTransparent) ||
                            (details.isLarge &&
                                details.isLight &&
                                !details.isTransparent)
                        ) {
                            svg.setAttribute(
                                "data-darkreader-inline-invert",
                                ""
                            );
                        } else {
                            svg.removeAttribute(
                                "data-darkreader-inline-invert"
                            );
                        }
                    });
                };
                analyzeSVGAsImage();
                if (!isDOMReady()) {
                    addDOMReadyListener(analyzeSVGAsImage);
                }
                return;
            }
        }
        if (element.hasAttribute("bgcolor")) {
            let value = element.getAttribute("bgcolor");
            if (
                value.match(/^[0-9a-f]{3}$/i) ||
                value.match(/^[0-9a-f]{6}$/i)
            ) {
                value = `#${value}`;
            }
            setCustomProp("background-color", "background-color", value);
        }
        if (
            (element === document.documentElement ||
                element === document.body) &&
            element.hasAttribute("background") &&
            element.getAttribute("background") !== ""
        ) {
            const url = getAbsoluteURL(
                location.href,
                element.getAttribute("background") ?? ""
            );
            const value = `url("${url}")`;
            setCustomProp("background-image", "background-image", value);
        }
        if (element.hasAttribute("color") && element.rel !== "mask-icon") {
            let value = element.getAttribute("color");
            if (
                value.match(/^[0-9a-f]{3}$/i) ||
                value.match(/^[0-9a-f]{6}$/i)
            ) {
                value = `#${value}`;
            } else if (value.match(/^#?[0-9a-f]{4}$/i)) {
                const hex = value.startsWith("#") ? value.substring(1) : value;
                value = `#${hex}00`;
            }
            setCustomProp("color", "color", value);
        }
        if (isSVGElement) {
            if (element.hasAttribute("fill")) {
                const value = element.getAttribute("fill");
                if (value !== "none" && value !== "currentColor") {
                    if (!(element instanceof SVGTextElement)) {
                        const handleSVGElement = () => {
                            let isSVGSmall = false;
                            const root = getSVGElementRoot(element);
                            if (!root) {
                                return;
                            }
                            if (svgRootSizeTestResults.has(root)) {
                                isSVGSmall = svgRootSizeTestResults.get(root);
                            } else {
                                const svgBounds = root.getBoundingClientRect();
                                isSVGSmall =
                                    svgBounds.width * svgBounds.height <=
                                    SMALL_SVG_THRESHOLD ** 2;
                                svgRootSizeTestResults.set(root, isSVGSmall);
                            }
                            let isBg;
                            if (isSVGSmall) {
                                isBg = false;
                            } else {
                                const {width, height} =
                                    element.getBoundingClientRect();
                                isBg =
                                    width > SMALL_SVG_THRESHOLD ||
                                    height > SMALL_SVG_THRESHOLD;
                            }
                            setCustomProp(
                                "fill",
                                isBg ? "background-color" : "color",
                                value
                            );
                        };
                        if (isReadyStateComplete()) {
                            handleSVGElement();
                        } else {
                            addReadyStateCompleteListener(handleSVGElement);
                        }
                    } else {
                        setCustomProp("fill", "color", value);
                    }
                }
            }
            if (element.hasAttribute("stop-color")) {
                setCustomProp(
                    "stop-color",
                    "background-color",
                    element.getAttribute("stop-color")
                );
            }
        }
        if (element.hasAttribute("stroke")) {
            const value = element.getAttribute("stroke");
            setCustomProp(
                "stroke",
                element instanceof SVGLineElement ||
                    element instanceof SVGTextElement
                    ? "border-color"
                    : "color",
                value
            );
        }
        element.style &&
            iterateCSSDeclarations(element.style, (property, value) => {
                if (property === "background-image" && value.includes("url")) {
                    if (
                        element === document.documentElement ||
                        element === document.body
                    ) {
                        setCustomProp(property, property, value);
                    }
                    return;
                }
                if (
                    overrides.hasOwnProperty(property) ||
                    (property.startsWith("--") && !normalizedPropList[property])
                ) {
                    setCustomProp(property, property, value);
                } else if (
                    shorthandOverrides[property] &&
                    value.includes("var(")
                ) {
                    setCustomProp(property, property, value);
                } else {
                    const overriddenProp = normalizedPropList[property];
                    if (
                        overriddenProp &&
                        !element.style.getPropertyValue(overriddenProp) &&
                        !element.hasAttribute(overriddenProp)
                    ) {
                        if (
                            overriddenProp === "background-color" &&
                            element.hasAttribute("bgcolor")
                        ) {
                            return;
                        }
                        element.style.setProperty(property, "");
                    }
                }
            });
        if (
            element.style &&
            element instanceof SVGTextElement &&
            element.style.fill
        ) {
            setCustomProp(
                "fill",
                "color",
                element.style.getPropertyValue("fill")
            );
        }
        if (element.getAttribute("style")?.includes("--")) {
            variablesStore.addInlineStyleForMatching(element.style);
        }
        forEach(unsetProps, (cssProp) => {
            element.removeAttribute(overrides[cssProp].dataAttr);
        });
        inlineStyleCache.set(element, getInlineStyleCacheKey(element, theme));
    }

    const metaThemeColorName = "theme-color";
    const metaThemeColorSelector = `meta[name="${metaThemeColorName}"]`;
    let srcMetaThemeColor = null;
    let observer = null;
    function changeMetaThemeColor(meta, theme) {
        srcMetaThemeColor = srcMetaThemeColor || meta.content;
        const color = parseColorWithCache(srcMetaThemeColor);
        if (!color) {
            logWarn("Invalid meta color", color);
            return;
        }
        meta.content = modifyBackgroundColor(color, theme, false);
    }
    function changeMetaThemeColorWhenAvailable(theme) {
        const meta = document.querySelector(metaThemeColorSelector);
        if (meta) {
            changeMetaThemeColor(meta, theme);
        } else {
            if (observer) {
                observer.disconnect();
            }
            observer = new MutationObserver((mutations) => {
                loop: for (let i = 0; i < mutations.length; i++) {
                    const {addedNodes} = mutations[i];
                    for (let j = 0; j < addedNodes.length; j++) {
                        const node = addedNodes[j];
                        if (
                            node instanceof HTMLMetaElement &&
                            node.name === metaThemeColorName
                        ) {
                            observer.disconnect();
                            observer = null;
                            changeMetaThemeColor(node, theme);
                            break loop;
                        }
                    }
                }
            });
            observer.observe(document.head, {childList: true});
        }
    }
    function restoreMetaThemeColor() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        const meta = document.querySelector(metaThemeColorSelector);
        if (meta && srcMetaThemeColor) {
            meta.content = srcMetaThemeColor;
        }
    }

    const filterSelectors = {
        invert: new Set(),
        dim: new Set(),
        none: new Set()
    };
    function addFilterSelector(selector, type) {
        if (!selector) {
            return;
        }
        const selectors = filterSelectors[type];
        let changed = false;
        selector.split(",").forEach((part) => {
            const s = part.trim();
            if (!s || selectors.has(s)) {
                return;
            }
            for (const existing of selectors) {
                if (isSelectorWithin(s, existing)) {
                    return;
                }
            }
            for (const existing of [...selectors]) {
                if (isSelectorWithin(existing, s)) {
                    selectors.delete(existing);
                }
            }
            selectors.add(s);
            changed = true;
        });
        return changed;
    }
    function isSelectorWithin(sub, parent) {
        const parentLength = parent.length;
        const subLength = sub.length;
        if (subLength < parentLength || !sub.startsWith(parent)) {
            return false;
        }
        if (subLength === parentLength) {
            return true;
        }
        let i = parentLength;
        const c = sub[i];
        if (c === "." || c === ":" || c === "#" || c === "[" || c === ">") {
            return true;
        }
        if (c === "+" || c === "~" || c !== " ") {
            return false;
        }
        while (sub[i] === " ") {
            i++;
        }
        return sub[i] !== "+" && sub[i] !== "~";
    }
    function cleanFilterSelectors() {
        filterSelectors.invert.clear();
        filterSelectors.dim.clear();
        filterSelectors.none.clear();
    }

    const cssCommentsRegex = /\/\*[\s\S]*?\*\//g;
    function removeCSSComments(cssText) {
        return cssText.replace(cssCommentsRegex, "");
    }

    let canUseSheetProxy = false;
    document.addEventListener(
        "__darkreader__inlineScriptsAllowed",
        () => (canUseSheetProxy = true),
        {once: true}
    );
    function createSheetWatcher(
        element,
        safeGetSheetRules,
        callback,
        isCancelled
    ) {
        let rafSheetWatcher = null;
        function watchForSheetChanges() {
            watchForSheetChangesUsingProxy();
            if (!(canUseSheetProxy && element.sheet)) {
                rafSheetWatcher = createRAFSheetWatcher(
                    element,
                    safeGetSheetRules,
                    callback,
                    isCancelled
                );
                rafSheetWatcher.start();
            }
        }
        let areSheetChangesPending = false;
        function onSheetChange() {
            canUseSheetProxy = true;
            rafSheetWatcher?.stop();
            if (areSheetChangesPending) {
                return;
            }
            function handleSheetChanges() {
                areSheetChangesPending = false;
                if (isCancelled()) {
                    return;
                }
                callback();
            }
            areSheetChangesPending = true;
            queueMicrotask(handleSheetChanges);
        }
        function watchForSheetChangesUsingProxy() {
            element.addEventListener(
                "__darkreader__updateSheet",
                onSheetChange
            );
        }
        function stopWatchingForSheetChangesUsingProxy() {
            element.removeEventListener(
                "__darkreader__updateSheet",
                onSheetChange
            );
        }
        function stopWatchingForSheetChanges() {
            stopWatchingForSheetChangesUsingProxy();
            rafSheetWatcher?.stop();
        }
        return {
            start: watchForSheetChanges,
            stop: stopWatchingForSheetChanges
        };
    }
    function createRAFSheetWatcher(
        element,
        safeGetSheetRules,
        callback,
        isCancelled
    ) {
        let rulesChangeKey = null;
        let rulesCheckFrameId = null;
        function getRulesChangeKey() {
            const rules = safeGetSheetRules();
            return rules ? rules.length : null;
        }
        function didRulesKeyChange() {
            return getRulesChangeKey() !== rulesChangeKey;
        }
        function watchForSheetChangesUsingRAF() {
            rulesChangeKey = getRulesChangeKey();
            stopWatchingForSheetChangesUsingRAF();
            const checkForUpdate = () => {
                const cancelled = isCancelled();
                if (!cancelled && didRulesKeyChange()) {
                    rulesChangeKey = getRulesChangeKey();
                    callback();
                }
                if (cancelled || (canUseSheetProxy && element.sheet)) {
                    stopWatchingForSheetChangesUsingRAF();
                    return;
                }
                rulesCheckFrameId = requestAnimationFrame(checkForUpdate);
            };
            checkForUpdate();
        }
        function stopWatchingForSheetChangesUsingRAF() {
            rulesCheckFrameId && cancelAnimationFrame(rulesCheckFrameId);
        }
        return {
            start: watchForSheetChangesUsingRAF,
            stop: stopWatchingForSheetChangesUsingRAF
        };
    }

    const STYLE_SELECTOR = 'style, link[rel*="stylesheet" i]:not([disabled])';
    let ignoredCSSURLPatterns = [];
    function setIgnoredCSSURLs(patterns) {
        ignoredCSSURLPatterns = patterns || [];
    }
    function shouldIgnoreCSSURL(url) {
        if (!url || ignoredCSSURLPatterns.length === 0) {
            return false;
        }
        for (const pattern of ignoredCSSURLPatterns) {
            if (pattern.startsWith("^")) {
                if (url.startsWith(pattern.slice(1))) {
                    return true;
                }
            } else if (pattern.endsWith("$")) {
                if (url.endsWith(pattern.slice(0, -1))) {
                    return true;
                }
            } else if (url.includes(pattern)) {
                return true;
            }
        }
        return false;
    }
    const hostsBreakingOnSVGStyleOverride = [
        "account.containerstore.com",
        "containerstore.com",
        "www.onet.pl"
    ];
    function shouldManageStyle(element) {
        return (
            (element instanceof HTMLStyleElement ||
                (element instanceof SVGStyleElement &&
                    !hostsBreakingOnSVGStyleOverride.includes(
                        location.hostname
                    )) ||
                (element instanceof HTMLLinkElement &&
                    Boolean(element.rel) &&
                    element.rel.toLowerCase().includes("stylesheet") &&
                    Boolean(element.href) &&
                    !element.disabled &&
                    (isFirefox
                        ? !element.href.startsWith("moz-extension://")
                        : true) &&
                    !shouldIgnoreCSSURL(element.href))) &&
            !element.classList.contains("darkreader") &&
            !ignoredMedia.includes(element.media.toLowerCase()) &&
            !element.classList.contains("stylus")
        );
    }
    function getManageableStyles(node, results = [], deep = true) {
        if (shouldManageStyle(node)) {
            results.push(node);
        } else if (
            node instanceof Element ||
            (isShadowDomSupported && node instanceof ShadowRoot) ||
            node === document
        ) {
            forEach(node.querySelectorAll(STYLE_SELECTOR), (style) =>
                getManageableStyles(style, results, false)
            );
            if (deep && (node.children?.length > 0 || node.shadowRoot)) {
                iterateShadowHosts(node, (host) =>
                    getManageableStyles(host.shadowRoot, results, false)
                );
            }
        }
        return results;
    }
    const syncStyleSet = new WeakSet();
    const corsCopies = new WeakMap();
    const corsCopiesTextLengths = new WeakMap();
    let loadingLinkCounter = 0;
    const rejectorsForLoadingLinks = new Map();
    function cleanLoadingLinks() {
        rejectorsForLoadingLinks.clear();
    }
    function manageStyle(element, {update, loadingStart, loadingEnd}) {
        const inMode = getStyleInjectionMode();
        let syncStyle = null;
        if (inMode === "next") {
            const prevStyles = [];
            let next = element;
            while (
                (next = next.nextElementSibling) &&
                next.matches(".darkreader")
            ) {
                prevStyles.push(next);
            }
            syncStyle =
                prevStyles.find(
                    (el) =>
                        el.matches(".darkreader--sync") && !syncStyleSet.has(el)
                ) || null;
        }
        let syncStylePositionWatcher = null;
        let cancelAsyncOperations = false;
        let isOverrideEmpty = true;
        const isAsyncCancelled = () => cancelAsyncOperations;
        const sheetModifier = createStyleSheetModifier();
        const observer = new MutationObserver((mutations) => {
            if (
                mutations.some((m) => m.type === "characterData") &&
                containsCSSImport()
            ) {
                const cssText = (element.textContent ?? "").trim();
                createOrUpdateCORSCopy(cssText, location.href).then(update);
            } else {
                update();
            }
        });
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        };
        function containsCSSImport() {
            if (!(element instanceof HTMLStyleElement)) {
                return false;
            }
            const cssText = removeCSSComments(element.textContent ?? "").trim();
            return cssText.match(cssImportRegex);
        }
        function hasImports(cssRules, checkCrossOrigin) {
            let result = false;
            if (cssRules) {
                let rule;
                cssRulesLoop: for (
                    let i = 0, len = cssRules.length;
                    i < len;
                    i++
                ) {
                    rule = cssRules[i];
                    if (rule.href) {
                        if (checkCrossOrigin) {
                            if (
                                !rule.href.startsWith(
                                    "https://fonts.googleapis.com/"
                                ) &&
                                rule.href.startsWith("http") &&
                                !rule.href.startsWith(location.origin)
                            ) {
                                result = true;
                                break cssRulesLoop;
                            }
                        } else {
                            result = true;
                            break cssRulesLoop;
                        }
                    }
                }
            }
            return result;
        }
        function getRulesSync() {
            if (corsCopies.has(element)) {
                return corsCopies.get(element).cssRules;
            }
            if (containsCSSImport()) {
                return null;
            }
            const cssRules = safeGetSheetRules();
            if (
                element instanceof HTMLLinkElement &&
                !isRelativeHrefOnAbsolutePath(element.href) &&
                hasImports(cssRules, false)
            ) {
                return null;
            }
            if (hasImports(cssRules, true)) {
                return null;
            }
            !cssRules &&
                logWarn("[getRulesSync] cssRules is null, trying again.");
            return cssRules;
        }
        function insertStyle() {
            if (inMode === "next") {
                if (element.nextSibling !== syncStyle) {
                    element.parentNode.insertBefore(
                        syncStyle,
                        element.nextSibling
                    );
                }
            } else if (inMode === "away") {
                injectStyleAway(syncStyle);
            }
        }
        function createSyncStyle() {
            syncStyle =
                element instanceof SVGStyleElement
                    ? document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "style"
                      )
                    : document.createElement("style");
            syncStyle.classList.add("darkreader");
            syncStyle.classList.add("darkreader--sync");
            syncStyle.media = "screen";
            if (element.title) {
                syncStyle.title = element.title;
            }
            syncStyleSet.add(syncStyle);
        }
        let isLoadingRules = false;
        let wasLoadingError = false;
        const loadingLinkId = ++loadingLinkCounter;
        async function getRulesAsync() {
            let cssText;
            let cssBasePath;
            if (element instanceof HTMLLinkElement) {
                let [cssRules, accessError] = getRulesOrError();
                if (accessError) {
                    logWarn(accessError);
                }
                if (
                    (isSafari && !element.sheet) ||
                    (!isSafari && !cssRules && !accessError) ||
                    isStillLoadingError(accessError)
                ) {
                    try {
                        logInfo(
                            `Linkelement ${loadingLinkId} is not loaded yet and thus will be await for`,
                            element
                        );
                        await linkLoading(element, loadingLinkId);
                    } catch (err) {
                        logWarn(err);
                        wasLoadingError = true;
                    }
                    if (cancelAsyncOperations) {
                        return null;
                    }
                    [cssRules, accessError] = getRulesOrError();
                    if (accessError) {
                        logWarn(accessError);
                    }
                }
                if (cssRules) {
                    if (!hasImports(cssRules, false)) {
                        return cssRules;
                    }
                }
                try {
                    cssText = await loadText(element.href);
                } catch (err) {
                    logWarn(err);
                    cssText = "";
                }
                cssBasePath = getCSSBaseBath(element.href);
                if (cancelAsyncOperations) {
                    return null;
                }
            } else if (containsCSSImport()) {
                cssText = element.textContent.trim();
                cssBasePath = getCSSBaseBath(location.href);
            } else {
                return null;
            }
            await createOrUpdateCORSCopy(cssText, cssBasePath);
            if (corsCopies.has(element)) {
                return corsCopies.get(element).cssRules;
            }
            return null;
        }
        async function createOrUpdateCORSCopy(cssText, cssBasePath) {
            if (cssText) {
                try {
                    const fullCSSText = await replaceCSSImports(
                        cssText,
                        cssBasePath
                    );
                    if (corsCopies.has(element)) {
                        if (
                            (corsCopiesTextLengths.get(element) ?? 0) <
                            fullCSSText.length
                        ) {
                            corsCopies.get(element).replaceSync(fullCSSText);
                            corsCopiesTextLengths.set(
                                element,
                                fullCSSText.length
                            );
                        }
                    } else {
                        const corsCopy = new CSSStyleSheet();
                        corsCopy.replaceSync(fullCSSText);
                        corsCopies.set(element, corsCopy);
                    }
                } catch (err) {
                    logWarn(err);
                }
            }
        }
        function details(options) {
            const rules = getRulesSync();
            if (!rules) {
                if (options.secondRound) {
                    logWarn(
                        "Detected dead-lock at details(), returning early to prevent it."
                    );
                    return null;
                }
                if (isLoadingRules || wasLoadingError) {
                    return null;
                }
                isLoadingRules = true;
                loadingStart();
                getRulesAsync()
                    .then((results) => {
                        isLoadingRules = false;
                        loadingEnd();
                        if (results) {
                            update();
                        }
                    })
                    .catch((err) => {
                        logWarn(err);
                        isLoadingRules = false;
                        loadingEnd();
                    });
                return null;
            }
            return {rules};
        }
        let forceRenderStyle = false;
        function render(theme, ignoreImageAnalysis) {
            const rules = getRulesSync();
            if (!rules) {
                return;
            }
            cancelAsyncOperations = false;
            function removeCSSRulesFromSheet(sheet) {
                if (!sheet) {
                    return;
                }
                for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                    sheet.deleteRule(i);
                }
            }
            function prepareOverridesSheet() {
                if (!syncStyle) {
                    createSyncStyle();
                }
                syncStylePositionWatcher && syncStylePositionWatcher.stop();
                insertStyle();
                if (syncStyle.sheet == null) {
                    syncStyle.textContent = "";
                }
                const sheet = syncStyle.sheet;
                removeCSSRulesFromSheet(sheet);
                if (syncStylePositionWatcher) {
                    syncStylePositionWatcher.run();
                } else if (inMode === "next") {
                    syncStylePositionWatcher = watchForNodePosition(
                        syncStyle,
                        "prev-sibling",
                        () => {
                            forceRenderStyle = true;
                            buildOverrides();
                        }
                    );
                }
                return syncStyle.sheet;
            }
            function buildOverrides() {
                const force = forceRenderStyle;
                forceRenderStyle = false;
                sheetModifier.modifySheet({
                    prepareSheet: prepareOverridesSheet,
                    sourceCSSRules: rules,
                    theme,
                    ignoreImageAnalysis,
                    force,
                    isAsyncCancelled
                });
                isOverrideEmpty =
                    !syncStyle.sheet || syncStyle.sheet.cssRules.length === 0;
                if (sheetModifier.shouldRebuildStyle()) {
                    addReadyStateCompleteListener(() => update());
                }
            }
            buildOverrides();
        }
        function getRulesOrError() {
            try {
                if (element.sheet == null) {
                    return [null, null];
                }
                return [element.sheet.cssRules, null];
            } catch (err) {
                return [null, err];
            }
        }
        function isStillLoadingError(error) {
            return error && error.message && error.message.includes("loading");
        }
        function safeGetSheetRules() {
            const [cssRules, err] = getRulesOrError();
            if (err) {
                logWarn(err);
                return null;
            }
            return cssRules;
        }
        const sheetChangeWatcher = createSheetWatcher(
            element,
            safeGetSheetRules,
            update,
            isAsyncCancelled
        );
        function pause() {
            observer.disconnect();
            cancelAsyncOperations = true;
            syncStylePositionWatcher && syncStylePositionWatcher.stop();
            sheetChangeWatcher.stop();
        }
        function destroy() {
            pause();
            corsCopies.delete(element);
            removeNode(syncStyle);
            loadingEnd();
            if (rejectorsForLoadingLinks.has(loadingLinkId)) {
                const reject = rejectorsForLoadingLinks.get(loadingLinkId);
                rejectorsForLoadingLinks.delete(loadingLinkId);
                reject && reject();
            }
        }
        function watch() {
            observer.observe(element, observerOptions);
            if (element instanceof HTMLStyleElement) {
                sheetChangeWatcher.start();
            }
        }
        const maxMoveCount = 10;
        let moveCount = 0;
        function restore() {
            if (!syncStyle) {
                return;
            }
            moveCount++;
            if (moveCount > maxMoveCount) {
                logWarn("Style sheet was moved multiple times", element);
                return;
            }
            logWarn("Restore style", syncStyle, element);
            insertStyle();
            syncStylePositionWatcher && syncStylePositionWatcher.skip();
            if (!isOverrideEmpty) {
                forceRenderStyle = true;
                update();
            }
        }
        return {
            details,
            render,
            pause,
            destroy,
            watch,
            restore
        };
    }
    async function linkLoading(link, loadingId) {
        return new Promise((resolve, reject) => {
            const cleanUp = () => {
                link.removeEventListener("load", onLoad);
                link.removeEventListener("error", onError);
                rejectorsForLoadingLinks.delete(loadingId);
            };
            const onLoad = () => {
                cleanUp();
                resolve();
            };
            const onError = () => {
                cleanUp();
                reject(
                    `Linkelement ${loadingId} couldn't be loaded. ${link.href}`
                );
            };
            rejectorsForLoadingLinks.set(loadingId, () => {
                cleanUp();
                reject();
            });
            link.addEventListener("load", onLoad, {passive: true});
            link.addEventListener("error", onError, {passive: true});
            if (!link.href) {
                onError();
            }
        });
    }
    function getCSSImportURL(importDeclaration) {
        return getCSSURLValue(
            importDeclaration
                .substring(7)
                .trim()
                .replace(/;$/, "")
                .replace(/screen$/, "")
        );
    }
    async function loadText(url) {
        if (url.startsWith("data:")) {
            return await (await fetch(url)).text();
        }
        const cache = readCSSFetchCache(url);
        if (cache) {
            return cache;
        }
        const parsedURL = new URL(url);
        let text;
        if (parsedURL.origin === location.origin) {
            text = await loadAsText(url, "text/css", location.origin);
        } else {
            text = await bgFetch({
                url,
                responseType: "text",
                mimeType: "text/css",
                origin: location.origin
            });
        }
        if (parsedURL.origin === location.origin) {
            writeCSSFetchCache(url, text);
        }
        return text;
    }
    const MAX_CSS_IMPORT_DEPTH = 32;
    async function replaceCSSImports(
        cssText,
        basePath,
        cache = new Map(),
        depth = 0
    ) {
        if (depth > MAX_CSS_IMPORT_DEPTH) {
            return "";
        }
        cssText = removeCSSComments(cssText);
        cssText = replaceCSSFontFace(cssText);
        cssText = replaceCSSRelativeURLsWithAbsolute(cssText, basePath);
        const importMatches = getMatchesWithOffsets(cssImportRegex, cssText);
        let prev = null;
        let shouldIgnoreImportsInBetween = false;
        let diff = 0;
        for (const match of importMatches) {
            let importedCSS;
            const prevImportEnd = prev ? prev.offset + prev.text.length : 0;
            const nextImportStart = match.offset;
            const openBraceIndex = cssText.indexOf("{", prevImportEnd);
            const closeBraceIndex = cssText.indexOf("}", prevImportEnd);
            if (
                shouldIgnoreImportsInBetween ||
                (openBraceIndex >= 0 &&
                    openBraceIndex < nextImportStart &&
                    closeBraceIndex >= 0 &&
                    closeBraceIndex < nextImportStart)
            ) {
                shouldIgnoreImportsInBetween = true;
                importedCSS = "";
            } else {
                const importURL = getCSSImportURL(match.text);
                const absoluteURL = getAbsoluteURL(basePath, importURL);
                if (cache.has(absoluteURL)) {
                    importedCSS = cache.get(absoluteURL);
                } else {
                    try {
                        importedCSS = await loadText(absoluteURL);
                        cache.set(absoluteURL, importedCSS);
                        importedCSS = await replaceCSSImports(
                            importedCSS,
                            getCSSBaseBath(absoluteURL),
                            cache,
                            depth + 1
                        );
                    } catch (err) {
                        logWarn(err);
                        importedCSS = "";
                    }
                }
            }
            cssText =
                cssText.substring(0, match.offset + diff) +
                importedCSS +
                cssText.substring(match.offset + match.text.length + diff);
            diff += importedCSS.length - match.text.length;
            prev = match;
        }
        cssText = cssText.trim();
        return cssText;
    }

    function injectProxy(
        enableStyleSheetsProxy,
        enableCustomElementRegistryProxy
    ) {
        document.dispatchEvent(
            new CustomEvent("__darkreader__inlineScriptsAllowed")
        );
        const cleaners = [];
        function cleanUp() {
            cleaners.forEach((clean) => clean());
            cleaners.splice(0);
        }
        function documentEventListener(type, listener, options) {
            document.addEventListener(type, listener, options);
            cleaners.push(() => document.removeEventListener(type, listener));
        }
        function disableConflictingPlugins() {
            const disableWPDarkMode = () => {
                if (window?.WPDarkMode?.deactivate) {
                    window.WPDarkMode.deactivate();
                }
            };
            disableWPDarkMode();
        }
        documentEventListener("__darkreader__cleanUp", cleanUp);
        documentEventListener(
            "__darkreader__disableConflictingPlugins",
            disableConflictingPlugins
        );
        function overrideProperty(cls, prop, overrides) {
            const proto = cls.prototype;
            const oldDescriptor = Object.getOwnPropertyDescriptor(proto, prop);
            if (!oldDescriptor) {
                return;
            }
            const newDescriptor = {...oldDescriptor};
            Object.keys(overrides).forEach((key) => {
                const factory = overrides[key];
                newDescriptor[key] = factory(oldDescriptor[key]);
            });
            Object.defineProperty(proto, prop, newDescriptor);
            cleaners.push(() =>
                Object.defineProperty(proto, prop, oldDescriptor)
            );
        }
        function override(cls, prop, factory) {
            overrideProperty(cls, prop, {value: factory});
        }
        function isDRElement(element) {
            return element?.classList?.contains("darkreader");
        }
        function isDRSheet(sheet) {
            return isDRElement(sheet.ownerNode);
        }
        const updateSheetEvent = new CustomEvent("__darkreader__updateSheet");
        const adoptedSheetChangeEvent = new CustomEvent(
            "__darkreader__adoptedStyleSheetChange"
        );
        const shadowDomAttachingEvent = new CustomEvent(
            "__darkreader__shadowDomAttaching",
            {bubbles: true}
        );
        const adoptedSheetOwners = new WeakMap();
        const adoptedDeclarationSheets = new WeakMap();
        function onAdoptedSheetChange(sheet) {
            const owners = adoptedSheetOwners.get(sheet);
            owners?.forEach((node) => {
                if (node.isConnected) {
                    node.dispatchEvent(adoptedSheetChangeEvent);
                } else {
                    owners.delete(node);
                }
            });
        }
        function reportSheetChange(sheet) {
            if (sheet.ownerNode && !isDRSheet(sheet)) {
                sheet.ownerNode.dispatchEvent(updateSheetEvent);
            }
            if (adoptedSheetOwners.has(sheet)) {
                onAdoptedSheetChange(sheet);
            }
        }
        function reportSheetChangeAsync(sheet, promise) {
            const {ownerNode} = sheet;
            if (
                ownerNode &&
                !isDRSheet(sheet) &&
                promise &&
                promise instanceof Promise
            ) {
                promise.then(() => ownerNode.dispatchEvent(updateSheetEvent));
            }
            if (adoptedSheetOwners.has(sheet)) {
                if (promise && promise instanceof Promise) {
                    promise.then(() => onAdoptedSheetChange(sheet));
                }
            }
        }
        override(
            CSSStyleSheet,
            "addRule",
            (native) =>
                function (selector, style, index) {
                    native.call(this, selector, style, index);
                    reportSheetChange(this);
                    return -1;
                }
        );
        override(
            CSSStyleSheet,
            "insertRule",
            (native) =>
                function (rule, index) {
                    const returnValue = native.call(this, rule, index);
                    reportSheetChange(this);
                    return returnValue;
                }
        );
        override(
            CSSStyleSheet,
            "deleteRule",
            (native) =>
                function (index) {
                    native.call(this, index);
                    reportSheetChange(this);
                }
        );
        override(
            CSSStyleSheet,
            "removeRule",
            (native) =>
                function (index) {
                    native.call(this, index);
                    reportSheetChange(this);
                }
        );
        override(
            CSSStyleSheet,
            "replace",
            (native) =>
                function (cssText) {
                    const returnValue = native.call(this, cssText);
                    reportSheetChangeAsync(this, returnValue);
                    return returnValue;
                }
        );
        override(
            CSSStyleSheet,
            "replaceSync",
            (native) =>
                function (cssText) {
                    native.call(this, cssText);
                    reportSheetChange(this);
                }
        );
        override(
            Element,
            "attachShadow",
            (native) =>
                function (options) {
                    this.dispatchEvent(shadowDomAttachingEvent);
                    return native.call(this, options);
                }
        );
        const shouldWrapHTMLElement =
            location.hostname === "baidu.com" ||
            location.hostname.endsWith(".baidu.com");
        if (shouldWrapHTMLElement) {
            override(
                Element,
                "getElementsByTagName",
                (native) =>
                    function (tagName) {
                        if (tagName !== "style") {
                            return native.call(this, tagName);
                        }
                        const getCurrentElementValue = () => {
                            const elements = native.call(this, tagName);
                            return Object.setPrototypeOf(
                                [...elements].filter(
                                    (element) =>
                                        element && !isDRElement(element)
                                ),
                                NodeList.prototype
                            );
                        };
                        let elements = getCurrentElementValue();
                        const nodeListBehavior = {
                            get: function (_, property) {
                                return getCurrentElementValue()[property];
                            }
                        };
                        elements = new Proxy(elements, nodeListBehavior);
                        return elements;
                    }
            );
        }
        const shouldProxyChildNodes = ["brilliant.org", "www.vy.no"].includes(
            location.hostname
        );
        if (shouldProxyChildNodes) {
            overrideProperty(Node, "childNodes", {
                get: (native) =>
                    function () {
                        const childNodes = native.call(this);
                        return Object.setPrototypeOf(
                            [...childNodes].filter((element) => {
                                return !isDRElement(element);
                            }),
                            NodeList.prototype
                        );
                    }
            });
        }
        function resolveCustomElement(tag) {
            customElements.whenDefined(tag).then(() => {
                document.dispatchEvent(
                    new CustomEvent("__darkreader__isDefined", {detail: {tag}})
                );
            });
        }
        documentEventListener("__darkreader__addUndefinedResolver", (e) =>
            resolveCustomElement(e.detail.tag)
        );
        if (enableCustomElementRegistryProxy) {
            override(
                CustomElementRegistry,
                "define",
                (native) =>
                    function (name, constructor, options) {
                        resolveCustomElement(name);
                        native.call(this, name, constructor, options);
                    }
            );
        }
        let blobURLAllowed = null;
        function checkBlobURLSupport() {
            if (blobURLAllowed != null) {
                document.dispatchEvent(
                    new CustomEvent("__darkreader__blobURLCheckResponse", {
                        detail: {blobURLAllowed}
                    })
                );
                return;
            }
            const svg =
                '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="transparent"/></svg>';
            const bytes = new Uint8Array(svg.length);
            for (let i = 0; i < svg.length; i++) {
                bytes[i] = svg.charCodeAt(i);
            }
            const blob = new Blob([bytes], {type: "image/svg+xml"});
            const objectURL = URL.createObjectURL(blob);
            const image = new Image();
            image.onload = () => {
                blobURLAllowed = true;
                sendBlobURLCheckResponse();
            };
            image.onerror = () => {
                blobURLAllowed = false;
                sendBlobURLCheckResponse();
            };
            image.src = objectURL;
        }
        function sendBlobURLCheckResponse() {
            document.dispatchEvent(
                new CustomEvent("__darkreader__blobURLCheckResponse", {
                    detail: {blobURLAllowed}
                })
            );
        }
        documentEventListener(
            "__darkreader__blobURLCheckRequest",
            checkBlobURLSupport
        );
        if (enableStyleSheetsProxy) {
            overrideProperty(Document, "styleSheets", {
                get: (native) =>
                    function () {
                        let filteredSheetsCache = null;
                        let docSheets = null;
                        const didChange = (newSheets) => {
                            if (
                                !filteredSheetsCache ||
                                !docSheets ||
                                docSheets.length !== newSheets.length
                            ) {
                                return true;
                            }
                            for (let i = 0; i < docSheets.length; i++) {
                                if (docSheets[i] !== newSheets[i]) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        const getCurrentValue = () => {
                            const nativeDocSheets = native.call(this);
                            if (!didChange(nativeDocSheets)) {
                                return filteredSheetsCache;
                            }
                            docSheets = Array.from(nativeDocSheets);
                            const filteredSheets = docSheets.filter(
                                (styleSheet) =>
                                    styleSheet.ownerNode &&
                                    !isDRSheet(styleSheet)
                            );
                            filteredSheets.item = (item) =>
                                filteredSheets[item];
                            filteredSheetsCache = Object.setPrototypeOf(
                                filteredSheets,
                                StyleSheetList.prototype
                            );
                            return filteredSheetsCache;
                        };
                        const styleSheetListBehavior = {
                            get: function (_, property) {
                                return getCurrentValue()[property];
                            }
                        };
                        return new Proxy(
                            getCurrentValue(),
                            styleSheetListBehavior
                        );
                    }
            });
        }
        const adoptedSheetsSourceProxies = new WeakMap();
        const adoptedSheetsProxySources = new WeakMap();
        const adoptedSheetsChangeEvent = new CustomEvent(
            "__darkreader__adoptedStyleSheetsChange"
        );
        const adoptedSheetOverrideCache = new WeakSet();
        const adoptedSheetsSnapshots = new WeakMap();
        const isDRAdoptedSheetOverride = (sheet) => {
            if (!sheet || !sheet.cssRules) {
                return false;
            }
            if (adoptedSheetOverrideCache.has(sheet)) {
                return true;
            }
            if (
                sheet.cssRules.length > 0 &&
                sheet.cssRules[0].cssText.startsWith(
                    "#__darkreader__adoptedOverride"
                )
            ) {
                adoptedSheetOverrideCache.add(sheet);
                return true;
            }
            return false;
        };
        const areArraysEqual = (a, b) => {
            return a.length === b.length && a.every((x, i) => x === b[i]);
        };
        const onAdoptedSheetsChange = (node) => {
            const prev = adoptedSheetsSnapshots.get(node);
            const curr = (node.adoptedStyleSheets || []).filter(
                (s) => !isDRAdoptedSheetOverride(s)
            );
            adoptedSheetsSnapshots.set(node, curr);
            if (!prev || !areArraysEqual(prev, curr)) {
                curr.forEach((sheet) => {
                    if (!adoptedSheetOwners.has(sheet)) {
                        adoptedSheetOwners.set(sheet, new Set());
                    }
                    adoptedSheetOwners.get(sheet).add(node);
                    for (const rule of sheet.cssRules) {
                        const declaration = rule.style;
                        if (declaration) {
                            adoptedDeclarationSheets.set(declaration, sheet);
                        }
                    }
                });
                node.dispatchEvent(adoptedSheetsChangeEvent);
            }
        };
        const proxyAdoptedSheetsArray = (node, source) => {
            if (adoptedSheetsProxySources.has(source)) {
                return source;
            }
            if (adoptedSheetsSourceProxies.has(source)) {
                return adoptedSheetsSourceProxies.get(source);
            }
            const proxy = new Proxy(source, {
                deleteProperty(target, property) {
                    delete target[property];
                    return true;
                },
                set(target, property, value) {
                    target[property] = value;
                    if (property === "length") {
                        onAdoptedSheetsChange(node);
                    }
                    return true;
                }
            });
            adoptedSheetsSourceProxies.set(source, proxy);
            adoptedSheetsProxySources.set(proxy, source);
            return proxy;
        };
        [Document, ShadowRoot].forEach((ctor) => {
            overrideProperty(ctor, "adoptedStyleSheets", {
                get: (native) =>
                    function () {
                        const source = native.call(this);
                        return proxyAdoptedSheetsArray(this, source);
                    },
                set: (native) =>
                    function (source) {
                        if (adoptedSheetsProxySources.has(source)) {
                            source = adoptedSheetsProxySources.get(source);
                        }
                        native.call(this, source);
                        onAdoptedSheetsChange(this);
                    }
            });
        });
        const adoptedDeclarationChangeEvent = new CustomEvent(
            "__darkreader__adoptedStyleDeclarationChange"
        );
        ["setProperty", "removeProperty"].forEach((key) => {
            override(CSSStyleDeclaration, key, (native) => {
                return function (...args) {
                    const returnValue = native.apply(this, args);
                    const sheet = adoptedDeclarationSheets.get(this);
                    if (sheet) {
                        const owners = adoptedSheetOwners.get(sheet);
                        if (owners) {
                            owners.forEach((node) => {
                                node.dispatchEvent(
                                    adoptedDeclarationChangeEvent
                                );
                            });
                        }
                    }
                    return returnValue;
                };
            });
        });
    }

    const definedCustomElements = new Set();
    const undefinedGroups = new Map();
    let elementsDefinitionCallback;
    function isCustomElement(element) {
        if (element.tagName.includes("-") || element.getAttribute("is")) {
            return true;
        }
        return false;
    }
    function recordUndefinedElement(element) {
        let tag = element.tagName.toLowerCase();
        if (!tag.includes("-")) {
            const extendedTag = element.getAttribute("is");
            if (extendedTag) {
                tag = extendedTag;
            } else {
                return;
            }
        }
        if (!undefinedGroups.has(tag)) {
            undefinedGroups.set(tag, new Set());
            customElementsWhenDefined(tag).then(() => {
                if (elementsDefinitionCallback) {
                    const elements = undefinedGroups.get(tag);
                    undefinedGroups.delete(tag);
                    elementsDefinitionCallback(Array.from(elements));
                }
            });
        }
        undefinedGroups.get(tag).add(element);
    }
    function collectUndefinedElements(root) {
        if (!isDefinedSelectorSupported) {
            return;
        }
        forEach(
            root.querySelectorAll(":not(:defined)"),
            recordUndefinedElement
        );
    }
    let canOptimizeUsingProxy = false;
    document.addEventListener(
        "__darkreader__inlineScriptsAllowed",
        () => {
            canOptimizeUsingProxy = true;
        },
        {once: true, passive: true}
    );
    const unhandledShadowHosts = new Set();
    document.addEventListener("__darkreader__shadowDomAttaching", (e) => {
        const host = e.target;
        if (unhandledShadowHosts.size === 0) {
            queueMicrotask(() => {
                const hosts = [...unhandledShadowHosts].filter(
                    (el) => el.shadowRoot
                );
                elementsDefinitionCallback?.(hosts);
                unhandledShadowHosts.clear();
            });
        }
        unhandledShadowHosts.add(host);
    });
    const resolvers = new Map();
    function handleIsDefined(e) {
        canOptimizeUsingProxy = true;
        const tag = e.detail.tag;
        definedCustomElements.add(tag);
        if (resolvers.has(tag)) {
            const r = resolvers.get(tag);
            resolvers.delete(tag);
            r.forEach((r) => r());
        }
    }
    async function customElementsWhenDefined(tag) {
        if (definedCustomElements.has(tag)) {
            return;
        }
        return new Promise((resolve) => {
            if (
                window.customElements &&
                typeof customElements.whenDefined === "function"
            ) {
                customElements.whenDefined(tag).then(() => resolve());
            } else if (canOptimizeUsingProxy) {
                if (resolvers.has(tag)) {
                    resolvers.get(tag).push(resolve);
                } else {
                    resolvers.set(tag, [resolve]);
                }
                document.dispatchEvent(
                    new CustomEvent("__darkreader__addUndefinedResolver", {
                        detail: {tag}
                    })
                );
            } else {
                const checkIfDefined = () => {
                    const elements = undefinedGroups.get(tag);
                    if (elements && elements.size > 0) {
                        if (
                            elements.values().next().value.matches(":defined")
                        ) {
                            resolve();
                        } else {
                            requestAnimationFrame(checkIfDefined);
                        }
                    }
                };
                requestAnimationFrame(checkIfDefined);
            }
        });
    }
    function watchWhenCustomElementsDefined(callback) {
        elementsDefinitionCallback = callback;
    }
    function unsubscribeFromDefineCustomElements() {
        elementsDefinitionCallback = null;
        undefinedGroups.clear();
        document.removeEventListener(
            "__darkreader__isDefined",
            handleIsDefined
        );
    }

    const observers = [];
    let observedRoots;
    let handledShadowHosts;
    function watchForStylePositions(
        currentStyles,
        update,
        shadowRootDiscovered
    ) {
        stopWatchingForStylePositions();
        const prevStylesByRoot = new WeakMap();
        const getPrevStyles = (root) => {
            if (!prevStylesByRoot.has(root)) {
                prevStylesByRoot.set(root, new Set());
            }
            return prevStylesByRoot.get(root);
        };
        currentStyles.forEach((node) => {
            let root = node;
            while ((root = root.parentNode)) {
                if (
                    root === document ||
                    root.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                ) {
                    const prevStyles = getPrevStyles(root);
                    prevStyles.add(node);
                    break;
                }
            }
        });
        const prevStyleSiblings = new WeakMap();
        const nextStyleSiblings = new WeakMap();
        function saveStylePosition(style) {
            prevStyleSiblings.set(style, style.previousElementSibling);
            nextStyleSiblings.set(style, style.nextElementSibling);
        }
        function forgetStylePosition(style) {
            prevStyleSiblings.delete(style);
            nextStyleSiblings.delete(style);
        }
        function didStylePositionChange(style) {
            return (
                style.previousElementSibling !== prevStyleSiblings.get(style) ||
                style.nextElementSibling !== nextStyleSiblings.get(style)
            );
        }
        currentStyles.forEach(saveStylePosition);
        function handleStyleOperations(root, operations) {
            const {createdStyles, removedStyles, movedStyles} = operations;
            createdStyles.forEach((s) => saveStylePosition(s));
            movedStyles.forEach((s) => saveStylePosition(s));
            removedStyles.forEach((s) => forgetStylePosition(s));
            const prevStyles = getPrevStyles(root);
            createdStyles.forEach((s) => prevStyles.add(s));
            removedStyles.forEach((s) => prevStyles.delete(s));
            if (
                createdStyles.size + removedStyles.size + movedStyles.size >
                0
            ) {
                update({
                    created: Array.from(createdStyles),
                    removed: Array.from(removedStyles),
                    moved: Array.from(movedStyles),
                    updated: []
                });
            }
        }
        function handleMinorTreeMutations(root, {additions, moves, deletions}) {
            const createdStyles = new Set();
            const removedStyles = new Set();
            const movedStyles = new Set();
            additions.forEach((node) =>
                getManageableStyles(node).forEach((style) =>
                    createdStyles.add(style)
                )
            );
            deletions.forEach((node) =>
                getManageableStyles(node).forEach((style) =>
                    removedStyles.add(style)
                )
            );
            moves.forEach((node) =>
                getManageableStyles(node).forEach((style) =>
                    movedStyles.add(style)
                )
            );
            handleStyleOperations(root, {
                createdStyles,
                removedStyles,
                movedStyles
            });
            const potentialHosts = new Set();
            additions.forEach((n) => {
                if (n.parentElement) {
                    potentialHosts.add(n.parentElement);
                }
                if (n.previousElementSibling) {
                    potentialHosts.add(n.previousElementSibling);
                }
                deepObserve(n);
                collectUndefinedElements(n);
            });
            potentialHosts.forEach((el) => {
                if (el.shadowRoot && !observedRoots.has(el)) {
                    subscribeForShadowRootChanges(el);
                    deepObserve(el.shadowRoot);
                }
            });
            additions.forEach(
                (node) => isCustomElement(node) && recordUndefinedElement(node)
            );
            additions.forEach((node) => checkImageSelectors(node));
        }
        function handleHugeTreeMutations(root) {
            const styles = new Set(getManageableStyles(root));
            const createdStyles = new Set();
            const removedStyles = new Set();
            const movedStyles = new Set();
            const prevStyles = getPrevStyles(root);
            styles.forEach((s) => {
                if (!prevStyles.has(s)) {
                    createdStyles.add(s);
                }
            });
            prevStyles.forEach((s) => {
                if (!styles.has(s)) {
                    removedStyles.add(s);
                }
            });
            styles.forEach((s) => {
                if (
                    !createdStyles.has(s) &&
                    !removedStyles.has(s) &&
                    didStylePositionChange(s)
                ) {
                    movedStyles.add(s);
                }
            });
            handleStyleOperations(root, {
                createdStyles,
                removedStyles,
                movedStyles
            });
            deepObserve(root);
            collectUndefinedElements(root);
            checkImageSelectors(root);
        }
        function handleAttributeMutations(mutations) {
            const updatedStyles = new Set();
            const removedStyles = new Set();
            mutations.forEach((m) => {
                const {target} = m;
                if (target.isConnected) {
                    if (shouldManageStyle(target)) {
                        updatedStyles.add(target);
                    } else if (
                        target instanceof HTMLLinkElement &&
                        target.disabled
                    ) {
                        removedStyles.add(target);
                    }
                }
            });
            if (updatedStyles.size + removedStyles.size > 0) {
                update({
                    updated: Array.from(updatedStyles),
                    created: [],
                    removed: Array.from(removedStyles),
                    moved: []
                });
            }
        }
        function observe(root) {
            if (observedRoots.has(root)) {
                return;
            }
            const treeObserver = createOptimizedTreeObserver(root, {
                onMinorMutations: handleMinorTreeMutations,
                onHugeMutations: handleHugeTreeMutations
            });
            const attrObserver = new MutationObserver(handleAttributeMutations);
            attrObserver.observe(root, {
                attributeFilter: ["rel", "disabled", "media", "href"],
                subtree: true
            });
            observers.push(treeObserver, attrObserver);
            observedRoots.add(root);
        }
        function subscribeForShadowRootChanges(node) {
            const {shadowRoot} = node;
            if (shadowRoot == null || observedRoots.has(shadowRoot)) {
                return;
            }
            observe(shadowRoot);
            shadowRootDiscovered(shadowRoot);
        }
        function deepObserve(node) {
            iterateShadowHosts(node, subscribeForShadowRootChanges);
        }
        observe(document);
        deepObserve(document.documentElement);
        watchWhenCustomElementsDefined((hosts) => {
            hosts = hosts.filter((node) => !handledShadowHosts.has(node));
            const newStyles = [];
            hosts.forEach((host) =>
                push(newStyles, getManageableStyles(host.shadowRoot))
            );
            update({created: newStyles, updated: [], removed: [], moved: []});
            hosts.forEach((host) => {
                const {shadowRoot} = host;
                if (shadowRoot == null) {
                    return;
                }
                subscribeForShadowRootChanges(host);
                deepObserve(shadowRoot);
                collectUndefinedElements(shadowRoot);
            });
            hosts.forEach((node) => handledShadowHosts.add(node));
        });
        document.addEventListener("__darkreader__isDefined", handleIsDefined);
        collectUndefinedElements(document);
        addDOMReadyListener(() => {
            forEach(document.body.children, (el) => {
                if (el.shadowRoot && !observedRoots.has(el)) {
                    subscribeForShadowRootChanges(el);
                    deepObserve(el.shadowRoot);
                }
            });
        });
    }
    function resetObservers() {
        observers.forEach((o) => o.disconnect());
        observers.splice(0, observers.length);
        observedRoots = new WeakSet();
        handledShadowHosts = new WeakSet();
    }
    function stopWatchingForStylePositions() {
        resetObservers();
        unsubscribeFromDefineCustomElements();
    }

    function watchForStyleChanges(currentStyles, update, shadowRootDiscovered) {
        watchForStylePositions(currentStyles, update, shadowRootDiscovered);
    }
    function stopWatchingForStyleChanges() {
        stopWatchingForStylePositions();
    }

    const INSTANCE_ID = generateUID();
    const styleManagers = new Map();
    const adoptedStyleManagers = [];
    let theme = null;
    let fixes = null;
    let isIFrame$1 = null;
    let ignoredImageAnalysisSelectors = [];
    let ignoredInlineSelectors = [];
    let staticStyleMap = new WeakMap();
    function createOrUpdateStyle(className, root = document.head || document) {
        let element = root.querySelector(`.${className}`);
        if (!staticStyleMap.has(root)) {
            staticStyleMap.set(root, new Map());
        }
        const classMap = staticStyleMap.get(root);
        if (element) {
            classMap.set(className, element);
        } else if (classMap.has(className)) {
            element = classMap.get(className);
        } else {
            element = document.createElement("style");
            element.classList.add("darkreader");
            element.classList.add(className);
            element.media = "screen";
            element.textContent = "";
            classMap.set(className, element);
        }
        return element;
    }
    function createOrUpdateScript(className, root = document.head || document) {
        let element = root.querySelector(`.${className}`);
        if (!element) {
            element = document.createElement("script");
            element.classList.add("darkreader");
            element.classList.add(className);
        }
        return element;
    }
    const nodePositionWatchers = new Map();
    function setupNodePositionWatcher(node, alias, callback) {
        nodePositionWatchers.has(alias) &&
            nodePositionWatchers.get(alias).stop();
        nodePositionWatchers.set(
            alias,
            watchForNodePosition(node, "head", callback)
        );
    }
    function stopStylePositionWatchers() {
        forEach(nodePositionWatchers.values(), (watcher) => watcher.stop());
        nodePositionWatchers.clear();
    }
    function injectStaticStyle(style, prevNode, watchAlias, callback) {
        const mode = getStyleInjectionMode();
        if (mode === "next") {
            document.head.insertBefore(
                style,
                prevNode ? prevNode.nextSibling : document.head.firstChild
            );
            setupNodePositionWatcher(style, watchAlias, callback);
        } else if (mode === "away") {
            injectStyleAway(style);
        }
    }
    const scheduleInversionStyleUpdate = throttle(() => {
        const invertStyle = document.head?.querySelector(".darkreader--invert");
        if (invertStyle) {
            setInversionStyleValue(invertStyle);
        }
        shadowRootsWithOverrides.forEach((root) => {
            const shadowInvertStyle = root.querySelector(".darkreader--invert");
            if (shadowInvertStyle) {
                setInversionStyleValue(shadowInvertStyle);
            }
        });
    });
    setFilterSelectorHandler((selector, type) => {
        const changed = addFilterSelector(selector, type);
        if (changed) {
            scheduleInversionStyleUpdate();
        }
    });
    function setInversionStyleValue(invertStyle) {
        if (!theme) {
            return;
        }
        const rules = [];
        const appendRule = (selectors, filter) => {
            if (!filter || selectors.length === 0) {
                return;
            }
            rules.push(
                [
                    `${selectors.join(", ")} {`,
                    `    filter: ${filter} !important;`,
                    "}"
                ].join("\n")
            );
        };
        const appendCounterInversion = (selectors) => {
            if (theme.mode === 0 || selectors.length === 0) {
                return;
            }
            rules.push(
                [
                    `${selectors.join(", ")} {`,
                    `    color: black !important;`,
                    "}",
                    `${selectors.map((s) => `${s} > *`).join(", ")} {`,
                    `    filter: invert(100%) hue-rotate(180deg) !important;`,
                    "}"
                ].join("\n")
            );
        };
        const appendInversionCancellation = (selectors) => {
            if (theme.mode === 0 || selectors.length === 0) {
                return;
            }
            rules.push(
                [
                    `${selectors.join(", ")} {`,
                    `    filter: none !important;`,
                    `    color: var(--darkreader-neutral-text) !important;`,
                    "}",
                    `${selectors.map((s) => `${s} > *`).join(", ")} {`,
                    `    filter: none !important;`,
                    "}"
                ].join("\n")
            );
        };
        if (
            (fixes && Array.isArray(fixes.invert) && fixes.invert.length > 0) ||
            filterSelectors.invert.size > 0
        ) {
            const extraInversionSelectors = [...filterSelectors.invert];
            const invertSelectors = [
                ...(fixes?.invert ?? []),
                ...extraInversionSelectors
            ];
            const invertFilter = getCSSFilterValue({
                ...theme,
                contrast:
                    theme.mode === 0
                        ? theme.contrast
                        : clamp(theme.contrast - 10, 0, 100)
            });
            appendRule(invertSelectors, invertFilter);
            appendCounterInversion(extraInversionSelectors);
            if (filterSelectors.none.size > 0) {
                const noneSelectors = [...filterSelectors.none];
                appendInversionCancellation(noneSelectors);
                if (theme.mode === 1) {
                    const invertedChildSelectors = [];
                    noneSelectors.forEach((parent) => {
                        extraInversionSelectors.forEach((child) =>
                            invertedChildSelectors.push(`${parent} > ${child}`)
                        );
                    });
                    appendRule(invertedChildSelectors, invertFilter);
                }
            }
        }
        if (filterSelectors.dim.size > 0) {
            appendRule(
                [...filterSelectors.dim],
                getCSSFilterValue({
                    ...theme,
                    brightness: clamp(theme.brightness - 10, 5, 200),
                    sepia: clamp(theme.sepia + 10, 0, 100)
                })
            );
        }
        invertStyle.textContent = rules.join("\n");
    }
    function createStaticStyleOverrides() {
        const fallbackStyle = createOrUpdateStyle(
            "darkreader--fallback",
            document
        );
        fallbackStyle.textContent = getModifiedFallbackStyle(theme, {
            strict: true
        });
        injectStaticStyle(fallbackStyle, null, "fallback");
        const userAgentStyle = createOrUpdateStyle("darkreader--user-agent");
        userAgentStyle.textContent = getModifiedUserAgentStyle(
            theme,
            isIFrame$1,
            theme.styleSystemControls
        );
        injectStaticStyle(userAgentStyle, fallbackStyle, "user-agent");
        const textStyle = createOrUpdateStyle("darkreader--text");
        if (theme.useFont || theme.textStroke > 0) {
            textStyle.textContent = createTextStyle(theme);
        } else {
            textStyle.textContent = "";
        }
        injectStaticStyle(textStyle, userAgentStyle, "text");
        const invertStyle = createOrUpdateStyle("darkreader--invert");
        setInversionStyleValue(invertStyle);
        injectStaticStyle(invertStyle, textStyle, "invert");
        const inlineStyle = createOrUpdateStyle("darkreader--inline");
        inlineStyle.textContent = getInlineOverrideStyle();
        injectStaticStyle(inlineStyle, invertStyle, "inline");
        const variableStyle = createOrUpdateStyle("darkreader--variables");
        const selectionColors = theme?.selectionColor
            ? getSelectionColor(theme)
            : null;
        const neutralBackgroundColor = modifyBackgroundColor(
            parseColorWithCache("#ffffff"),
            theme
        );
        const neutralTextColor = modifyForegroundColor(
            parseColorWithCache("#000000"),
            theme
        );
        variableStyle.textContent = [
            `:root {`,
            `   --darkreader-neutral-background: ${neutralBackgroundColor};`,
            `   --darkreader-neutral-text: ${neutralTextColor};`,
            `   --darkreader-selection-background: ${selectionColors?.backgroundColorSelection ?? "initial"};`,
            `   --darkreader-selection-text: ${selectionColors?.foregroundColorSelection ?? "initial"};`,
            `}`
        ].join("\n");
        injectStaticStyle(variableStyle, inlineStyle, "variables", () =>
            registerVariablesSheet(variableStyle.sheet)
        );
        registerVariablesSheet(variableStyle.sheet);
        const rootVarsStyle = createOrUpdateStyle("darkreader--root-vars");
        injectStaticStyle(rootVarsStyle, variableStyle, "root-vars");
        const enableStyleSheetsProxy = !(
            fixes && fixes.disableStyleSheetsProxy
        );
        const enableCustomElementRegistryProxy = !(
            fixes && fixes.disableCustomElementRegistryProxy
        );
        document.dispatchEvent(new CustomEvent("__darkreader__cleanUp"));
        {
            const proxyScript = createOrUpdateScript("darkreader--proxy");
            proxyScript.append(
                `(${injectProxy})(${enableStyleSheetsProxy}, ${enableCustomElementRegistryProxy})`
            );
            document.head.insertBefore(proxyScript, rootVarsStyle.nextSibling);
            proxyScript.remove();
        }
        const overrideStyle = createOrUpdateStyle("darkreader--override");
        overrideStyle.textContent =
            fixes && fixes.css ? replaceCSSTemplates(fixes.css) : "";
        injectStaticStyle(overrideStyle, document.head.lastChild, "override");
    }
    const shadowRootsWithOverrides = new Set();
    function createShadowStaticStyleOverridesInner(root) {
        const inlineStyle = createOrUpdateStyle("darkreader--inline", root);
        inlineStyle.textContent = getInlineOverrideStyle();
        root.insertBefore(inlineStyle, root.firstChild);
        const overrideStyle = createOrUpdateStyle("darkreader--override", root);
        overrideStyle.textContent =
            fixes && fixes.css ? replaceCSSTemplates(fixes.css) : "";
        root.insertBefore(overrideStyle, inlineStyle.nextSibling);
        const invertStyle = createOrUpdateStyle("darkreader--invert", root);
        setInversionStyleValue(invertStyle);
        root.insertBefore(invertStyle, overrideStyle.nextSibling);
        shadowRootsWithOverrides.add(root);
    }
    function delayedCreateShadowStaticStyleOverrides(root) {
        const observer = new MutationObserver((mutations, observer) => {
            observer.disconnect();
            for (const {type, removedNodes} of mutations) {
                if (type === "childList") {
                    for (const {nodeName, className} of removedNodes) {
                        if (
                            nodeName === "STYLE" &&
                            [
                                "darkreader darkreader--inline",
                                "darkreader darkreader--override",
                                "darkreader darkreader--invert"
                            ].includes(className)
                        ) {
                            createShadowStaticStyleOverridesInner(root);
                            return;
                        }
                    }
                }
            }
        });
        observer.observe(root, {childList: true});
    }
    function createShadowStaticStyleOverrides(root) {
        const delayed = root.firstChild === null;
        createShadowStaticStyleOverridesInner(root);
        if (delayed) {
            delayedCreateShadowStaticStyleOverrides(root);
        }
    }
    function replaceCSSTemplates($cssText) {
        return $cssText.replace(/\${(.+?)}/g, (_, $color) => {
            const color = parseColorWithCache($color);
            if (color) {
                const lightness = getSRGBLightness(color.r, color.g, color.b);
                if (lightness > 0.5) {
                    return modifyBackgroundColor(color, theme);
                }
                return modifyForegroundColor(color, theme);
            }
            logWarn("Couldn't parse CSSTemplate's color.");
            return $color;
        });
    }
    function cleanFallbackStyle() {
        const fallback =
            staticStyleMap.get(document.head)?.get("darkreader--fallback") ||
            staticStyleMap.get(document)?.get("darkreader--fallback") ||
            document.querySelector(".darkreader--fallback");
        if (fallback) {
            fallback.textContent = "";
        }
    }
    function createDynamicStyleOverrides() {
        const allStyles = getManageableStyles(document);
        const newManagers = allStyles
            .filter((style) => !styleManagers.has(style))
            .map((style) => createManager(style));
        newManagers
            .map((manager) => manager.details({secondRound: false}))
            .filter((detail) => detail && detail.rules.length > 0)
            .forEach((detail) => {
                variablesStore.addRulesForMatching(detail.rules);
            });
        variablesStore.matchVariablesAndDependents();
        variablesStore.setOnRootVariableChange(() => {
            const rootVarsStyle = createOrUpdateStyle("darkreader--root-vars");
            variablesStore.putRootVars(rootVarsStyle, theme);
        });
        const rootVarsStyle = createOrUpdateStyle("darkreader--root-vars");
        variablesStore.putRootVars(rootVarsStyle, theme);
        styleManagers.forEach((manager) =>
            manager.render(theme, ignoredImageAnalysisSelectors)
        );
        if (loadingStyles.size === 0) {
            cleanFallbackStyle();
        }
        newManagers.forEach((manager) => manager.watch());
        const inlineStyleElements = toArray(
            document.querySelectorAll(INLINE_STYLE_SELECTOR)
        );
        iterateShadowHosts(document.documentElement, (host) => {
            createShadowStaticStyleOverrides(host.shadowRoot);
            const elements = host.shadowRoot.querySelectorAll(
                INLINE_STYLE_SELECTOR
            );
            if (elements.length > 0) {
                push(inlineStyleElements, elements);
            }
        });
        inlineStyleElements.forEach((el) =>
            overrideInlineStyle(
                el,
                theme,
                ignoredInlineSelectors,
                ignoredImageAnalysisSelectors
            )
        );
        handleAdoptedStyleSheets(document);
        variablesStore.matchVariablesAndDependents();
        tryInvertChromePDF();
    }
    let loadingStylesCounter = 0;
    const loadingStyles = new Set();
    function createManager(element) {
        const loadingStyleId = ++loadingStylesCounter;
        function loadingStart() {
            if (!isDOMReady() || !documentIsVisible()) {
                loadingStyles.add(loadingStyleId);
                logInfo(
                    `Current amount of styles loading: ${loadingStyles.size}`
                );
                const fallbackStyle = createOrUpdateStyle(
                    "darkreader--fallback"
                );
                if (!fallbackStyle.textContent) {
                    fallbackStyle.textContent = getModifiedFallbackStyle(
                        theme,
                        {strict: false}
                    );
                }
            }
        }
        function loadingEnd() {
            loadingStyles.delete(loadingStyleId);
            logInfo(
                `Removed loadingStyle ${loadingStyleId}, now awaiting: ${loadingStyles.size}`
            );
            if (loadingStyles.size === 0 && isDOMReady()) {
                cleanFallbackStyle();
            }
        }
        function update() {
            const details = manager.details({secondRound: true});
            if (!details) {
                return;
            }
            variablesStore.addRulesForMatching(details.rules);
            variablesStore.matchVariablesAndDependents();
            manager.render(theme, ignoredImageAnalysisSelectors);
        }
        const manager = manageStyle(element, {
            update,
            loadingStart,
            loadingEnd
        });
        styleManagers.set(element, manager);
        return manager;
    }
    function removeManager(element) {
        const manager = styleManagers.get(element);
        if (manager) {
            manager.destroy();
            styleManagers.delete(element);
        }
    }
    function onDOMReady() {
        if (loadingStyles.size === 0) {
            cleanFallbackStyle();
            return;
        }
        logWarn(
            `DOM is ready, but still have styles being loaded.`,
            loadingStyles
        );
    }
    function runDynamicStyle() {
        createDynamicStyleOverrides();
        watchForUpdates();
    }
    function createThemeAndWatchForUpdates() {
        createStaticStyleOverrides();
        if (!documentIsVisible() && !theme.immediateModify) {
            setDocumentVisibilityListener(runDynamicStyle);
        } else {
            runDynamicStyle();
        }
        changeMetaThemeColorWhenAvailable(theme);
    }
    function unwrap(value) {
        return value?.wrappedJSObject ?? value;
    }
    function handleAdoptedStyleSheets(node) {
        if (canHaveAdoptedStyleSheets(node)) {
            forEach(
                isFirefox
                    ? unwrap(node.adoptedStyleSheets)
                    : node.adoptedStyleSheets,
                (s) => {
                    variablesStore.addRulesForMatching(s.cssRules);
                }
            );
            const newManger = createAdoptedStyleSheetOverride(node);
            adoptedStyleManagers.push(newManger);
            newManger.render(theme, ignoredImageAnalysisSelectors);
            newManger.watch((sheets) => {
                sheets.forEach((s) => {
                    variablesStore.addRulesForMatching(s.cssRules);
                });
                variablesStore.matchVariablesAndDependents();
                newManger.render(theme, ignoredImageAnalysisSelectors);
            });
        }
    }
    function watchForUpdates() {
        const managedStyles = Array.from(styleManagers.keys());
        watchForStyleChanges(
            managedStyles,
            ({created, updated, removed, moved}) => {
                const stylesToRemove = removed;
                const stylesToManage = created
                    .concat(updated)
                    .concat(moved)
                    .filter((style) => !styleManagers.has(style));
                const stylesToRestore = moved.filter((style) =>
                    styleManagers.has(style)
                );
                stylesToRemove.forEach((style) => removeManager(style));
                const newManagers = stylesToManage.map((style) =>
                    createManager(style)
                );
                newManagers
                    .map((manager) => manager.details({secondRound: false}))
                    .filter((detail) => detail && detail.rules.length > 0)
                    .forEach((detail) => {
                        variablesStore.addRulesForMatching(detail.rules);
                    });
                variablesStore.matchVariablesAndDependents();
                newManagers.forEach((manager) =>
                    manager.render(theme, ignoredImageAnalysisSelectors)
                );
                newManagers.forEach((manager) => manager.watch());
                stylesToRestore.forEach((style) =>
                    styleManagers.get(style).restore()
                );
            },
            (shadowRoot) => {
                createShadowStaticStyleOverrides(shadowRoot);
                handleAdoptedStyleSheets(shadowRoot);
            }
        );
        watchForInlineStyles(
            (element) => {
                overrideInlineStyle(
                    element,
                    theme,
                    ignoredInlineSelectors,
                    ignoredImageAnalysisSelectors
                );
                if (element === document.documentElement) {
                    const styleAttr = element.getAttribute("style") || "";
                    if (styleAttr.includes("--")) {
                        variablesStore.matchVariablesAndDependents();
                        const rootVarsStyle = createOrUpdateStyle(
                            "darkreader--root-vars"
                        );
                        variablesStore.putRootVars(rootVarsStyle, theme);
                    }
                }
            },
            (root) => {
                createShadowStaticStyleOverrides(root);
                const inlineStyleElements = root.querySelectorAll(
                    INLINE_STYLE_SELECTOR
                );
                if (inlineStyleElements.length > 0) {
                    forEach(inlineStyleElements, (el) =>
                        overrideInlineStyle(
                            el,
                            theme,
                            ignoredInlineSelectors,
                            ignoredImageAnalysisSelectors
                        )
                    );
                }
            }
        );
        addDOMReadyListener(onDOMReady);
        setupDocumentPiPFontFix();
    }
    function stopWatchingForUpdates() {
        styleManagers.forEach((manager) => manager.pause());
        stopStylePositionWatchers();
        stopWatchingForStyleChanges();
        stopWatchingForInlineStyles();
        removeDOMReadyListener(onDOMReady);
        cleanReadyStateCompleteListeners();
    }
    let metaObserver;
    let headObserver = null;
    function addMetaListener() {
        metaObserver = new MutationObserver(() => {
            if (document.querySelector('meta[name="darkreader-lock"]')) {
                metaObserver.disconnect();
                removeDynamicTheme();
            }
        });
        metaObserver.observe(document.head, {childList: true, subtree: true});
    }
    function createDarkReaderInstanceMarker() {
        const metaElement = document.createElement("meta");
        metaElement.name = "darkreader";
        metaElement.content = INSTANCE_ID;
        document.head.appendChild(metaElement);
    }
    function isDRLocked() {
        return document.querySelector('meta[name="darkreader-lock"]') != null;
    }
    function isAnotherDarkReaderInstanceActive() {
        const meta = document.querySelector('meta[name="darkreader"]');
        if (meta) {
            if (meta.content !== INSTANCE_ID) {
                return true;
            }
            return false;
        }
        createDarkReaderInstanceMarker();
        addMetaListener();
        return false;
    }
    let interceptorAttempts = 2;
    function interceptOldScript({success, failure}) {
        if (--interceptorAttempts <= 0) {
            failure();
            return;
        }
        const oldMeta = document.head.querySelector('meta[name="darkreader"]');
        if (!oldMeta || oldMeta.content === INSTANCE_ID) {
            return;
        }
        const lock = document.createElement("meta");
        lock.name = "darkreader-lock";
        document.head.append(lock);
        queueMicrotask(() => {
            lock.remove();
            success();
        });
    }
    function disableConflictingPlugins() {
        if (document.documentElement.hasAttribute("data-wp-dark-mode-preset")) {
            const disableWPDarkMode = () => {
                document.dispatchEvent(
                    new CustomEvent("__darkreader__disableConflictingPlugins")
                );
                document.documentElement.classList.remove(
                    "wp-dark-mode-active"
                );
                document.documentElement.removeAttribute(
                    "data-wp-dark-mode-active"
                );
            };
            disableWPDarkMode();
            const observer = new MutationObserver(() => {
                if (
                    document.documentElement.classList.contains(
                        "wp-dark-mode-active"
                    ) ||
                    document.documentElement.hasAttribute(
                        "data-wp-dark-mode-active"
                    )
                ) {
                    disableWPDarkMode();
                }
            });
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class", "data-wp-dark-mode-active"]
            });
        }
    }
    function createPDFOverlay(parent) {
        const overlay = document.createElement("div");
        overlay.classList.add("darkreader");
        overlay.classList.add("darkreader--pdf-overlay");
        overlay.style.backdropFilter = "invert(100%) contrast(90%)";
        overlay.style.pointerEvents = "none";
        overlay.style.position = "fixed";
        overlay.style.left = "0px";
        overlay.style.right = "0px";
        overlay.style.bottom = "0px";
        overlay.style.top = "56px";
        parent.append(overlay);
        cleaners.push(() => {
            overlay.remove();
        });
    }
    function tryInvertChromePDF() {
        if (!document.body || !chrome.dom) {
            return;
        }
        const root = chrome.dom.openOrClosedShadowRoot(document.body);
        if (!root || !root.querySelector('link[href$="/pdf_embedder.css"]')) {
            return;
        }
        if (isChromium && !isMobile) {
            createPDFOverlay(root);
        } else {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(
                '[type="application/pdf"] { filter: invert(1) contrast(0.9); }'
            );
            root.adoptedStyleSheets.push(sheet);
            cleaners.push(() => {
                const index = root.adoptedStyleSheets.indexOf(sheet);
                if (index >= 0) {
                    root.adoptedStyleSheets.splice(index, 1);
                }
            });
        }
    }
    let prevTheme = null;
    let prevFixes = null;
    function createOrUpdateDynamicThemeInternal(
        themeConfig,
        dynamicThemeFixes,
        iframe
    ) {
        theme = themeConfig;
        fixes = dynamicThemeFixes;
        const colorAffectingKeys = [
            "brightness",
            "contrast",
            "darkSchemeBackgroundColor",
            "darkSchemeTextColor",
            "grayscale",
            "lightSchemeBackgroundColor",
            "lightSchemeTextColor",
            "sepia"
        ];
        if (prevTheme && prevFixes) {
            const themeKeys = new Set([
                ...Object.keys(theme),
                ...Object.keys(prevTheme)
            ]);
            let onlyColorsChanged = true;
            for (const key of themeKeys) {
                if (
                    theme[key] !== prevTheme[key] &&
                    !colorAffectingKeys.includes(key)
                ) {
                    onlyColorsChanged = false;
                    break;
                }
            }
            if (
                onlyColorsChanged &&
                JSON.stringify(fixes) !== JSON.stringify(prevFixes)
            ) {
                onlyColorsChanged = false;
            }
            if (onlyColorsChanged) {
                const palette = getColorPalette();
                clearColorPalette();
                palette.background.forEach((color) =>
                    modifyBackgroundColor(color, theme)
                );
                palette.text.forEach((color) =>
                    modifyForegroundColor(color, theme)
                );
                palette.border.forEach((color) =>
                    modifyBorderColor(color, theme)
                );
                return;
            }
            clearColorPalette();
        }
        if (fixes) {
            ignoredImageAnalysisSelectors = Array.isArray(
                fixes.ignoreImageAnalysis
            )
                ? fixes.ignoreImageAnalysis
                : [];
            ignoredInlineSelectors = Array.isArray(fixes.ignoreInlineStyle)
                ? fixes.ignoreInlineStyle
                : [];
            setIgnoredCSSURLs(
                Array.isArray(fixes.ignoreCSSUrl) ? fixes.ignoreCSSUrl : []
            );
        } else {
            ignoredImageAnalysisSelectors = [];
            ignoredInlineSelectors = [];
            setIgnoredCSSURLs([]);
        }
        if (theme.immediateModify) {
            setIsDOMReady(() => {
                return true;
            });
        }
        isIFrame$1 = iframe;
        const ready = () => {
            const success = () => {
                disableConflictingPlugins();
                document.documentElement.setAttribute(
                    "data-darkreader-mode",
                    "dynamic"
                );
                document.documentElement.setAttribute(
                    "data-darkreader-scheme",
                    theme.mode ? "dark" : "dimmed"
                );
                createThemeAndWatchForUpdates();
            };
            const failure = () => {
                removeDynamicTheme();
            };
            if (isDRLocked()) {
                removeNode(document.querySelector(".darkreader--fallback"));
            } else if (isAnotherDarkReaderInstanceActive()) {
                interceptOldScript({
                    success,
                    failure
                });
            } else {
                success();
            }
        };
        if (document.head) {
            ready();
        } else {
            if (!isFirefox) {
                const fallbackStyle = createOrUpdateStyle(
                    "darkreader--fallback"
                );
                document.documentElement.appendChild(fallbackStyle);
                fallbackStyle.textContent = getModifiedFallbackStyle(theme, {
                    strict: true
                });
            }
            headObserver?.disconnect();
            headObserver = new MutationObserver(() => {
                if (document.head) {
                    headObserver?.disconnect();
                    ready();
                }
            });
            cleaners.push(() => {
                headObserver?.disconnect();
                headObserver = null;
            });
            headObserver.observe(document, {childList: true, subtree: true});
        }
        prevTheme = theme;
        prevFixes = fixes;
    }
    function removeProxy() {
        document.dispatchEvent(new CustomEvent("__darkreader__cleanUp"));
        removeNode(document.head.querySelector(".darkreader--proxy"));
    }
    const cleaners = [];
    let pipListenerRegistered = false;
    function setupDocumentPiPFontFix() {
        if (pipListenerRegistered) {
            return;
        }
        const docPiP = window.documentPictureInPicture;
        if (!docPiP) {
            return;
        }
        pipListenerRegistered = true;
        function collectFontSheetCSS() {
            const fontSheetRules = [];
            for (const sheet of document.styleSheets) {
                try {
                    const rules = Array.from(sheet.cssRules);
                    if (rules.some((rule) => rule instanceof CSSFontFaceRule)) {
                        rules.forEach((rule) =>
                            fontSheetRules.push(rule.cssText)
                        );
                    }
                } catch (e) {}
            }
            return fontSheetRules.join("\n");
        }
        function getPipDoc() {
            return docPiP.window?.document ?? null;
        }
        function injectFontCSS(fontCSS) {
            const pipDoc = getPipDoc();
            if (!pipDoc || pipDoc.querySelector(".darkreader--font-fix")) {
                return;
            }
            const style = pipDoc.createElement("style");
            style.classList.add("darkreader");
            style.classList.add("darkreader--font-fix");
            style.textContent = fontCSS;
            (pipDoc.head || pipDoc.documentElement).appendChild(style);
        }
        function removeFontCSS() {
            getPipDoc()?.querySelector(".darkreader--font-fix")?.remove();
        }
        function onPiPEnter() {
            const pipDoc = getPipDoc();
            if (
                !pipDoc ||
                pipDoc.querySelector('meta[name="darkreader-lock"]')
            ) {
                return;
            }
            const fontCSS = collectFontSheetCSS();
            if (!fontCSS) {
                return;
            }
            injectFontCSS(fontCSS);
            const observer = new MutationObserver(() => {
                if (pipDoc.querySelector('meta[name="darkreader-lock"]')) {
                    observer.disconnect();
                    docPiP.removeEventListener("enter", onPiPEnter);
                    removeFontCSS();
                    return;
                }
                injectFontCSS(fontCSS);
            });
            observer.observe(pipDoc, {childList: true, subtree: true});
            cleaners.push(() => observer.disconnect());
            docPiP.window.addEventListener("unload", () =>
                observer.disconnect()
            );
        }
        docPiP.addEventListener("enter", onPiPEnter);
        cleaners.push(() => {
            docPiP.removeEventListener("enter", onPiPEnter);
            removeFontCSS();
            pipListenerRegistered = false;
        });
    }
    function removeDynamicTheme() {
        document.documentElement.removeAttribute(`data-darkreader-mode`);
        document.documentElement.removeAttribute(`data-darkreader-scheme`);
        cleanDynamicThemeCache();
        removeNode(document.querySelector(".darkreader--fallback"));
        if (document.head) {
            const selectors = [
                ".darkreader--user-agent",
                ".darkreader--text",
                ".darkreader--invert",
                ".darkreader--inline",
                ".darkreader--override",
                ".darkreader--variables",
                ".darkreader--root-vars",
                'meta[name="darkreader"]'
            ];
            restoreMetaThemeColor();
            selectors.forEach((selector) =>
                removeNode(document.head.querySelector(selector))
            );
            staticStyleMap = new WeakMap();
            removeProxy();
        }
        shadowRootsWithOverrides.forEach((root) => {
            removeNode(root.querySelector(".darkreader--inline"));
            removeNode(root.querySelector(".darkreader--override"));
        });
        shadowRootsWithOverrides.clear();
        forEach(styleManagers.keys(), (el) => removeManager(el));
        loadingStyles.clear();
        cleanLoadingLinks();
        forEach(document.querySelectorAll(".darkreader"), removeNode);
        removeStyleContainer();
        adoptedStyleManagers.forEach((manager) => manager.destroy());
        adoptedStyleManagers.splice(0);
        metaObserver && metaObserver.disconnect();
        scheduleInversionStyleUpdate.cancel();
        cleaners.forEach((clean) => clean());
        cleaners.splice(0);
    }
    function cleanDynamicThemeCache() {
        variablesStore.clear();
        parsedURLCache.clear();
        cleanFilterSelectors();
        removeDocumentVisibilityListener();
        stopWatchingForUpdates();
        cleanModificationCache();
        clearColorCache();
        releaseVariablesSheet();
        prevTheme = null;
        prevFixes = null;
    }

    function parseCSS(cssText) {
        cssText = removeCSSComments(cssText);
        cssText = cssText.trim();
        if (!cssText) {
            return [];
        }
        const rules = [];
        const excludeRanges = getTokenExclusionRanges(cssText);
        const bracketRanges = getAllOpenCloseRanges(
            cssText,
            "{",
            "}",
            excludeRanges
        );
        let ruleStart = 0;
        bracketRanges.forEach((brackets) => {
            const key = cssText.substring(ruleStart, brackets.start).trim();
            const content = cssText.substring(
                brackets.start + 1,
                brackets.end - 1
            );
            if (key.startsWith("@")) {
                const typeEndIndex = key.search(/[\s\(]/);
                const rule = {
                    type:
                        typeEndIndex < 0 ? key : key.substring(0, typeEndIndex),
                    query:
                        typeEndIndex < 0
                            ? ""
                            : key.substring(typeEndIndex).trim(),
                    rules: parseCSS(content)
                };
                rules.push(rule);
            } else {
                const rule = {
                    selectors: parseSelectors(key),
                    declarations: parseDeclarations(content)
                };
                rules.push(rule);
            }
            ruleStart = brackets.end;
        });
        return rules;
    }
    function getAllOpenCloseRanges(
        input,
        openToken,
        closeToken,
        excludeRanges = []
    ) {
        const ranges = [];
        let i = 0;
        let range;
        while (
            (range = getOpenCloseRange(
                input,
                i,
                openToken,
                closeToken,
                excludeRanges
            ))
        ) {
            ranges.push(range);
            i = range.end;
        }
        return ranges;
    }
    function getTokenExclusionRanges(cssText) {
        const singleQuoteGoesFirst =
            cssText.indexOf("'") < cssText.indexOf('"');
        const firstQuote = singleQuoteGoesFirst ? "'" : '"';
        const secondQuote = singleQuoteGoesFirst ? '"' : "'";
        const excludeRanges = getAllOpenCloseRanges(
            cssText,
            firstQuote,
            firstQuote
        );
        excludeRanges.push(
            ...getAllOpenCloseRanges(
                cssText,
                secondQuote,
                secondQuote,
                excludeRanges
            )
        );
        excludeRanges.push(
            ...getAllOpenCloseRanges(cssText, "[", "]", excludeRanges)
        );
        excludeRanges.push(
            ...getAllOpenCloseRanges(cssText, "(", ")", excludeRanges)
        );
        return excludeRanges;
    }
    function parseSelectors(selectorText) {
        const excludeRanges = getTokenExclusionRanges(selectorText);
        return splitExcluding(selectorText, ",", excludeRanges);
    }
    function parseDeclarations(cssDeclarationsText) {
        const declarations = [];
        const excludeRanges = getTokenExclusionRanges(cssDeclarationsText);
        splitExcluding(cssDeclarationsText, ";", excludeRanges).forEach(
            (part) => {
                const colonIndex = part.indexOf(":");
                if (colonIndex > 0) {
                    const importantIndex = part.indexOf("!important");
                    declarations.push({
                        property: part.substring(0, colonIndex).trim(),
                        value: part
                            .substring(
                                colonIndex + 1,
                                importantIndex > 0
                                    ? importantIndex
                                    : part.length
                            )
                            .trim(),
                        important: importantIndex > 0
                    });
                }
            }
        );
        return declarations;
    }
    function isParsedStyleRule(rule) {
        return "selectors" in rule;
    }

    function formatCSS(cssText) {
        const parsed = parseCSS(cssText);
        return formatParsedCSS(parsed);
    }
    function formatParsedCSS(parsed) {
        const lines = [];
        const tab = "    ";
        function formatRule(rule, indent) {
            if (isParsedStyleRule(rule)) {
                formatStyleRule(rule, indent);
            } else {
                formatAtRule(rule, indent);
            }
        }
        function formatAtRule({type, query, rules}, indent) {
            lines.push(`${indent}${type} ${query} {`);
            rules.forEach((child) => formatRule(child, `${indent}${tab}`));
            lines.push(`${indent}}`);
        }
        function formatStyleRule({selectors, declarations}, indent) {
            const lastSelectorIndex = selectors.length - 1;
            selectors.forEach((selector, i) => {
                lines.push(
                    `${indent}${selector}${i < lastSelectorIndex ? "," : " {"}`
                );
            });
            const sorted = sortDeclarations(declarations);
            sorted.forEach(({property, value, important}) => {
                lines.push(
                    `${indent}${tab}${property}: ${value}${important ? " !important" : ""};`
                );
            });
            lines.push(`${indent}}`);
        }
        clearEmptyRules(parsed);
        parsed.forEach((rule) => formatRule(rule, ""));
        return lines.join("\n");
    }
    function sortDeclarations(declarations) {
        const prefixRegex = /^-[a-z]-/;
        return [...declarations].sort((a, b) => {
            const aProp = a.property;
            const bProp = b.property;
            const aPrefix = aProp.match(prefixRegex)?.[0] ?? "";
            const bPrefix = bProp.match(prefixRegex)?.[0] ?? "";
            const aNorm = aPrefix ? aProp.replace(prefixRegex, "") : aProp;
            const bNorm = bPrefix ? bProp.replace(prefixRegex, "") : bProp;
            if (aNorm === bNorm) {
                return aPrefix.localeCompare(bPrefix);
            }
            return aNorm.localeCompare(bNorm);
        });
    }
    function clearEmptyRules(rules) {
        for (let i = rules.length - 1; i >= 0; i--) {
            const rule = rules[i];
            if (isParsedStyleRule(rule)) {
                if (rule.declarations.length === 0) {
                    rules.splice(i, 1);
                }
            } else {
                clearEmptyRules(rule.rules);
                if (rule.rules.length === 0) {
                    rules.splice(i, 1);
                }
            }
        }
    }

    const blobRegex = /url\(\"(blob\:.*?)\"\)/g;
    async function replaceBlobs(text) {
        const promises = [];
        getMatches(blobRegex, text, 1).forEach((url) => {
            const promise = loadAsDataURL(url);
            promises.push(promise);
        });
        const data = await Promise.all(promises);
        return text.replace(blobRegex, () => `url("${data.shift()}")`);
    }
    const banner = `/*
                        _______
                       /       \\
                      .==.    .==.
                     ((  ))==((  ))
                    / "=="    "=="\\
                   /____|| || ||___\\
       ________     ____    ________  ___    ___
       |  ___  \\   /    \\   |  ___  \\ |  |  /  /
       |  |  \\  \\ /  /\\  \\  |  |  \\  \\|  |_/  /
       |  |   )  /  /__\\  \\ |  |__/  /|  ___  \\
       |  |__/  /  ______  \\|  ____  \\|  |  \\  \\
_______|_______/__/ ____ \\__\\__|___\\__\\__|___\\__\\____
|  ___  \\ |  ____/ /    \\   |  ___  \\ |  ____|  ___  \\
|  |  \\  \\|  |___ /  /\\  \\  |  |  \\  \\|  |___|  |  \\  \\
|  |__/  /|  ____/  /__\\  \\ |  |   )  |  ____|  |__/  /
|  ____  \\|  |__/  ______  \\|  |__/  /|  |___|  ____  \\
|__|   \\__\\____/__/      \\__\\_______/ |______|__|   \\__\\
                https://darkreader.org
*/

/*! Dark reader generated CSS | Licensed under MIT https://github.com/darkreader/darkreader/blob/main/LICENSE */
`;
    async function collectCSS() {
        const css = [banner];
        function addStaticCSS(selector, comment) {
            const staticStyle = document.querySelector(selector);
            if (staticStyle && staticStyle.textContent) {
                css.push(`/* ${comment} */`);
                css.push(staticStyle.textContent);
                css.push("");
            }
        }
        addStaticCSS(".darkreader--fallback", "Fallback Style");
        addStaticCSS(".darkreader--user-agent", "User-Agent Style");
        addStaticCSS(".darkreader--text", "Text Style");
        addStaticCSS(".darkreader--invert", "Invert Style");
        addStaticCSS(".darkreader--variables", "Variables Style");
        const modifiedCSS = [];
        document.querySelectorAll(".darkreader--sync").forEach((element) => {
            forEach(element.sheet.cssRules, (rule) => {
                rule && rule.cssText && modifiedCSS.push(rule.cssText);
            });
        });
        if (modifiedCSS.length) {
            const formattedCSS = formatCSS(modifiedCSS.join("\n"));
            css.push("/* Modified CSS */");
            css.push(await replaceBlobs(formattedCSS));
            css.push("");
        }
        addStaticCSS(".darkreader--override", "Override Style");
        return css.join("\n");
    }

    let isDarkReaderEnabled = false;
    const isIFrame = (() => {
        try {
            return window.self !== window.top;
        } catch (err) {
            console.warn(err);
            return true;
        }
    })();
    function enable(themeOptions = {}, fixes = null) {
        const theme = {...DEFAULT_THEME, ...themeOptions};
        if (theme.engine !== ThemeEngine.dynamicTheme) {
            throw new Error("Theme engine is not supported.");
        }
        createOrUpdateDynamicThemeInternal(theme, fixes, isIFrame);
        isDarkReaderEnabled = true;
    }
    function isEnabled() {
        return isDarkReaderEnabled;
    }
    function disable() {
        removeDynamicTheme();
        isDarkReaderEnabled = false;
    }
    const darkScheme =
        typeof matchMedia === "function"
            ? matchMedia("(prefers-color-scheme: dark)")
            : undefined;
    let store = {
        themeOptions: null,
        fixes: null
    };
    function handleColorScheme() {
        if (darkScheme?.matches) {
            enable(store.themeOptions, store.fixes);
        } else {
            disable();
        }
    }
    function auto(themeOptions = {}, fixes = null) {
        if (themeOptions) {
            store = {themeOptions, fixes};
            handleColorScheme();
            if (isMatchMediaChangeEventListenerSupported) {
                darkScheme?.addEventListener("change", handleColorScheme);
            } else {
                darkScheme?.addListener(handleColorScheme);
            }
        } else {
            if (isMatchMediaChangeEventListenerSupported) {
                darkScheme?.removeEventListener("change", handleColorScheme);
            } else {
                darkScheme?.removeListener(handleColorScheme);
            }
            disable();
        }
    }
    async function exportGeneratedCSS() {
        return await collectCSS();
    }
    const setFetchMethod = setFetchMethod$1;

    exports.auto = auto;
    exports.disable = disable;
    exports.enable = enable;
    exports.exportGeneratedCSS = exportGeneratedCSS;
    exports.isEnabled = isEnabled;
    exports.setFetchMethod = setFetchMethod;

    Object.defineProperty(exports, "__esModule", {value: true});
});
/* === END VENDORED DARK READER API === */

// Changelog v19.3: Uses the bundled official Dark Reader Dynamic Theme engine for site-wide dark mode; keeps the theme control beside Book time off, Analyzer Settings beside navigation, Time Tracking Enhanced branding, and the compact Analyzer layout.
// Changelog v19.2: Unified To today and Back to top into one native eDays c3-button placed immediately after Submit month; removed the separate floating navigation and Jump to today from the Today strip.
// Changelog v19.1: Added a subtle full-row Today highlight with blue accent, tinted background, and a stronger Today chip for faster visual scanning.
// Changelog v19.0: Replaced the inline Back to Analyzer button with a floating down-arrow that appears after scrolling and returns to the analyzer.
// Changelog v18.9: Added persistent Analyzer Settings for Office Target and Mandatory Break, with validation, live recalculation, and reset-to-defaults support.
// Changelog v18.8: Made the mandatory break configurable and included the missing break in Today buffer calculations so the predicted post-clock-out deficit is visible.
// Changelog v18.7: Unified exact office-time calculations across Office Target and Buffer & Outlook, fixed formatter initialization, and added mandatory 30-minute break handling to Today/leave-at time.
// Changelog v18.6: Buffer & Outlook now show exact days/hours/minutes, keep values on one line without resizing chips, and hide zero-value units such as 0d, 0h, and 0m.
// Changelog v18.5: Fixed buffer calculation to take only surplus/discrepancy into account.
// Changelog v18.4: Fixed percentage discrepancy across categories.
// Changelog v18.3: Fixed Buffer & Outlook to include today’s positive or negative variance in the current banked balance while preserving the pre-today buffer for the “Include buffer” option.
// Changelog v18.2: Unified button styling and hover behaviour, including the Back to Analyzer button.
// Changelog v18.2: Fixed Back to Analyzer scrolling so it no longer causes persistent horizontal page/title-bar shifting.
// Changelog v18.1: Office Target ring now derives office minutes from each day's own logged periods
// Changelog v18.1: instead of scaling by the recorded/rawTotal reconciliation factor, which could
// Changelog v18.1: round already-banked office minutes DOWN whenever a later day's activity was logged.
// Changelog v18.1: "Office Days Needed" / "WFH Days Available" chips now show exact hours (e.g. "3h 30m")
// Changelog v18.1: and relabel to "...Time Needed/Available" whenever the remaining amount is <= 1 day.
// Changelog v18.0: Correct half-day AM/PM vacation handling across Today, buffer, remaining time, and Office Planner calculations.
// Changelog v18.0: Day capacity is now 8h normally, 4h for AM/PM absences, and 0h for full absences/holidays/weekends.
// Changelog v18.0: Planner uses unique full-date keys, respects remaining daily capacity, and no longer treats every future day as an 8h slot.
// Changelog v18.0: Today leave-at time is shown only while a time period is actively open.
// Changelog v17.9: Fixed buffer calculation to use the true 8-hour daily target and prevent today's buffer from being double-counted.
// Changelog v17.8: Buttons now use blue styling in the light theme and orange styling in the dark theme.
/* ══ DEFAULT SETTINGS ══ */
const DEFAULT_OFF_TARGET = 60;               // Office target (% of rota hours)
const DEFAULT_MANDATORY_BREAK_MINUTES = 30;  // Mandatory break on a full working day
(function() {
    'use strict';
    /* ═══════════════════════════════════════════════════════════════
       LOCALSTORAGE KEYS
    ═══════════════════════════════════════════════════════════════ */
    const LS = {
        THEME: 'ep-theme-override',
        TODAY_BUF: 'ep-today-buffer',
        PLANNER_OPEN: 'ep-planner-open',
        OFF_TARGET: 'ep-office-target',
        MANDATORY_BREAK: 'ep-mandatory-break',
    };

    const readNumericSetting = (key, fallback, min, max) => {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        const value = Number(raw);
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
    };

    let offTarget = readNumericSetting(
        LS.OFF_TARGET,
        DEFAULT_OFF_TARGET,
        0,
        100
    );

    let mandatoryBreakMinutes = readNumericSetting(
        LS.MANDATORY_BREAK,
        DEFAULT_MANDATORY_BREAK_MINUTES,
        0,
        480
    );
    /* ═══════════════════════════════════════════════════════════════
       THEME
    ═══════════════════════════════════════════════════════════════ */
    const getPageBrightness = () => {
        const candidates = [
            document.body,
            document.documentElement,
            document.getElementById('mainTimesheetPanel'),
            document.querySelector('.timesheet_container'),
            document.querySelector('.main-content'),
            document.querySelector('#content'),
        ].filter(Boolean);
        for (const el of candidates) {
            const bg = getComputedStyle(el).backgroundColor;
            const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) continue;
            const [, r, g, b] = m.map(Number);
            if (r === 0 && g === 0 && b === 0) continue;
            return 0.299 * r + 0.587 * g + 0.114 * b;
        }
        return 255;
    };
    const buildTheme = () => {
        const isDark = getPageBrightness() < 100;
        return isDark ? {
            isDark,
            bg: '#181a1b',
            surface: '#202324',
            border: 'rgba(255,255,255,0.08)',
            text: '#e8e6e3',
            muted: '#aaa49b',
            faint: 'rgba(255,255,255,0.04)',
            barTrack: 'rgba(255,255,255,0.07)',
            chipBg: 'rgba(255,255,255,0.03)',
            shadow: '0 4px 24px rgba(0,0,0,0.4)',
            ringTrack: 'rgba(255,255,255,0.12)',
        } : {
            isDark,
            bg: '#ffffff',
            surface: '#f7f7f7',
            border: 'rgba(0,0,0,0.08)',
            text: '#111827',
            muted: '#6b7280',
            faint: 'rgba(0,0,0,0.03)',
            barTrack: 'rgba(0,0,0,0.07)',
            chipBg: 'rgba(0,0,0,0.03)',
            shadow: '0 2px 12px rgba(0,0,0,0.10)',
            ringTrack: 'rgba(0,0,0,0.12)',
        };
    };
    let themeOverride = localStorage.getItem(LS.THEME) || null;
    const getTheme = () => {
        if (themeOverride === 'dark') return {
            isDark: true,
            bg: '#181a1b',
            surface: '#202324',
            border: 'rgba(255,255,255,0.08)',
            text: '#e8e6e3',
            muted: '#aaa49b',
            faint: 'rgba(255,255,255,0.04)',
            barTrack: 'rgba(255,255,255,0.07)',
            chipBg: 'rgba(255,255,255,0.03)',
            shadow: '0 4px 24px rgba(0,0,0,0.4)',
            ringTrack: 'rgba(255,255,255,0.12)'
        };
        if (themeOverride === 'light') return {
            isDark: false,
            bg: '#ffffff',
            surface: '#f7f7f7',
            border: 'rgba(0,0,0,0.08)',
            text: '#111827',
            muted: '#6b7280',
            faint: 'rgba(0,0,0,0.03)',
            barTrack: 'rgba(0,0,0,0.07)',
            chipBg: 'rgba(0,0,0,0.03)',
            shadow: '0 2px 12px rgba(0,0,0,0.10)',
            ringTrack: 'rgba(0,0,0,0.12)'
        };
        return buildTheme();
    };
    /* ═══════════════════════════════════════════════════════════════
       UTILITIES
    ═══════════════════════════════════════════════════════════════ */
    const timeToMinutes = t => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + (m || 0);
    };
    const STANDARD_DAY_MINUTES = 480;
    const HALF_DAY_MINUTES = STANDARD_DAY_MINUTES / 2;
    const round1 = value => Math.round((value + Number.EPSILON) * 10) / 10;
    const fmtHours = hours => {
        const rounded = round1(hours);
        return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    };
    const fmt = mins => {
        const rounded = Math.round(mins || 0);
        const sign = rounded < 0 ? '-' : '';
        const abs = Math.abs(rounded);
        const h = Math.floor(abs / 60);
        const m = abs % 60;
        return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${String(m).padStart(2, '0')}m`;
    };
    const fmtDaysAndTime = mins => {
        const total = Math.max(0, Math.round(mins || 0));
        if (total === 0) {
            return '';
        }
        const wholeDays = Math.floor(total / STANDARD_DAY_MINUTES);
        const remainder = total % STANDARD_DAY_MINUTES;
        const hours = Math.floor(remainder / 60);
        const minutes = remainder % 60;
        const parts = [];
        if (wholeDays > 0) {
            parts.push(`${wholeDays}d`);
        }
        if (hours > 0) {
            parts.push(`${hours}h`);
        }
        if (minutes > 0) {
            parts.push(`${minutes}m`);
        }
        return parts.join(' ');
    };
    const parseTime = value => {
        const m = (value || '').match(/([+-]?)(\d+):(\d{2})/);
        if (!m) return 0;
        const mins = parseInt(m[2], 10) * 60 + parseInt(m[3], 10);
        return m[1] === '-' ? -mins : mins;
    };
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const formatClock = date => date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    /* ═══════════════════════════════════════════════════════════════
       SCROLL HELPERS
    ═══════════════════════════════════════════════════════════════ */
    const getScrollParent = el => {
        let p = el.parentElement;
        while (p) {
            const {
                overflow,
                overflowY
            } = getComputedStyle(p);
            if (/(auto|scroll)/.test(overflow + overflowY)) {
                return p;
            }
            p = p.parentElement;
        }
        return window;
    };
    const jumpToToday = () => {
        const c = document.querySelector('.today_chip');
        if (c) {
            const d = c.closest('.tt_day_container');
            if (d) {
                const sp = getScrollParent(d);
                const offset = 80;
                if (sp === window) {
                    const y = d.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                } else {
                    const y = d.getBoundingClientRect().top - sp.getBoundingClientRect().top + sp.scrollTop - offset;
                    sp.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }
            }
        }
    };
    const jumpToAnalyzer = () => {
        const el = document.getElementById('ep13');
        if (!el) return;
        const sp = getScrollParent(el);
        const offset = 75;
        if (sp === window) {
            const left = window.scrollX;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top,
                left,
                behavior: 'smooth'
            });
        } else {
            const left = sp.scrollLeft;
            const top = el.getBoundingClientRect().top - sp.getBoundingClientRect().top + sp.scrollTop - offset;
            sp.scrollTo({
                top,
                left,
                behavior: 'smooth'
            });
        }
    };
    /* ═══════════════════════════════════════════════════════════════
       PERIOD / DAY HELPERS
    ═══════════════════════════════════════════════════════════════ */
    const getDayLabel = dayEl => dayEl.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
    const getDayTotalMinutes = dayEl => timeToMinutes(dayEl.querySelector('.duration_hours')?.innerText?.trim() || '');
    const getPeriodTimeValues = periodEl => {
        const inputs = periodEl.querySelectorAll('input[type="time"]');
        let start = inputs[0]?.value || '';
        let end = inputs[1]?.value || '';
        if (!start) {
            const lbl = periodEl.querySelector('label.hiddenLabel')?.innerText || '';
            const m = lbl.match(/(\d{1,2}:\d{2})\s+to(?:\s+(\d{1,2}:\d{2}))?/i);
            if (m) {
                start = m[1] || '';
                end = m[2] || '';
            }
        }
        return {
            start,
            end
        };
    };
    const isOpenPeriod = periodEl => {
        const {
            start,
            end
        } = getPeriodTimeValues(periodEl);
        return !!start && !end;
    };
    const getPeriodMinutes = (periodEl, allowOpen = false) => {
        const {
            start,
            end
        } = getPeriodTimeValues(periodEl);
        if (!start) return 0;
        let effectiveEnd = end;
        if (!effectiveEnd) {
            if (!allowOpen) return 0;
            const n = new Date();
            effectiveEnd = `${String(n.getHours()).padStart(2, '0')}:` + `${String(n.getMinutes()).padStart(2, '0')}`;
        }
        const d = timeToMinutes(effectiveEnd) - timeToMinutes(start);
        return d > 0 ? d : 0;
    };
    const getAbsenceInfo = dayEl => {
        const text = dayEl.querySelector('.absence_detail_text')?.innerText?.trim() || '';
        const halfMatch = text.match(/:\s*(AM|PM)\s*$/i);
        const halfDayPart = halfMatch ? halfMatch[1].toUpperCase() : null;
        const isHalfDay = !!halfDayPart;
        const isHoliday = /holiday/i.test(text);
        const isFullAbsence = !!text && !isHalfDay;
        return {
            text,
            isHalfDay,
            halfDayPart,
            isHoliday,
            isFullAbsence
        };
    };
    const getDayName = dayEl => (getDayLabel(dayEl).split(/\s+/)[0] || '').replace(/[^A-Za-z]/g, '');
    const isWeekendDay = dayEl => {
        const name = getDayName(dayEl);
        return name === 'Saturday' || name === 'Sunday';
    };
    const getDayWorkTargetMinutes = dayEl => {
        if (isWeekendDay(dayEl)) return 0;
        const absence = getAbsenceInfo(dayEl);
        if (absence.isHalfDay) {
            return HALF_DAY_MINUTES;
        }
        if (absence.isFullAbsence || absence.isHoliday) {
            return 0;
        }
        return STANDARD_DAY_MINUTES;
    };
    const parseDayDate = label => {
        const m = (label || '').match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/);
        if (!m) return null;
        const day = Number(m[1]);
        const month = Number(m[2]);
        const year = Number(m[3]);
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }
        return date;
    };
    const getDateKey = (date, fallback) => {
        if (!date) return fallback;
        return (`${date.getFullYear()}-` + `${String(date.getMonth() + 1).padStart(2, '0')}-` + `${String(date.getDate()).padStart(2, '0')}`);
    };
    const getLocalDayStamp = date => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const getLiveDayMinutes = dayEl => {
        const saved = getDayTotalMinutes(dayEl);
        if (!dayEl.querySelector('.today_chip')) {
            return saved;
        }
        let live = 0;
        dayEl.querySelectorAll('.tt_period_container').forEach(p => {
            live += getPeriodMinutes(p, true);
        });
        return Math.max(saved, live);
    };
    const getObservedBreakMinutes = dayEl => {
        const periods = [...dayEl.querySelectorAll('.tt_period_container')].map(p => {
            const {
                start,
                end
            } = getPeriodTimeValues(p);
            if (!start) {
                return null;
            }
            return {
                start: timeToMinutes(start),
                end: end ? timeToMinutes(end) : null
            };
        }).filter(Boolean).sort((a, b) => a.start - b.start);
        let breakMinutes = 0;
        for (let i = 1; i < periods.length; i++) {
            const previous = periods[i - 1];
            const current = periods[i];
            if (previous.end === null) {
                continue;
            }
            breakMinutes += Math.max(0, current.start - previous.end);
        }
        return breakMinutes;
    };
    const getRequiredMandatoryBreakMinutes = dayEl => {
        const target = getDayWorkTargetMinutes(dayEl);
        return target >= STANDARD_DAY_MINUTES ? mandatoryBreakMinutes : 0;
    };

    const getMissingMandatoryBreakMinutes = dayEl => {
        const requiredBreak = getRequiredMandatoryBreakMinutes(dayEl);
        const observedBreak = getObservedBreakMinutes(dayEl);
        return Math.max(0, requiredBreak - observedBreak);
    };
    /* ═══════════════════════════════════════════════════════════════
       ICONS
    ═══════════════════════════════════════════════════════════════ */
    const ICONS = {
        office: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>`,
        laptop: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
        flight: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
        block: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>`,
        timer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
        trending_up: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
        trending_down: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>`,
        trending_flat: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12l-4-4v3H3v2h15v3z"/></svg>`,
        check: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
        calendar: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`,
        today: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
        flag: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`,
        savings: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/></svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
        arrow_down: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>`,
        arrow_up: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`,
        chevron_down: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
        chevron_up: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.08-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.37-.31-.6-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98L14.5 2.42A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42L9.13 5.07c-.61.25-1.17.59-1.69.98l-2.49-1a.49.49 0 0 0-.6.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.05.32-.08.66-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.37.31.6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z"/></svg>`,
    };
    const icon = (name, size = 14, color = '#fff') => `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;color:${color};flex-shrink:0;">${ICONS[name] || ''}</span>`;
    const iconBadge = (name, bg, size = 28) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${bg};border-radius:7px;flex-shrink:0;color:#fff;">${ICONS[name] || ''}</span>`;
    /* ═══════════════════════════════════════════════════════════════
       OFFICE TARGET COLOR / RING
    ═══════════════════════════════════════════════════════════════ */
    const getOffColor = p => p >= 100 ? '#22c55e' : p >= 85 ? '#84cc16' : p >= 65 ? '#eab308' : p >= 45 ? '#f97316' : '#ef4444';
    const ring = ({
        r = 54,
        pct,
        color,
        sw = 6,
        trackColor
    }) => {
        const circ = 2 * Math.PI * r;
        const dash = clamp(pct, 0, 100) / 100 * circ;
        const cx = r + sw + 1;
        const sz = cx * 2;
        return `
            <svg
                viewBox="0 0 ${sz} ${sz}"
                style="transform:rotate(-90deg);"
            >
                <circle
                    cx="${cx}"
                    cy="${cx}"
                    r="${r}"
                    fill="none"
                    stroke="${trackColor}"
                    stroke-width="${sw}"
                />
                <circle
                    cx="${cx}"
                    cy="${cx}"
                    r="${r}"
                    fill="none"
                    stroke="${color}"
                    stroke-width="${sw}"
                    stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
                    stroke-linecap="round"
                />
            </svg>
        `;
    };
    /* ═══════════════════════════════════════════════════════════════
       DATA GATHERING
    ═══════════════════════════════════════════════════════════════ */
    const getSummaryData = () => {
        const d = {
            recorded: 0,
            rota: 0,
            absences: 0,
            holidays: 0,
            difference: 0
        };
        document.querySelectorAll('.desktop_summary .summary_block').forEach(block => {
            const spans = block.querySelectorAll('span');
            if (spans.length < 2) return;
            const mins = parseTime(spans[0].innerText.trim());
            const lbl = spans[1].innerText.trim();
            if (lbl.includes('Time recorded')) {
                d.recorded = mins;
            }
            if (lbl.includes('Rota')) {
                d.rota = Math.abs(mins);
            }
            if (lbl.includes('Absences')) {
                d.absences = Math.abs(mins);
            }
            if (lbl.includes('Public holidays')) {
                d.holidays = Math.abs(mins);
            }
            if (lbl.includes('Difference')) {
                d.difference = mins;
            }
        });
        return d;
    };
    const isSummaryReady = () => {
        const blocks = document.querySelectorAll('.desktop_summary .summary_block');
        return blocks.length > 0;
    };
    const getActivityData = () => {
        const actMap = {
            'Office': 0,
            'Mobile Working': 0,
            'Business Travel': 0,
            'No Activity': 0
        };
        let rawTotal = 0;
        let workedDays = 0;
        document.querySelectorAll('.tt_day_container').forEach(day => {
            let worked = false;
            const allowOpen = !!day.querySelector('.today_chip');
            day.querySelectorAll('.tt_period_container').forEach(p => {
                const dur = getPeriodMinutes(p, allowOpen);
                if (dur <= 0) return;
                worked = true;
                const act = p.querySelector('.chosen-single span')?.innerText.trim() || 'No Activity';
                if (!(act in actMap)) {
                    actMap[act] = 0;
                }
                actMap[act] += dur;
                rawTotal += dur;
            });
            if (worked) {
                workedDays++;
            }
        });
        return {
            actMap,
            rawTotal,
            workedDays
        };
    };
    const getDetailedDayData = () => {
        const allDayEls = [...document.querySelectorAll('.tt_day_container')];
        const markerTodayIdx = allDayEls.findIndex(d => d.querySelector('.today_chip'));
        const nowStamp = getLocalDayStamp(new Date());
        const days = allDayEls.map((day, idx) => {
            const label = getDayLabel(day);
            const parts = label.split(/\s+/);
            const dayName = (parts[0] || '').replace(/[^A-Za-z]/g, '');
            const parsedDate = parseDayDate(label);
            let dateNum = parsedDate?.getDate() || 0;
            if (!dateNum) {
                for (let i = 1; i < parts.length; i++) {
                    const n = parseInt(parts[i], 10);
                    if (!isNaN(n) && n >= 1 && n <= 31) {
                        dateNum = n;
                        break;
                    }
                }
            }
            if (!dateNum) {
                const txt = day.querySelector('[class*="date"]')?.innerText || '';
                const m = txt.match(/\d+/);
                if (m) {
                    dateNum = parseInt(m[0], 10);
                }
            }
            const DOW_MAP = {
                Sunday: 0,
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6
            };
            const dayOfWeek = parsedDate ? parsedDate.getDay() : (DOW_MAP[dayName] ?? -1);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const absence = getAbsenceInfo(day);
            const workTargetMins = getDayWorkTargetMinutes(day);
            let isToday = !!day.querySelector('.today_chip');
            let isPast = false;
            let isFuture = false;
            if (parsedDate) {
                const stamp = getLocalDayStamp(parsedDate);
                isToday = isToday || stamp === nowStamp;
                isPast = stamp < nowStamp;
                isFuture = stamp > nowStamp;
            } else if (markerTodayIdx !== -1) {
                isToday = idx === markerTodayIdx;
                isPast = idx < markerTodayIdx;
                isFuture = idx > markerTodayIdx;
            }
            const totalMins = getLiveDayMinutes(day);
            let officeMins = 0;
            let wfhMins = 0;
            let hasOffice = false;
            let hasWFH = false;
            day.querySelectorAll('.tt_period_container').forEach(p => {
                const dur = getPeriodMinutes(p, isToday);
                if (dur <= 0) return;
                const act = p.querySelector('.chosen-single span')?.innerText.trim() || '';
                if (act === 'Office') {
                    officeMins += dur;
                    hasOffice = true;
                }
                if (act === 'Mobile Working') {
                    wfhMins += dur;
                    hasWFH = true;
                }
            });
            return {
                key: getDateKey(parsedDate, `idx-${idx}`),
                label,
                date: parsedDate,
                dayName,
                dateNum,
                dayOfWeek,
                isWeekend,
                absenceText: absence.text,
                isAbsent: absence.isFullAbsence && !absence.isHoliday,
                isHoliday: absence.isHoliday,
                isHalfDay: absence.isHalfDay,
                halfDayPart: absence.halfDayPart,
                isToday,
                isPast,
                isFuture,
                totalMins,
                officeMins,
                wfhMins,
                hasOffice,
                hasWFH,
                workTargetMins,
                remainingWorkMins: Math.max(0, workTargetMins - totalMins),
                isWorkable: workTargetMins > 0,
                weekIndex: 0,
                el: day
            };
        });
        let weekIdx = 0;
        days.forEach((d, i) => {
            if (i > 0 && d.dayOfWeek === 1 && days[i - 1].dayOfWeek !== 1) {
                weekIdx++;
            }
            d.weekIndex = weekIdx;
        });
        return days;
    };
    const getDayStats = summary => {
        const realRota = Math.max(0, summary.rota - summary.absences - summary.holidays);
        const days = getDetailedDayData();
        const workableDays = days.filter(d => d.isWorkable).length;
        const workableMinutes = days.reduce(
            (sum, d) => sum + d.workTargetMins, 0);
        const workedDays = days.filter(d => !d.isWeekend && d.totalMins > 0).length;
        const progressPct = realRota > 0 ? (summary.recorded / realRota) * 100 : 0;
        const remainingMinutes = Math.max(0, realRota - summary.recorded);
        const daysLeft = remainingMinutes > 0 ? round1(Math.ceil(remainingMinutes / HALF_DAY_MINUTES) / 2) : 0;
        const hasToday = days.some(d => d.isToday);
        let bufferMinutes;
        let priorBufferMinutes;
        if (!hasToday) {
            bufferMinutes = summary.difference;
            priorBufferMinutes = summary.difference;
        } else {
            bufferMinutes = 0;
            priorBufferMinutes = 0;
            days.forEach(d => {
                if (d.isFuture) return;
                if (d.isAbsent || d.isHoliday) {
                    return;
                }
                const target = d.workTargetMins;
                const worked = d.totalMins;
                /*
                 * Buffer is a variance bank, not a countdown.
                 * A workable day with no recorded time is assumed
                 * to have met its target, so only real deviations
                 * from the target affect the balance.
                 */
                if (d.isPast) {
                    const effectiveWorked = worked > 0 ? worked : target;
                    const diff = effectiveWorked - target;
                    bufferMinutes += diff;
                    priorBufferMinutes += diff;
                } else if (d.isToday) {
                    if (worked <= 0) return;
                    const isRunning = [...d.el.querySelectorAll('.tt_period_container')].some(isOpenPeriod);
                    const missingBreakMinutes = getMissingMandatoryBreakMinutes(d.el);
                    const effectiveWorked = Math.max(0, worked - missingBreakMinutes);
                    /*
                     * Keep the buffer neutral while today's normal target has not
                     * yet been reached. Once it is reached, predict the balance
                     * eDays will show after applying any still-missing mandatory break.
                     *
                     * Example with an 8h target and 30m mandatory break:
                     * 8h00 worked, no break -> -30m
                     * 8h15 worked, no break -> -15m
                     * 8h30 worked, no break -> 0m
                     */
                    const todayDiff = isRunning && worked < target ? 0 : effectiveWorked - target;
                    bufferMinutes += todayDiff;
                }
            });
            bufferMinutes = Math.round(bufferMinutes);
            priorBufferMinutes = Math.round(priorBufferMinutes);
        }
        return {
            workableDays,
            workableMinutes,
            workableHours: round1(workableMinutes / 60),
            daysLeft,
            remainingMinutes,
            workedDays,
            progressPct,
            bufferMinutes,
            priorBufferMinutes,
            realRota
        };
    };
    const getTodayInfo = () => {
        const el = [...document.querySelectorAll('.tt_day_container')].find(d => d.querySelector('.today_chip'));
        if (!el) return null;
        let workedMinutes = 0;
        let isRunning = false;
        el.querySelectorAll('.tt_period_container').forEach(p => {
            workedMinutes += getPeriodMinutes(p, true);
            if (isOpenPeriod(p)) {
                isRunning = true;
            }
        });
        workedMinutes = Math.max(workedMinutes, getDayTotalMinutes(el));
        const absence = getAbsenceInfo(el);
        return {
            el,
            workedMinutes,
            targetMinutes: getDayWorkTargetMinutes(el),
            absenceText: absence.text,
            isHalfDay: absence.isHalfDay,
            halfDayPart: absence.halfDayPart,
            isHoliday: absence.isHoliday,
            isFullAbsence: absence.isFullAbsence,
            isRunning
        };
    };
    const getTodayMinutes = () => getTodayInfo()?.workedMinutes || 0;
    const hasTodayOnPage = () => !!document.querySelector('.today_chip');
    /* ═══════════════════════════════════════════════════════════════
       HOURS-BASED SCHEDULE PLANNER
    ═══════════════════════════════════════════════════════════════ */
    const buildHoursSchedulePlan = ({
        days,
        officeHoursStillNeeded
    }) => {
        if (officeHoursStillNeeded <= 0) {
            return new Map();
        }
        const future = days.filter(d => (d.isFuture || d.isToday) && d.isWorkable && d.remainingWorkMins > 0);
        if (!future.length) {
            return new Map();
        }
        let remaining = round1(officeHoursStillNeeded);
        const weekMap = new Map();
        future.forEach(d => {
            const wk = d.weekIndex;
            if (!weekMap.has(wk)) {
                weekMap.set(wk, []);
            }
            weekMap.get(wk).push(d);
        });
        const DOW_PREF = {
            3: 0,
            2: 1,
            4: 2,
            1: 3,
            5: 4
        };
        weekMap.forEach(w => w.sort(
            (a, b) => (DOW_PREF[a.dayOfWeek] ?? 9) - (DOW_PREF[b.dayOfWeek] ?? 9)));
        const weeks = [...weekMap.entries()].sort(
            (a, b) => a[0] - b[0]);
        const planned = new Map();
        weeks.forEach(
            ([, wdays], wi) => {
                if (remaining <= 0) {
                    return;
                }
                const weeksLeft = weeks.length - wi;
                const quota = round1(Math.ceil(
                    (remaining / weeksLeft) * 10) / 10);
                let assigned = 0;
                for (const d of wdays) {
                    if (remaining <= 0 || assigned >= quota) {
                        break;
                    }
                    const capacityH = round1(d.remainingWorkMins / 60);
                    if (capacityH <= 0) {
                        continue;
                    }
                    const h = round1(Math.min(capacityH, remaining, quota - assigned));
                    if (h <= 0) {
                        continue;
                    }
                    planned.set(d.key, h);
                    assigned = round1(assigned + h);
                    remaining = round1(Math.max(0, remaining - h));
                }
            });
        return planned;
    };
    /* ═══════════════════════════════════════════════════════════════
       STYLES
    ═══════════════════════════════════════════════════════════════ */
    const STYLE_ID = 'edays-pro-v18-styles';
    const injectStyles = T => {
        let s = document.getElementById(STYLE_ID);
        if (!s) {
            s = document.createElement('style');
            s.id = STYLE_ID;
            s.classList.add('darkreader');
            document.head.appendChild(s);
        }
        s.textContent = `
        #ep13{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:${T.bg};border-radius:14px;padding:14px 16px 12px;margin:0 0 16px;color:${T.text};}
        #ep13 .ep-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid ${T.border};}
        #ep13 .ep-hdr-logo{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#a855f7);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        #ep13 .ep-hdr-title{font-size:17px;font-weight:700;letter-spacing:-0.3px;color:${T.text};}
        #ep13 .ep-hdr-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
        #ep13 .ep-hdr-date{font-size:13px;color:${T.muted};letter-spacing:0.5px;display:flex;align-items:center;gap:5px;}
        #ep13 .ep-pulse{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:ep-pulse 3.5s ease-in-out infinite;}
        @keyframes ep-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
        #ep13 .ep-btn{display:inline-flex;align-items:center;gap:5px;margin-left:8px;height:20px;margin-top:4px;cursor:pointer;text-align:left;border:1px solid #bcc1c2;box-shadow:0 2px 3px rgba(0,0,0,.1);border-radius:5px;padding:3px 4px;font-size:12px;font-weight:500;background:transparent;color:inherit;transition:background .15s,color .15s,border-color .15s;user-select:none;white-space:nowrap;}
        #ep13 .ep-btn > span{color:#inherit!important;}
        #ep13 .ep-btn-icon{width:26px;height:26px;padding:0;justify-content:center;}
        #ep13 .ep-btn-label{padding:3px 4px;}
        #ep13 .ep-btn-pill{padding:3px 6px;gap:6px;}
        #ep13 .ep-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        #ep13 .ep-card{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;}
        #ep13 .ep-card-title{font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-act-row{display:flex;align-items:center;gap:8px;}
        #ep13 .ep-act-info{flex:1;min-width:0;}
        #ep13 .ep-act-name{font-size:13px;font-weight:600;color:${T.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;}
        #ep13 .ep-act-meta{font-size:12px;color:${T.muted};line-height:1.3;}
        #ep13 .ep-bar{height:3px;background:${T.barTrack};border-radius:3px;margin-top:3px;overflow:hidden;}
        #ep13 .ep-bar-fill{height:100%;border-radius:3px;}
        #ep13 .ep-divider{height:1px;background:${T.border};margin:2px 0;}
        #ep13 .ep-total-row{display:flex;justify-content:space-between;align-items:center;}
        #ep13 .ep-total-label{font-size:12px;color:${T.muted};}
        #ep13 .ep-total-val{font-size:13px;font-weight:600;color:${T.text};}
        #ep13 .ep-ring-card{align-items:center;text-align:center;}
        #ep13 .ep-ring-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:122px;height:122px;flex-shrink:0;}
        #ep13 .ep-ring-wrap svg{position:absolute;top:0;left:0;width:122px;height:122px;}
        #ep13 .ep-ring-center{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;}
        #ep13 .ep-ring-pct{font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1;}
        #ep13 .ep-ring-lbl{font-size:10px;color:${T.muted};letter-spacing:0.8px;text-transform:uppercase;margin-top:1px;}
        #ep13 .ep-stat-row{display:flex;justify-content:space-between;width:100%;}
        #ep13 .ep-stat-k{font-size:12px;color:${T.muted};}
        #ep13 .ep-stat-v{font-size:12px;font-weight:600;color:${T.text};}
        #ep13 .ep-hint{font-size:12px;color:${T.muted};display:flex;align-items:center;gap:4px;margin-top:2px;}
        #ep13 .ep-buf-top{display:flex;align-items:center;gap:8px;}
        #ep13 .ep-buf-val{font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1;}
        #ep13 .ep-buf-val.pos{color:#22c55e;}
        #ep13 .ep-buf-val.neg{color:#ef4444;}
        #ep13 .ep-buf-val.zer{color:${T.muted};}
        #ep13 .ep-buf-sub{font-size:12px;color:${T.muted};line-height:1.4;}
        #ep13 .ep-chip-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
        #ep13 .ep-chip{background:${T.chipBg};border:1px solid ${T.border};border-radius:7px;padding:7px 8px;text-align:center;}
        #ep13 .ep-chip-val{font-size:20px;font-weight:700;line-height:1;color:${T.text};}
        #ep13 .ep-chip-lbl{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;}
        #ep13 .ep-prog-wrap{width:100%;}
        #ep13 .ep-prog-hdr{display:flex;justify-content:space-between;font-size:11px;color:${T.muted};margin-bottom:4px;}
        #ep13 .ep-prog-track{height:5px;background:${T.barTrack};border-radius:5px;overflow:hidden;}
        #ep13 .ep-prog-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,#3b82f6,#a855f7);}
        #ep13 .ep-notice{display:flex;align-items:center;gap:5px;font-size:12px;color:${T.muted};}
        #ep13 .ep-notice.warn{color:#ef4444;}
        #ep13 .ep-notice.good{color:#22c55e;}
        #ep13 .ep-notices{display:flex;flex-direction:column;gap:4px;}
        #ep13 .ep-today-strip{margin-top:10px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:16px;}
        #ep13 .ep-today-label{display:flex;align-items:center;gap:8px;flex-shrink:0;}
        #ep13 .ep-today-label-text{font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:${T.muted};white-space:nowrap;}
        #ep13 .ep-today-centre{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;}
        #ep13 .ep-today-nums-row{display:flex;align-items:baseline;gap:6px;}
        #ep13 .ep-today-done{font-size:20px;font-weight:800;letter-spacing:-0.5px;line-height:1;color:${T.text};}
        #ep13 .ep-today-sep{font-size:13px;color:${T.muted};}
        #ep13 .ep-today-total{font-size:13px;color:${T.muted};}
        #ep13 .ep-today-rem{font-size:12px;color:${T.muted};margin-left:6px;display:flex;align-items:center;gap:4px;}
        #ep13 .ep-today-rem.done{color:#22c55e;}
        #ep13 .ep-today-track{height:5px;background:${T.barTrack};border-radius:5px;overflow:hidden;}
        #ep13 .ep-today-fill{height:100%;border-radius:5px;transition:width .4s ease;}
        #ep13 .ep-today-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
        #ep13 .ep-toggle-track{display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;vertical-align:middle;flex-shrink:0;transition:background .2s;}
        #ep13 .ep-toggle-thumb{position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:2px;box-shadow:0 1px 2px rgba(0,0,0,0.25);transition:left .2s;}

        /* TODAY HIGHLIGHT — native eDays row */
        .tt_day_container:has(.today_chip){
            position:relative;
            z-index:2;
            background:linear-gradient(100deg,#eef6ff 0%,#f3f2ff 55%,#f8fbff 100%)!important;
            border-radius:7px!important;
            outline:1px solid rgba(37,99,235,.52);
            outline-offset:-1px;
            box-shadow:
                inset 4px 0 0 #2563eb,
                0 5px 16px rgba(37,99,235,.12),
                0 1px 3px rgba(15,23,42,.08)!important;
            margin-bottom:12px!important;
        }

        /* Header gets a stronger tint so Today reads immediately when scanning the month. */
        .timesheet_day_header.timesheet_today{
            background:linear-gradient(90deg,#dbeafe 0%,#e8efff 58%,#f4f8ff 100%)!important;
            border-color:rgba(37,99,235,.38)!important;
            padding-left:10px!important;
            box-sizing:border-box!important;
            transition:background .18s ease,box-shadow .18s ease;
        }
        .timesheet_day_header.timesheet_today .timesheet_day_text{
            font-weight:750!important;
            color:#172554!important;
        }

        /* Carry the Today treatment through the complete editable area, not only the header. */
        .timesheet_day_header.timesheet_today + .tt_day_inner_container{
            background:linear-gradient(100deg,#eff6ff 0%,#f5f3ff 58%,#fafcff 100%)!important;
            border-color:rgba(59,130,246,.26)!important;
            padding-left:10px!important;
            padding-right:5px!important;
            box-sizing:border-box!important;
        }

        /* Keep native eDays working-period cards untouched.
           Today differentiation is applied only to the surrounding day structure. */
        .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_break_container,
        .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_total_container{
            background:rgba(255,255,255,.20)!important;
        }

        /* Compact Today pill: visible, but no longer taller than the header content. */
        .timesheet_day_header.timesheet_today .today_chip{
            display:inline-flex!important;
            align-items:center!important;
            justify-content:center!important;
            gap:5px!important;
            height:20px!important;
            min-height:20px!important;
            line-height:16px!important;
            padding:1px 8px!important;
            box-sizing:border-box!important;
            border:1px solid rgba(37,99,235,.38)!important;
            border-radius:999px!important;
            background:linear-gradient(135deg,#3b82f6,#2563eb)!important;
            color:#fff!important;
            font-size:11px!important;
            font-weight:700!important;
            letter-spacing:.15px!important;
            box-shadow:0 2px 6px rgba(37,99,235,.20)!important;
        }
        .timesheet_day_header.timesheet_today .today_chip::before{
            content:'';
            width:5px;
            height:5px;
            flex:0 0 5px;
            border-radius:50%;
            background:#fff;
            box-shadow:0 0 0 2px rgba(255,255,255,.18);
        }

        /* Fallback for browsers without :has(): header + body still remain highlighted. */
        @supports not selector(:has(*)){
            .timesheet_day_header.timesheet_today{
                box-shadow:inset 4px 0 0 #2563eb;
            }
            .timesheet_day_header.timesheet_today + .tt_day_inner_container{
                box-shadow:inset 4px 0 0 #2563eb;
            }
        }

        /* EMPTY STATE */
        #ep13 .ep-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:28px 16px;text-align:center;}
        #ep13 .ep-empty-icon{width:44px;height:44px;background:${T.surface};border:1px solid ${T.border};border-radius:12px;display:flex;align-items:center;justify-content:center;}
        #ep13 .ep-empty-title{font-size:15px;font-weight:700;color:${T.text};}
        #ep13 .ep-empty-sub{font-size:13px;color:${T.muted};line-height:1.5;max-width:340px;}

        /* OFFICE PLANNER */
        #ep13 .ep-planner-toggle{margin-top:8px;display:flex;align-items:center;gap:8px;padding:8px 14px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;cursor:pointer;user-select:none;transition:background .15s;}
        #ep13 .ep-planner-toggle:hover{background:${T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)'};}
        #ep13 .ep-planner-toggle-label{flex:1;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-planner-toggle-sub{font-size:11px;font-weight:400;color:${T.muted};opacity:.7;letter-spacing:0;text-transform:none;}
        #ep13 .ep-planner-panel{overflow:hidden;max-height:0;opacity:0;transition:max-height .35s ease,opacity .25s ease,margin-top .25s ease;margin-top:0;}
        #ep13 .ep-planner-panel.open{max-height:3000px;opacity:1;margin-top:8px;}
        #ep13 .ep-planner-inner{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:14px;}

        /* SCHEDULE */
        #ep13 .ep-sched-section{display:flex;flex-direction:column;gap:10px;}
        #ep13 .ep-sched-hdr{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-sched-legend{display:flex;gap:12px;flex-wrap:wrap;}
        #ep13 .ep-sched-leg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:${T.muted};}
        #ep13 .ep-sched-leg-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0;}
        #ep13 .ep-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
        #ep13 .ep-cal-dow{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${T.muted};text-align:center;padding:2px 0 4px;}
        #ep13 .ep-cal-day{aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;position:relative;transition:transform .1s;flex-direction:column;gap:1px;}
        #ep13 .ep-cal-day.ep-cal-empty{background:transparent;}
        #ep13 .ep-cal-day.ep-cal-weekend{background:${T.chipBg};color:${T.muted};opacity:.4;}
        #ep13 .ep-cal-day.ep-cal-absent{background:${T.chipBg};color:${T.muted};opacity:.5;}
        #ep13 .ep-cal-day.ep-cal-done-off{background:rgba(34,197,94,.18);color:#22c55e;border:1px solid rgba(34,197,94,.3);}
        #ep13 .ep-cal-day.ep-cal-done-wfh{background:rgba(168,85,247,.15);color:#a855f7;border:1px solid rgba(168,85,247,.25);}
        #ep13 .ep-cal-day.ep-cal-done-any{background:rgba(100,116,139,.15);color:${T.muted};}
        #ep13 .ep-cal-day.ep-cal-plan-off{background:rgba(59,130,246,.18);color:#3b82f6;border:1px solid rgba(59,130,246,.35);}
        #ep13 .ep-cal-day.ep-cal-plan-wfh{background:${T.chipBg};color:${T.muted};border:1px solid ${T.border};}
        #ep13 .ep-cal-day.ep-cal-today{outline:2px solid #f59e0b;outline-offset:1px;}
        #ep13 .ep-cal-day .ep-cal-hrs{font-size:8px;opacity:.75;line-height:1;}
        #ep13 .ep-week-rows{display:flex;flex-direction:column;gap:5px;}
        #ep13 .ep-week-row{display:flex;align-items:center;gap:6px;}
        #ep13 .ep-week-label{font-size:10px;color:${T.muted};font-weight:600;min-width:30px;letter-spacing:.5px;}
        #ep13 .ep-week-days{display:flex;gap:3px;flex:1;}
        #ep13 .ep-week-day-pill{flex:1;padding:4px 2px;border-radius:5px;text-align:center;font-size:10px;font-weight:700;letter-spacing:.3px;display:flex;flex-direction:column;align-items:center;gap:1px;}
        #ep13 .ep-week-day-pill .ep-pill-sub{font-size:8px;font-weight:400;opacity:.8;}
        #ep13 .ep-week-day-pill.ep-wp-office{background:rgba(59,130,246,.2);color:#3b82f6;}
        #ep13 .ep-week-day-pill.ep-wp-done{background:rgba(34,197,94,.18);color:#22c55e;}
        #ep13 .ep-week-day-pill.ep-wp-wfh{background:${T.chipBg};color:${T.muted};}
        #ep13 .ep-week-day-pill.ep-wp-off{background:transparent;color:${T.muted};opacity:.35;}
        #ep13 .ep-week-day-pill.ep-wp-absent{background:${T.chipBg};color:${T.muted};opacity:.4;font-size:9px;}
        #ep13 .ep-week-row-summary{font-size:11px;color:${T.muted};min-width:100px;text-align:right;}
        #ep13 .ep-week-row-summary span{color:${T.text};font-weight:600;}
        #ep13 .ep-hours-progress{display:flex;flex-direction:column;gap:4px;}
        #ep13 .ep-hours-prog-hdr{display:flex;justify-content:space-between;font-size:11px;color:${T.muted};}
        #ep13 .ep-hours-prog-track{height:6px;background:${T.barTrack};border-radius:6px;overflow:hidden;display:flex;}
        #ep13 .ep-hours-prog-done{height:100%;background:linear-gradient(90deg,#22c55e,#84cc16);}
        #ep13 .ep-hours-prog-plan{height:100%;background:linear-gradient(90deg,#3b82f6,#6366f1);}
        #ep13 .ep-sched-stat{background:${T.chipBg};border:1px solid ${T.border};border-radius:8px;padding:9px 10px;text-align:center;}
        #ep13 .ep-sched-stat-val{font-size:18px;font-weight:700;line-height:1;}
        #ep13 .ep-sched-stat-lbl{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;margin-top:3px;}
        #ep13 .ep-btn:hover{background:${T.isDark?'#fff':'#F0F0F0'}!important;color:${T.isDark?'#111':'inherit'}!important;border-color:${T.isDark?'#fff':'#bcc1c2'}!important;}


        /* ═══════════════════════════════════════════════════════════
           v19.3 — SITE-WIDE THEME / RELOCATED CONTROLS
        ═══════════════════════════════════════════════════════════ */
        #ep13 .ep-hdr{display:none!important;}
        #timesheetMonthHeader h2 .ep-enhanced-text{
            margin-left:6px;
            font-weight:800;
            background:linear-gradient(90deg,#3b82f6 0%,#a855f7 35%,#22d3ee 65%,#3b82f6 100%);
            background-size:260% 100%;
            background-position:0% 50%;
            -webkit-background-clip:text;
            background-clip:text;
            color:transparent!important;
            -webkit-text-fill-color:transparent;
            animation:ep-enhanced-gradient 4.8s ease-in-out infinite;
            will-change:background-position;
        }
        @keyframes ep-enhanced-gradient{
            0%{background-position:0% 50%;}
            50%{background-position:100% 50%;}
            100%{background-position:0% 50%;}
        }
        @media (prefers-reduced-motion: reduce){
            #timesheetMonthHeader h2 .ep-enhanced-text{
                animation:none!important;
                background-position:50% 50%;
            }
        }
        #ep-site-theme-action{margin:0;}

        html.ep-site-dark,
        body.ep-site-dark{
            color-scheme:dark;
            background:#111318!important;
            color:#e8edf5!important;
        }
        body.ep-site-dark #main_content_wrapper,
        body.ep-site-dark #time-recording-content-wrapper,
        body.ep-site-dark #mainTimesheetContainer,
        body.ep-site-dark #mainTimesheetPanel,
        body.ep-site-dark .timesheet_container,
        body.ep-site-dark .timesheet_main_area,
        body.ep-site-dark .timesheet_week,
        body.ep-site-dark #global_help_section,
        body.ep-site-dark #mobileMyEntitlementPanel,
        body.ep-site-dark .contentHolder{
            background:#111318!important;
            color:#e8edf5!important;
        }
        body.ep-site-dark .top-title-bar,
        body.ep-site-dark #topMobileNav,
        body.ep-site-dark #top_nav,
        body.ep-site-dark #main_menu_bar,
        body.ep-site-dark #new_menu_spacer{
            background:#171a20!important;
            color:#e8edf5!important;
            border-color:#2f3540!important;
        }
        body.ep-site-dark .top-title-bar *,
        body.ep-site-dark #topMobileNav *,
        body.ep-site-dark #main_menu_bar *{
            color:inherit;
        }
        body.ep-site-dark #profile_popup,
        body.ep-site-dark #notifications_panel,
        body.ep-site-dark #notifications_panel_header,
        body.ep-site-dark #notifications_panel_content,
        body.ep-site-dark .menu_items_list,
        body.ep-site-dark .menu_header{
            background:#1c2027!important;
            color:#e8edf5!important;
            border-color:#343b46!important;
        }
        body.ep-site-dark #profile_popup_arrow_back{
            border-bottom-color:#1c2027!important;
        }

        body.ep-site-dark .timesheet_header,
        body.ep-site-dark .timesheet_week_summary,
        body.ep-site-dark .week_summary_header,
        body.ep-site-dark .timesheet_week_summary_list_monthly,
        body.ep-site-dark .timeline-controls,
        body.ep-site-dark .tt_day_inner_container,
        body.ep-site-dark .tt_period_container,
        body.ep-site-dark .tt_period_middle_container,
        body.ep-site-dark .tt_period_inner_container,
        body.ep-site-dark .tt_break_container,
        body.ep-site-dark .tt_total_container,
        body.ep-site-dark .total_hours_only_container{
            background:#1b1f26!important;
            color:#e8edf5!important;
            border-color:#343b46!important;
        }
        body.ep-site-dark .timesheet_week_header:not(.authorised_header):not(.pending_header):not(.rejected_header),
        body.ep-site-dark .timesheet_day_header:not(.timesheet_today){
            background:#20252d!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark .timesheet_day_text,
        body.ep-site-dark .timesheet_absence_text,
        body.ep-site-dark .timesheet_day_actions,
        body.ep-site-dark .timesheet_day_action,
        body.ep-site-dark .week_headers,
        body.ep-site-dark .week_number,
        body.ep-site-dark .header_title,
        body.ep-site-dark .summary_block,
        body.ep-site-dark .tt_time_input_label,
        body.ep-site-dark .duration_hours,
        body.ep-site-dark .total_hours_only{
            color:#e8edf5!important;
        }
        body.ep-site-dark .timesheet_day_action svg,
        body.ep-site-dark .material-icons{
            color:#b8c1ce!important;
            fill:#b8c1ce!important;
        }
        body.ep-site-dark #monthSummary a:not(.pendingWeek):not(.authorisedWeek):not(.rejectedWeek),
        body.ep-site-dark .timeline-controls a:not(.pendingWeek):not(.authorisedWeek):not(.rejectedWeek){
            background:#20252d!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark #monthSummary a.selectedWeek,
        body.ep-site-dark .timeline-controls a.selectedWeek{
            box-shadow:inset 0 0 0 2px #3b82f6!important;
        }

        body.ep-site-dark input,
        body.ep-site-dark select,
        body.ep-site-dark textarea,
        body.ep-site-dark .chosen-container .chosen-single,
        body.ep-site-dark .chosen-container .chosen-drop,
        body.ep-site-dark .chosen-container .chosen-results,
        body.ep-site-dark .chosen-container .chosen-results li,
        body.ep-site-dark .ui-widget-content{
            background:#15191f!important;
            color:#e8edf5!important;
            border-color:#3a424e!important;
        }
        body.ep-site-dark input::placeholder,
        body.ep-site-dark textarea::placeholder{
            color:#8d98a8!important;
        }
        body.ep-site-dark input[type="time"]{
            color-scheme:dark;
        }
        body.ep-site-dark .chosen-container .chosen-results li.highlighted{
            background:#2563eb!important;
            color:#fff!important;
        }

        body.ep-site-dark .v3-button-container.secondary,
        body.ep-site-dark .button-secondary,
        body.ep-site-dark .headerButton{
            background:#252b34!important;
            color:#e8edf5!important;
            border-color:#46505e!important;
        }
        body.ep-site-dark .v3-button-container.secondary:hover,
        body.ep-site-dark .button-secondary:hover,
        body.ep-site-dark .headerButton:hover{
            background:#303844!important;
            color:#fff!important;
            border-color:#5a6677!important;
        }
        body.ep-site-dark .v3-button-container.secondary svg,
        body.ep-site-dark .v3-button-container.secondary .v3-icon{
            fill:currentColor!important;
            color:inherit!important;
        }

        body.ep-site-dark .ui-dialog,
        body.ep-site-dark .ui-dialog-titlebar,
        body.ep-site-dark .ui-dialog-content,
        body.ep-site-dark .ui-dialog-buttonpane,
        body.ep-site-dark .global_dialog,
        body.ep-site-dark [class*="modal"]{
            background:#1b1f26!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark .ui-dialog-titlebar{
            background:#20252d!important;
        }

        body.ep-site-dark #footer,
        body.ep-site-dark #footer .container_12,
        body.ep-site-dark .edaysFooterLine,
        body.ep-site-dark #edaysFooterButtonContainer{
            background:#111318!important;
            color:#aeb8c6!important;
            border-color:#2f3540!important;
        }
        body.ep-site-dark #footer a{color:#8ab4ff!important;}
        body.ep-site-dark #footer img{filter:invert(1) brightness(1.35);}

        body.ep-site-dark .tt_day_container:has(.today_chip){
            background:linear-gradient(100deg,#172235 0%,#201d35 55%,#171c27 100%)!important;
            outline-color:rgba(96,165,250,.62)!important;
            box-shadow:inset 4px 0 0 #3b82f6,0 5px 16px rgba(0,0,0,.28)!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today{
            background:linear-gradient(90deg,#1c2d48 0%,#282545 58%,#1d2532 100%)!important;
            border-color:rgba(96,165,250,.42)!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today .timesheet_day_text{
            color:#eaf2ff!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container{
            background:linear-gradient(100deg,#172438 0%,#211f36 58%,#181e29 100%)!important;
            border-color:rgba(96,165,250,.28)!important;
        }

        /* SETTINGS MODAL */
        .ep-settings-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}
        .ep-settings-modal{width:min(420px,calc(100vw - 32px));background:${T.bg};color:${T.text};border:1px solid ${T.border};border-radius:12px;box-shadow:${T.shadow};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;overflow:hidden;}
        .ep-settings-hdr{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid ${T.border};}
        .ep-settings-title{font-size:15px;font-weight:700;flex:1;}
        .ep-settings-close{border:0;background:transparent;color:${T.muted};font-size:22px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:6px;}
        .ep-settings-close:hover{background:${T.faint};color:${T.text};}
        .ep-settings-body{padding:16px;display:flex;flex-direction:column;gap:14px;}
        .ep-settings-field{display:flex;flex-direction:column;gap:5px;}
        .ep-settings-label{font-size:12px;font-weight:700;color:${T.text};}
        /* v19.3 refinement — Dark Reader-inspired neutral palette */
        html.ep-site-dark,
        body.ep-site-dark{
            background:#181a1b!important;
            color:#e8e6e3!important;
        }
        body.ep-site-dark #main_content_wrapper,
        body.ep-site-dark #time-recording-content-wrapper,
        body.ep-site-dark #mainTimesheetContainer,
        body.ep-site-dark #mainTimesheetPanel,
        body.ep-site-dark .timesheet_container,
        body.ep-site-dark .timesheet_main_area,
        body.ep-site-dark .timesheet_week,
        body.ep-site-dark #global_help_section,
        body.ep-site-dark #mobileMyEntitlementPanel,
        body.ep-site-dark .contentHolder,
        body.ep-site-dark #footer{
            background:#181a1b!important;
            color:#e8e6e3!important;
        }
        body.ep-site-dark .top-title-bar,
        body.ep-site-dark #topMobileNav,
        body.ep-site-dark #top_nav,
        body.ep-site-dark #main_menu_bar,
        body.ep-site-dark #new_menu_spacer{
            background:#1b1e1f!important;
            color:#e8e6e3!important;
            border-color:#3a3e41!important;
        }
        body.ep-site-dark #profile_popup,
        body.ep-site-dark #notifications_panel,
        body.ep-site-dark #notifications_panel_header,
        body.ep-site-dark #notifications_panel_content,
        body.ep-site-dark .menu_items_list,
        body.ep-site-dark .menu_header,
        body.ep-site-dark .timesheet_header,
        body.ep-site-dark .timesheet_week_summary,
        body.ep-site-dark .week_summary_header,
        body.ep-site-dark .timesheet_week_summary_list_monthly,
        body.ep-site-dark .timeline-controls,
        body.ep-site-dark .tt_day_inner_container,
        body.ep-site-dark .tt_period_container,
        body.ep-site-dark .tt_period_middle_container,
        body.ep-site-dark .tt_period_inner_container,
        body.ep-site-dark .tt_break_container,
        body.ep-site-dark .tt_total_container,
        body.ep-site-dark .total_hours_only_container,
        body.ep-site-dark .ui-dialog,
        body.ep-site-dark .ui-dialog-content,
        body.ep-site-dark .ui-dialog-titlebar{
            background:#202324!important;
            color:#e8e6e3!important;
            border-color:#3a3e41!important;
        }
        body.ep-site-dark .timesheet_week_header:not(.authorised_header):not(.pending_header):not(.rejected_header),
        body.ep-site-dark .timesheet_day_header:not(.timesheet_today){
            background:#25282a!important;
            color:#e8e6e3!important;
            border-color:#454a4d!important;
        }
        body.ep-site-dark input,
        body.ep-site-dark textarea,
        body.ep-site-dark select,
        body.ep-site-dark .chosen-container .chosen-single,
        body.ep-site-dark .chosen-container .chosen-drop,
        body.ep-site-dark .chosen-container .chosen-results,
        body.ep-site-dark .chosen-container .chosen-results li{
            background:#181a1b!important;
            color:#e8e6e3!important;
            border-color:#454a4d!important;
        }
        body.ep-site-dark input::placeholder,
        body.ep-site-dark textarea::placeholder{
            color:#9b958d!important;
            opacity:.8!important;
        }
        body.ep-site-dark a:not(.button):not(.v3-button-container),
        body.ep-site-dark .timesheet_day_action{
            color:#3391ff!important;
        }
        body.ep-site-dark hr,
        body.ep-site-dark .edaysFooterLine{
            border-color:#3a3e41!important;
            background:#3a3e41!important;
        }
        body.ep-site-dark ::selection{
            background:#004daa!important;
            color:#e8e6e3!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today{
            background:linear-gradient(90deg,#1f3448 0%,#252b3a 58%,#202426 100%)!important;
            border-color:#466580!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container{
            background:linear-gradient(100deg,#1d272d 0%,#23252d 58%,#202324 100%)!important;
            border-color:#3f5260!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today .timesheet_day_text{
            color:#d8e8f7!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_break_container,
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_total_container{
            background:#202324!important;
        }

        .ep-settings-help{font-size:11px;color:${T.muted};line-height:1.4;}
        .ep-settings-input-wrap{display:flex;align-items:center;gap:8px;}
        .ep-settings-input{flex:1;min-width:0;background:${T.surface};color:${T.text};border:1px solid ${T.border};border-radius:7px;padding:8px 10px;font-size:14px;outline:none;}
        .ep-settings-input:focus{border-color:#3b82f6;box-shadow:0 0 0 2px rgba(59,130,246,.15);}
        .ep-settings-unit{font-size:12px;color:${T.muted};min-width:54px;}
        .ep-settings-error{display:none;font-size:12px;color:#ef4444;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:7px;padding:8px 10px;}
        .ep-settings-actions{display:flex;justify-content:space-between;gap:8px;padding:12px 16px;border-top:1px solid ${T.border};}
        .ep-settings-actions-right{display:flex;gap:8px;margin-left:auto;}
        .ep-settings-btn{border:1px solid ${T.border};background:${T.surface};color:${T.text};border-radius:7px;padding:7px 10px;font-size:12px;font-weight:600;cursor:pointer;}
        .ep-settings-btn:hover{background:${T.faint};}
        .ep-settings-btn.primary{background:#3b82f6;border-color:#3b82f6;color:#fff;}
        .ep-settings-btn.primary:hover{background:#2563eb;}
        `;
    };

    /* ═══════════════════════════════════════════════════════════════
       SITE-WIDE THEME CONTROLS
    ═══════════════════════════════════════════════════════════════ */
    const SITE_THEME_ACTION_ID = 'ep-site-theme-action';
    let siteThemeRetryTimer = null;
    let siteThemeRetryCount = 0;

    const DARK_READER_THEME = Object.freeze({
        mode: 1,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        sepia: 0,
        darkSchemeBackgroundColor: '#181a1b',
        darkSchemeTextColor: '#e8e6e3',
        scrollbarColor: 'auto',
        selectionColor: 'auto',
        styleSystemControls: true,
    });

    const DARK_READER_FIXES = Object.freeze({
        invert: [],
        css: '',
        ignoreInlineStyle: [],
        ignoreImageAnalysis: [
            '#ep13 .ep-hdr-logo',
            '#timesheetMonthHeader h2 .ep-enhanced-text',
        ],
        disableStyleSheetsProxy: false,
        ignoreCSSUrl: [],
    });

    const applySiteTheme = () => {
        const T = getTheme();

        // v19.3 originally used a large hand-maintained selector list. Keep those
        // legacy rules inert and let Dark Reader's Dynamic Theme engine analyze the
        // actual page instead, including pages/components we have never seen before.
        document.documentElement.classList.remove('ep-site-dark');
        document.documentElement.dataset.epTheme = T.isDark ? 'dark' : 'light';
        if (document.body) {
            document.body.classList.remove('ep-site-dark');
        }

        try {
            if (typeof DarkReader === 'undefined' || typeof DarkReader.enable !== 'function') {
                throw new Error('Bundled Dark Reader API is unavailable');
            }

            if (T.isDark) {
                DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);
            } else if (typeof DarkReader.disable === 'function') {
                DarkReader.disable();
            }
        } catch (error) {
            console.error('[eDays Analyzer Pro] Dark Reader theme error:', error);
        }

        injectStyles(T);
        return T;
    };

    const setSiteThemeIcon = (svg, showSun) => {
        if (!svg) return;
        const nextIcon = showSun ? 'sun' : 'moon';
        if (svg.dataset.epThemeIcon === nextIcon) return;

        svg.dataset.epThemeIcon = nextIcon;
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = showSun
            ? '<path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7 1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91 1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>'
            : '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>';
    };

    const updateSiteThemeAction = host => {
        if (!host) return;
        const T = getTheme();
        const button = host.querySelector('button');
        const label = host.querySelector('.label');
        const nextLabel = T.isDark ? 'Light mode' : 'Dark mode';
        const description = T.isDark ? 'Switch to light mode' : 'Switch to dark mode';

        if (label && label.textContent !== nextLabel) {
            label.textContent = nextLabel;
        }
        if (button && button.getAttribute('title') !== description) {
            button.setAttribute('title', description);
            button.setAttribute('aria-label', description);
        }
        setSiteThemeIcon(host.querySelector('svg'), T.isDark);
        host.dataset.epTheme = T.isDark ? 'dark' : 'light';
    };

    const createFallbackThemeAction = () => {
        const host = document.createElement('div');
        host.id = SITE_THEME_ACTION_ID;
        host.className = 'v3-button mobile_hidden ECL3';
        host.setAttribute('data-v-1d37e861', '');
        host.innerHTML = `
            <div data-v-1d37e861="" class="v3-button-margin-box">
                <button data-v-1d37e861="" class="v3-button-container secondary icon-left" type="button" target="" title="">
                    <svg data-v-1d37e861="" class="v3-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;vertical-align:middle;"></svg>
                    <span data-v-1d37e861="" class="label"></span>
                </button>
            </div>
        `;
        return host;
    };

    const createSiteThemeAction = () => {
        const nativeShell = document.querySelector(
            '#MainContent_PageActions_timeTrackingContainer .v3-button.mobile_hidden.ECL3'
        );

        let host;
        if (nativeShell) {
            host = document.createElement(nativeShell.tagName.toLowerCase());
            [...nativeShell.attributes].forEach(attr => {
                if (attr.name !== 'id') {
                    host.setAttribute(attr.name, attr.value);
                }
            });
            host.id = SITE_THEME_ACTION_ID;
            const nativeMargin = nativeShell.querySelector('.v3-button-margin-box');
            if (nativeMargin) {
                host.appendChild(nativeMargin.cloneNode(true));
            }
        }

        if (!host || !host.querySelector('.v3-button-margin-box')) {
            host = createFallbackThemeAction();
        }

        const button = host.querySelector('button');
        if (button) {
            button.type = 'button';
            button.setAttribute('target', '');
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                themeOverride = getTheme().isDark ? 'light' : 'dark';
                localStorage.setItem(LS.THEME, themeOverride);
                applySiteTheme();
                updateSiteThemeAction(host);
                if (document.getElementById('ep13')) {
                    renderUI();
                }
            });
        }

        updateSiteThemeAction(host);
        return host;
    };

    const ensureSiteThemeAction = () => {
        const holidayAction = document.getElementById('MainContent_PageActions_holiday_booker_button');
        if (!holidayAction) return false;

        let host = document.getElementById(SITE_THEME_ACTION_ID);
        if (!host) {
            host = createSiteThemeAction();
            holidayAction.insertAdjacentElement('afterend', host);
            return true;
        }

        if (holidayAction.nextElementSibling !== host) {
            holidayAction.insertAdjacentElement('afterend', host);
        }
        return true;
    };

    const scheduleSiteThemeRetry = () => {
        if (siteThemeRetryTimer) return;
        siteThemeRetryTimer = window.setInterval(() => {
            siteThemeRetryCount++;
            if (ensureSiteThemeAction() || siteThemeRetryCount >= 20) {
                clearInterval(siteThemeRetryTimer);
                siteThemeRetryTimer = null;
            }
        }, 500);
    };

    const initSiteEnhancements = () => {
        applySiteTheme();
        if (!ensureSiteThemeAction()) {
            scheduleSiteThemeRetry();
        }
    };

    /* ═══════════════════════════════════════════════════════════════
       ACTIVITY CONFIG
    ═══════════════════════════════════════════════════════════════ */
    const ACT_CFG = {
        'Office': {
            icon: 'office',
            grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
            bg: '#1776cf'
        },
        'Mobile Working': {
            icon: 'laptop',
            grad: 'linear-gradient(135deg,#ec4899,#f97316)',
            bg: '#9d174d'
        },
        'Business Travel': {
            icon: 'flight',
            grad: 'linear-gradient(135deg,#a855f7,#7c3aed)',
            bg: '#6b21a8'
        },
        'No Activity': {
            icon: 'block',
            grad: 'linear-gradient(135deg,#374151,#111827)',
            bg: '#374151'
        },
    };
    const FALLBACK_CFG = {
        icon: 'timer',
        grad: 'linear-gradient(135deg,#64748b,#334155)',
        bg: '#475569'
    };
    /* ═══════════════════════════════════════════════════════════════
       SCHEDULE SECTION HTML
    ═══════════════════════════════════════════════════════════════ */
    const buildScheduleSection = ({
        T,
        days,
        officeHoursNeeded,
        alreadyDoneOfficeHours
    }) => {
        const stillNeeded = round1(Math.max(0, officeHoursNeeded - alreadyDoneOfficeHours));
        const plannedMap = buildHoursSchedulePlan({
            days,
            officeHoursStillNeeded: stillNeeded
        });
        const plannedTotalH = round1(
            [...plannedMap.values()].reduce(
                (a, b) => a + b, 0));
        const totalWorkableHours = round1(days.reduce(
            (sum, d) => sum + d.workTargetMins, 0) / 60);
        const donePct = officeHoursNeeded > 0 ? (alreadyDoneOfficeHours / officeHoursNeeded) * 100 : 0;
        const planPct = officeHoursNeeded > 0 ? (plannedTotalH / officeHoursNeeded) * 100 : 0;
        const totalOfficeH = round1(alreadyDoneOfficeHours + plannedTotalH);
        const nonOfficeH = round1(Math.max(0, totalWorkableHours - totalOfficeH));
        const pctOffice = totalWorkableHours > 0 ? Math.round(
            (totalOfficeH / totalWorkableHours) * 100) : 0;
        let html = `
            <div class="ep-sched-section">
                <div class="ep-sched-hdr">
                    ${icon('calendar',12,T.muted)}
                    Office Schedule
                    &nbsp;·&nbsp;
                    <strong style="color:${T.text}">
                        ${fmtHours(officeHoursNeeded)}h needed
                    </strong>
                    &nbsp;·&nbsp;
                    ${fmtHours(alreadyDoneOfficeHours)}h done
                    &nbsp;·&nbsp;
                    ${fmtHours(stillNeeded)}h remaining
                </div>

                <div class="ep-hours-progress">
                    <div class="ep-hours-prog-hdr">
                        <span>Hours progress</span>
                        <span style="color:${T.text};font-weight:600;">
                            ${fmtHours(alreadyDoneOfficeHours)}h /
                            ${fmtHours(officeHoursNeeded)}h
                        </span>
                    </div>

                    <div class="ep-hours-prog-track">
                        <div
                            class="ep-hours-prog-done"
                            style="width:${clamp(donePct,0,100).toFixed(1)}%;"
                        ></div>

                        <div
                            class="ep-hours-prog-plan"
                            style="width:${clamp(Math.min(planPct,100-donePct),0,100).toFixed(1)}%;"
                        ></div>
                    </div>

                    <div class="ep-sched-legend">
                        <span class="ep-sched-leg-item">
                            <span class="ep-sched-leg-dot" style="background:#22c55e;"></span>
                            Done (${fmtHours(alreadyDoneOfficeHours)}h)
                        </span>

                        <span class="ep-sched-leg-item">
                            <span class="ep-sched-leg-dot" style="background:#3b82f6;"></span>
                            Planned (${fmtHours(plannedTotalH)}h)
                        </span>

                        <span class="ep-sched-leg-item">
                            <span class="ep-sched-leg-dot" style="background:#a855f7;"></span>
                            WFH done
                        </span>

                        <span class="ep-sched-leg-item">
                            <span
                                class="ep-sched-leg-dot"
                                style="background:${T.isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)'};"
                            ></span>
                            Non-office/flex
                        </span>
                    </div>
                </div>
        `;
        html += `<div class="ep-cal-grid">`;
        ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(d => html += `<div class="ep-cal-dow">${d}</div>`);
        const firstDow = days[0]?.dayOfWeek ?? 1;
        const colOffset = firstDow === 0 ? 6 : firstDow - 1;
        for (let i = 0; i < colOffset; i++) {
            html += `<div class="ep-cal-day ep-cal-empty"></div>`;
        }
        days.forEach(d => {
            if (!d.dateNum) {
                html += `<div class="ep-cal-day ep-cal-empty"></div>`;
                return;
            }
            let cls = 'ep-cal-day ';
            let hrsLbl = '';
            if (d.isWeekend) {
                cls += 'ep-cal-weekend';
            } else if (d.isAbsent || d.isHoliday) {
                cls += 'ep-cal-absent';
            } else if (d.hasOffice) {
                cls += 'ep-cal-done-off';
                const extraPlanH = plannedMap.get(d.key) || 0;
                hrsLbl = `<span class="ep-cal-hrs">` + `${fmtHours(d.officeMins / 60)}h` + `${extraPlanH > 0 ? ` +${fmtHours(extraPlanH)}h` : ''}` + `</span>`;
            } else if (d.hasWFH && (d.isPast || d.isToday)) {
                cls += 'ep-cal-done-wfh';
            } else if (d.isPast || d.isToday) {
                cls += 'ep-cal-done-any';
            } else if (plannedMap.has(d.key)) {
                cls += 'ep-cal-plan-off';
                hrsLbl = `<span class="ep-cal-hrs">` + `${fmtHours(plannedMap.get(d.key))}h` + `</span>`;
            } else {
                cls += 'ep-cal-plan-wfh';
            }
            if (!hrsLbl && d.isHalfDay) {
                hrsLbl = `<span class="ep-cal-hrs">` + `${d.halfDayPart} vac` + `</span>`;
            }
            if (d.isToday) {
                cls += ' ep-cal-today';
            }
            const title = d.absenceText ? `${d.label} · ${d.absenceText} · ${fmt(d.workTargetMins)} work target` : d.label;
            html += `<div class="${cls}" title="${title}">` + `${d.dateNum}${hrsLbl}` + `</div>`;
        });
        html += `</div>`;
        const weekBuckets = new Map();
        days.forEach(d => {
            if (d.isWeekend || !d.dateNum) {
                return;
            }
            const wk = d.weekIndex;
            if (!weekBuckets.has(wk)) {
                weekBuckets.set(wk,
                    []);
            }
            weekBuckets.get(wk).push(d);
        });
        const DNAMES = {
            1: 'Mon',
            2: 'Tue',
            3: 'Wed',
            4: 'Thu',
            5: 'Fri'
        };
        html += `<div class="ep-week-rows">`;
        let wn = 0;
        weekBuckets.forEach(wdays => {
            wn++;
            const offDoneH = wdays.reduce(
                (s, d) => s + (d.officeMins || 0), 0) / 60;
            const plannedH = wdays.reduce(
                (s, d) => s + (plannedMap.get(d.key) || 0), 0);
            const slotMap = new Map(wdays.map(d => [
                d.dayOfWeek,
                d
            ]));
            html += `<div class="ep-week-row">` + `<div class="ep-week-label">W${wn}</div>` + `<div class="ep-week-days">`;
            [1, 2, 3, 4, 5].forEach(dow => {
                const d = slotMap.get(dow);
                if (!d) {
                    html += `<div class="ep-week-day-pill ep-wp-off">—</div>`;
                    return;
                }
                let cls = 'ep-week-day-pill ';
                let sub = '';
                if (d.isAbsent || d.isHoliday) {
                    cls += 'ep-wp-absent';
                } else if (d.hasOffice) {
                    cls += 'ep-wp-done';
                    const extraPlanH = plannedMap.get(d.key) || 0;
                    sub = `<span class="ep-pill-sub">` + `${fmtHours(d.officeMins / 60)}h` + `${extraPlanH > 0 ? ` +${fmtHours(extraPlanH)}h` : ''}` + `${d.isHalfDay ? ' · ½ day' : ''}` + `</span>`;
                } else if (plannedMap.has(d.key)) {
                    cls += 'ep-wp-office';
                    sub = `<span class="ep-pill-sub">` + `${fmtHours(plannedMap.get(d.key))}h` + `${d.isHalfDay ? ' · ½ day' : ''}` + `</span>`;
                } else if (d.hasWFH) {
                    cls += 'ep-wp-wfh';
                    sub = `<span class="ep-pill-sub">` + `WFH` + `${d.isHalfDay ? ' · ½ day' : ''}` + `</span>`;
                } else {
                    cls += 'ep-wp-wfh';
                    if (d.isHalfDay) {
                        sub = `<span class="ep-pill-sub">` + `${d.halfDayPart} vac · 4h` + `</span>`;
                    }
                }
                html += `<div class="${cls}" title="${d.label}${d.absenceText ? ' · ' + d.absenceText : ''}">` + `${DNAMES[dow]}` + `${sub}` + `</div>`;
            });
            html += `</div>` + `<div class="ep-week-row-summary">` + `<span>${fmtHours(round1(offDoneH + plannedH))}h</span> office` + `</div>` + `</div>`;
        });
        html += `</div>`;
        html += `
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <div class="ep-sched-stat" style="flex:1;min-width:70px;">
                    <div class="ep-sched-stat-val" style="color:#22c55e;">
                        ${fmtHours(alreadyDoneOfficeHours)}h
                    </div>
                    <div class="ep-sched-stat-lbl">Done ✓</div>
                </div>

                <div class="ep-sched-stat" style="flex:1;min-width:70px;">
                    <div class="ep-sched-stat-val" style="color:#3b82f6;">
                        ${fmtHours(plannedTotalH)}h
                    </div>
                    <div class="ep-sched-stat-lbl">Planned</div>
                </div>

                <div class="ep-sched-stat" style="flex:1;min-width:70px;">
                    <div class="ep-sched-stat-val" style="color:#a855f7;">
                        ${fmtHours(nonOfficeH)}h
                    </div>
                    <div class="ep-sched-stat-lbl">Non-office/Flex</div>
                </div>

                <div class="ep-sched-stat" style="flex:1;min-width:70px;">
                    <div
                        class="ep-sched-stat-val"
                        style="color:${pctOffice >= offTarget ? '#22c55e' : '#f59e0b'};"
                    >
                        ${pctOffice}%
                    </div>
                    <div class="ep-sched-stat-lbl">vs target</div>
                </div>
            </div>
        </div>`;
        return html;
    };
    /* ═══════════════════════════════════════════════════════════════
       OFFICE PLANNER PANEL HTML
    ═══════════════════════════════════════════════════════════════ */
    const buildOfficePlannerPanel = ({
        T,
        ds,
        days
    }) => {
        const isOpen = localStorage.getItem(LS.PLANNER_OPEN) === 'true';
        const officeHoursNeeded = round1(
            (ds.realRota * (offTarget / 100)) / 60);
        const alreadyDoneOfficeHours = round1(days.filter(d => d.hasOffice && (d.isPast || d.isToday)).reduce(
            (s, d) => s + d.officeMins, 0) / 60);
        let html = `
            <div
                class="ep-planner-toggle"
                data-action="planner-toggle"
                role="button"
                tabindex="0"
            >
                ${iconBadge(
                    'calendar',
                    'linear-gradient(135deg,#3b82f6,#a855f7)',
                    26
                )}

                <span class="ep-planner-toggle-label">
                    Office Planner
                    <span class="ep-planner-toggle-sub">
                        · ${fmtHours(officeHoursNeeded)}h needed this month
                    </span>
                </span>

                ${icon(
                    isOpen
                        ? 'chevron_up'
                        : 'chevron_down',
                    14,
                    T.muted
                )}
            </div>

            <div
                class="ep-planner-panel${isOpen ? ' open' : ''}"
                id="ep-planner-panel"
            >
                <div class="ep-planner-inner">
        `;
        html += buildScheduleSection({
            T,
            days,
            officeHoursNeeded,
            alreadyDoneOfficeHours
        });
        html += `</div></div>`;
        return html;
    };
    const buildTodayStrip = ({
        T,
        ds
    }) => {
        const today = getTodayInfo();
        if (!today) return '';
        const todayBufOn = localStorage.getItem(LS.TODAY_BUF) === 'true';
        const scheduledTarget = today.targetMinutes;
        let effTarget = scheduledTarget;
        if (todayBufOn && scheduledTarget > 0) {
            effTarget = Math.max(0, scheduledTarget - ds.priorBufferMinutes);
            if (today.isHalfDay) {
                effTarget = Math.min(scheduledTarget, effTarget);
            }
        }
        const todayWorked = today.workedMinutes;
        const isDayOff = scheduledTarget === 0;
        /*
         * Use the same mandatory-break calculation as Buffer.
         * Real clock-out gaps count toward the configured break requirement.
         */
        const missingBreakMinutes = isDayOff ? 0 : getMissingMandatoryBreakMinutes(today.el);
        /*
         * Break time does not count as working time, therefore the missing
         * mandatory break is added to the amount of elapsed time still needed.
         */
        const todayRemaining = Math.max(0, effTarget - todayWorked + missingBreakMinutes);
        const todayDone = isDayOff || todayRemaining === 0;
        /*
         * Progress represents how close we are to actually being allowed
         * to finish the day, including any still-missing mandatory break.
         */
        const effectiveCompleted = Math.max(0, effTarget - todayRemaining);
        const todayPct = isDayOff ? 100 : (effTarget > 0 ? Math.min(100,
            (effectiveCompleted / effTarget) * 100) : 100);
        const leaveAt = today.isRunning && todayRemaining > 0 ? new Date(Date.now() + todayRemaining * 60000) : null;
        let statusHtml;
        if (isDayOff) {
            statusHtml = `<span class="ep-today-rem done">` + `${icon('check',12,'#22c55e')} ` + `${today.absenceText || 'Non-working day'}` + `</span>`;
        } else if (effTarget === 0 && todayBufOn) {
            statusHtml = `<span class="ep-today-rem done">` + `${icon('check',12,'#22c55e')} ` + `Covered by buffer` + `</span>`;
        } else if (todayDone) {
            statusHtml = `<span class="ep-today-rem done">` + `${icon('check',12,'#22c55e')} ` + `Day complete!` + `</span>`;
        } else {
            statusHtml = `<span class="ep-today-rem">` + `${icon('timer',12,T.muted)} ` + `${fmt(todayRemaining)} left` + `${leaveAt ? ` - leave at ${formatClock(leaveAt)}` : ''}` + `</span>`;
        }
        const targetSuffix = today.isHalfDay && today.absenceText ? ` <span style="opacity:.75;">· ${today.absenceText}</span>` : '';
        return `
            <div class="ep-today-strip">
                <div class="ep-today-label">
                    ${iconBadge(
                        'timer',
                        '#1776cf',
                        26
                    )}
                    <span class="ep-today-label-text">
                        Today
                    </span>
                </div>

                <div class="ep-today-centre">
                    <div class="ep-today-nums-row">
                        <span class="ep-today-done">
                            ${fmt(todayWorked)}
                        </span>

                        <span class="ep-today-sep">/</span>

                        <span class="ep-today-total">
                            ${fmt(effTarget)}${targetSuffix}
                        </span>

                        ${statusHtml}
                    </div>

                    <div class="ep-today-track">
                        <div
                            class="ep-today-fill"
                            style="width:${todayPct.toFixed(1)}%;background:${todayDone ? '#22c55e' : '#3b82f6'};"
                        ></div>
                    </div>
                </div>

                <div class="ep-today-actions">
                    ${
                        scheduledTarget > 0
                            ? `
                                <span
                                    class="ep-btn ep-btn-pill"
                                    data-action="buf-toggle"
                                >
                                    <span
                                        class="ep-toggle-track"
                                        style="background:${todayBufOn ? '#3b82f6' : T.barTrack};"
                                    >
                                        <span
                                            class="ep-toggle-thumb"
                                            style="left:${todayBufOn ? '14px' : '2px'};"
                                        ></span>
                                    </span>
                                    Include buffer
                                </span>
                            `
                            : ''
                    }
                </div>
            </div>
        `;
    };
    let settingsKeyHandler = null;

    const closeSettingsModal = () => {
        document.getElementById('ep-settings-overlay')?.remove();
        if (settingsKeyHandler) {
            document.removeEventListener('keydown', settingsKeyHandler);
            settingsKeyHandler = null;
        }
    };

    const openSettingsModal = () => {
        closeSettingsModal();
        const T = getTheme();
        injectStyles(T);
        const overlay = document.createElement('div');
        overlay.id = 'ep-settings-overlay';
        overlay.className = 'ep-settings-overlay';
        overlay.innerHTML = `
            <form class="ep-settings-modal" id="ep-settings-form">
                <div class="ep-settings-hdr">
                    ${icon('settings',16,T.muted)}
                    <div class="ep-settings-title">Analyzer Settings</div>
                    <button type="button" class="ep-settings-close" id="ep-settings-close" aria-label="Close settings">×</button>
                </div>

                <div class="ep-settings-body">
                    <div class="ep-settings-field">
                        <label class="ep-settings-label" for="ep-setting-office-target">Office target</label>
                        <div class="ep-settings-input-wrap">
                            <input class="ep-settings-input" id="ep-setting-office-target" type="number" min="0" max="100" step="1" value="${offTarget}" required>
                            <span class="ep-settings-unit">%</span>
                        </div>
                        <div class="ep-settings-help">Percentage of rota hours that should be completed in the office.</div>
                    </div>

                    <div class="ep-settings-field">
                        <label class="ep-settings-label" for="ep-setting-break">Mandatory break</label>
                        <div class="ep-settings-input-wrap">
                            <input class="ep-settings-input" id="ep-setting-break" type="number" min="0" max="480" step="1" value="${mandatoryBreakMinutes}" required>
                            <span class="ep-settings-unit">minutes</span>
                        </div>
                        <div class="ep-settings-help">Applied to full working days. Real clock-out gaps count toward this value.</div>
                    </div>

                    <div class="ep-settings-error" id="ep-settings-error" role="alert"></div>
                </div>

                <div class="ep-settings-actions">
                    <button type="button" class="ep-settings-btn" id="ep-settings-reset">Reset defaults</button>
                    <div class="ep-settings-actions-right">
                        <button type="button" class="ep-settings-btn" id="ep-settings-cancel">Cancel</button>
                        <button type="submit" class="ep-settings-btn primary">Save</button>
                    </div>
                </div>
            </form>
        `;
        document.body.appendChild(overlay);

        const form = overlay.querySelector('#ep-settings-form');
        const officeInput = overlay.querySelector('#ep-setting-office-target');
        const breakInput = overlay.querySelector('#ep-setting-break');
        const errorEl = overlay.querySelector('#ep-settings-error');

        const showError = message => {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        };

        const applyAndClose = () => {
            closeSettingsModal();
            renderUI();
        };

        form.addEventListener('submit', e => {
            e.preventDefault();
            const nextOffTarget = Number(officeInput.value);
            const nextBreak = Number(breakInput.value);

            if (!Number.isFinite(nextOffTarget) || nextOffTarget < 0 || nextOffTarget > 100) {
                showError('Office target must be between 0 and 100%.');
                officeInput.focus();
                return;
            }

            if (!Number.isFinite(nextBreak) || nextBreak < 0 || nextBreak > 480) {
                showError('Mandatory break must be between 0 and 480 minutes.');
                breakInput.focus();
                return;
            }

            offTarget = nextOffTarget;
            mandatoryBreakMinutes = Math.round(nextBreak);
            localStorage.setItem(LS.OFF_TARGET, String(offTarget));
            localStorage.setItem(LS.MANDATORY_BREAK, String(mandatoryBreakMinutes));
            applyAndClose();
        });

        overlay.querySelector('#ep-settings-reset').addEventListener('click', () => {
            localStorage.removeItem(LS.OFF_TARGET);
            localStorage.removeItem(LS.MANDATORY_BREAK);
            offTarget = DEFAULT_OFF_TARGET;
            mandatoryBreakMinutes = DEFAULT_MANDATORY_BREAK_MINUTES;
            applyAndClose();
        });

        overlay.querySelector('#ep-settings-close').addEventListener('click', closeSettingsModal);
        overlay.querySelector('#ep-settings-cancel').addEventListener('click', closeSettingsModal);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeSettingsModal();
        });

        settingsKeyHandler = e => {
            if (e.key === 'Escape') closeSettingsModal();
        };
        document.addEventListener('keydown', settingsKeyHandler);

        officeInput.focus();
        officeInput.select();
    };

    /* ═══════════════════════════════════════════════════════════════
       INTERACTIONS
    ═══════════════════════════════════════════════════════════════ */
    const bindInteractions = container => {
        container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                const action = el.dataset.action;
                if (action === 'jump-today') {
                    jumpToToday();
                }
                if (action === 'jump-analyzer') {
                    jumpToAnalyzer();
                }
                if (action === 'settings-open') {
                    openSettingsModal();
                }
                if (action === 'theme-toggle') {
                    themeOverride = el.dataset.theme;
                    localStorage.setItem(LS.THEME, themeOverride);
                    applySiteTheme();
                    ensureSiteThemeAction();
                    renderUI();
                }
                if (action === 'buf-toggle') {
                    localStorage.setItem(LS.TODAY_BUF, String(localStorage.getItem(LS.TODAY_BUF) !== 'true'));
                    renderUI();
                }
                if (action === 'planner-toggle') {
                    localStorage.setItem(LS.PLANNER_OPEN, String(localStorage.getItem(LS.PLANNER_OPEN) !== 'true'));
                    renderUI();
                }
            });
        });
    };
    /* ═══════════════════════════════════════════════════════════════
       MAIN RENDER
    ═══════════════════════════════════════════════════════════════ */
    const renderUI = () => {
        const T = applySiteTheme();
        const mainPanel = document.getElementById('mainTimesheetPanel');
        if (!mainPanel) return;
        let container = document.getElementById('ep13');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ep13';
            mainPanel.insertBefore(container, mainPanel.firstChild);
        }
        if (!isSummaryReady()) {
            container.innerHTML = `<div class="ep-hdr">` + `<div class="ep-hdr-logo">${icon('timer',16)}</div>` + `<div class="ep-hdr-title">eDays Analyzer Pro</div>` + `<div class="ep-hdr-date"><span class="ep-pulse"></span> Loading…</div>` + `</div>`;
            return;
        }
        const summary = getSummaryData();
        const {
            actMap,
            rawTotal
        } = getActivityData();
        const dateStr = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
        if (!summary.recorded && !rawTotal) {
            const ds = getDayStats(summary);
            const detailedDays = getDetailedDayData();
            const nextTheme = T.isDark ? 'light' : 'dark';
            container.innerHTML = `
                <div class="ep-hdr">
                    <div class="ep-hdr-logo">
                        ${icon('timer',16)}
                    </div>

                    <div class="ep-hdr-title">
                        eDays Analyzer Pro
                    </div>

                    <div class="ep-hdr-right">
                        <span
                            class="ep-btn ep-btn-icon"
                            data-action="settings-open"
                            title="Analyzer settings"
                        >
                            ${icon(
                                'settings',
                                14,
                                T.muted
                            )}
                        </span>

                        <span
                            class="ep-btn ep-btn-icon"
                            data-action="theme-toggle"
                            data-theme="${nextTheme}"
                            title="${T.isDark ? 'Light' : 'Dark'} theme"
                        >
                            ${icon(
                                T.isDark
                                    ? 'sun'
                                    : 'moon',
                                14,
                                T.muted
                            )}
                        </span>

                        <div class="ep-hdr-date">
                            <span class="ep-pulse"></span>
                            ${dateStr}
                        </div>
                    </div>
                </div>

                <div class="ep-empty">
                    <div class="ep-empty-icon">
                        ${icon(
                            'calendar',
                            22,
                            T.muted
                        )}
                    </div>

                    <div class="ep-empty-title">
                        New month — no entries yet
                    </div>

                    <div class="ep-empty-sub">
                        Start logging time in eDays and the dashboard will populate automatically. The Office Planner is still available below.
                    </div>
                </div>
            `;
            container.innerHTML += buildTodayStrip({
                T,
                ds
            });
            container.innerHTML += buildOfficePlannerPanel({
                T,
                ds,
                days: detailedDays
            });
            bindInteractions(container);
            return;
        }
        const realRota = Math.max(0, summary.rota - summary.absences - summary.holidays);
        const days = getDetailedDayData();
        /*
         * FIX:
         * Exact Office minutes are authoritative.
         * They are read directly from the individual Office periods
         * and are not scaled by the raw/summary reconciliation factor.
         */
        const officeMins = days.reduce(
            (s, d) => (d.hasOffice && (d.isPast || d.isToday)) ? s + d.officeMins : s, 0);
        /*
         * FIX:
         * Reconcile all NON-OFFICE activity around the exact Office
         * value so Activity Breakdown always totals exactly the same
         * number of minutes as eDays "Time recorded".
         */
        const recordedMins = Math.round(summary.recorded);
        const remainingRecordedMins = Math.max(0, recordedMins - officeMins);
        const nonOfficeRaw = Object.entries(actMap).filter(
            ([name, mins]) => name !== 'Office' && mins > 0);
        const rawNonOfficeTotal = nonOfficeRaw.reduce(
            (s, [, mins]) => s + mins, 0);
        let nonOfficeActs = [];
        if (rawNonOfficeTotal > 0 && remainingRecordedMins > 0) {
            const scaled = nonOfficeRaw.map(
                (
                    [name, mins], index) => {
                    const exact = (mins / rawNonOfficeTotal) * remainingRecordedMins;
                    const adj = Math.floor(exact);
                    return {
                        name,
                        adj,
                        remainder: exact - adj,
                        index
                    };
                });
            /*
             * Largest-remainder distribution:
             * after flooring the scaled non-Office categories,
             * distribute any missing minute(s) to the categories
             * with the largest fractional remainder.
             */
            let leftover = remainingRecordedMins - scaled.reduce(
                (s, a) => s + a.adj, 0);
            [...scaled].sort(
                (a, b) => (b.remainder - a.remainder) || (a.index - b.index)).forEach(a => {
                if (leftover <= 0) {
                    return;
                }
                a.adj += 1;
                leftover -= 1;
            });
            nonOfficeActs = scaled.map(
                ({
                    name,
                    adj
                }) => ({
                    name,
                    adj
                }));
        } else if (remainingRecordedMins > 0) {
            /*
             * Safety fallback:
             * if eDays has recorded minutes but no identifiable
             * non-Office category, preserve the exact total as
             * "No Activity".
             */
            nonOfficeActs = [{
                name: 'No Activity',
                adj: remainingRecordedMins
            }];
        }
        const acts = [...(officeMins > 0 ? [{
            name: 'Office',
            adj: officeMins
        }] : []), ...nonOfficeActs].filter(a => a.adj > 0).sort(
            (a, b) => b.adj - a.adj);
        const totalActMins = acts.reduce(
            (s, a) => s + a.adj, 0);
        const targetMins = realRota * (offTarget / 100);
        const officePct = targetMins > 0 ? (officeMins / targetMins) * 100 : 0;
        const officeActPct = realRota > 0 ? (officeMins / realRota) * 100 : 0;
        const rotaPct = realRota > 0 ? (summary.recorded / realRota) * 100 : 0;
        const ds = getDayStats(summary);
        const offColor = getOffColor(officePct);
        const rotaColor = rotaPct >= 100 ? '#22c55e' : rotaPct >= 80 ? '#3b82f6' : '#f59e0b';
        const nextTheme = T.isDark ? 'light' : 'dark';
        let html = `
            <div class="ep-hdr">
                <div class="ep-hdr-logo">
                    ${icon('timer',16)}
                </div>

                <div class="ep-hdr-title">
                    eDays Analyzer Pro
                </div>

                <div class="ep-hdr-right">
                    <span
                        class="ep-btn ep-btn-icon"
                        data-action="settings-open"
                        title="Analyzer settings"
                    >
                        ${icon(
                            'settings',
                            14,
                            T.muted
                        )}
                    </span>

                    <span
                        class="ep-btn ep-btn-icon"
                        data-action="theme-toggle"
                        data-theme="${nextTheme}"
                        title="${T.isDark ? 'Light' : 'Dark'} theme"
                    >
                        ${icon(
                            T.isDark
                                ? 'sun'
                                : 'moon',
                            14,
                            T.muted
                        )}
                    </span>

                    <div class="ep-hdr-date">
                        <span class="ep-pulse"></span>
                        ${dateStr}
                    </div>
                </div>
            </div>

            <div class="ep-grid">
        `;
        /* Card 1 */
        const totalActPct = realRota > 0 ? (totalActMins / realRota) * 100 : 0;
        html += `<div class="ep-card">` + `<div class="ep-card-title">Activity Breakdown</div>`;
        acts.forEach(({
            name,
            adj
        }) => {
            const cfg = ACT_CFG[name] || FALLBACK_CFG;
            const pct = realRota > 0 ? (adj / realRota) * 100 : 0;
            html += `<div class="ep-act-row">` + `${iconBadge(cfg.icon,cfg.bg,26)}` + `<div class="ep-act-info">` + `<div class="ep-act-name">${name}</div>` + `<div class="ep-act-meta">${fmt(adj)} · ${pct.toFixed(0)}%</div>` + `<div class="ep-bar">` + `<div class="ep-bar-fill" style="width:${clamp(pct,0,100)}%;background:${cfg.grad};"></div>` + `</div>` + `</div>` + `</div>`;
        });
        html += `<div class="ep-divider"></div>` + `<div class="ep-total-row">` + `<span class="ep-total-label">Total logged</span>` + `<span class="ep-total-val">${fmt(totalActMins)} (${totalActPct.toFixed(0)}%)</span>` + `</div>` + `<div class="ep-bar">` + `<div class="ep-bar-fill" style="width:${clamp(totalActPct,0,100)}%;background:linear-gradient(90deg,#3b82f6,#a855f7);"></div>` + `</div>` + `</div>`;
        /* Card 2 */
        const offRemMins = Math.max(0, Math.ceil(targetMins - officeMins));
        const offRemDays = offRemMins > 0 ? round1(Math.ceil(offRemMins / HALF_DAY_MINUTES) / 2) : 0;
        const officeChipVal = fmtDaysAndTime(offRemMins);
        html += `
            <div class="ep-card ep-ring-card">
                <div class="ep-card-title">
                    Office Target · ${offTarget}%
                </div>

                <div class="ep-ring-wrap">
                    ${ring({
                        r: 54,
                        pct: officePct,
                        color: offColor,
                        sw: 6,
                        trackColor: T.ringTrack
                    })}

                    <div class="ep-ring-center">
                        <span
                            class="ep-ring-pct"
                            style="color:${offColor}"
                        >
                            ${officePct.toFixed(0)}%
                        </span>

                        <span class="ep-ring-lbl">
                            of target
                        </span>
                    </div>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Actual
                    </span>

                    <span class="ep-stat-v">
                        ${officeActPct.toFixed(0)}% of rota
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Logged
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(officeMins)}
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Target
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(targetMins)}
                    </span>
                </div>

                ${
                    officePct < 100
                        ? `
                            <div class="ep-hint">
                                ${icon(
                                    'today',
                                    12,
                                    T.muted
                                )}

<span>
    ${officeChipVal} needed in office to hit ${offTarget}%
</span>
                            </div>
                        `
                        : `
                            <div
                                class="ep-hint"
                                style="color:#22c55e"
                            >
                                ${icon(
                                    'check',
                                    12,
                                    '#22c55e'
                                )}

                                <span>
                                    Office target met!
                                </span>
                            </div>
                        `
                }
            </div>
        `;
        /* Card 3 */
        html += `
            <div class="ep-card ep-ring-card">
                <div class="ep-card-title">
                    Time vs Rota
                </div>

                <div class="ep-ring-wrap">
                    ${ring({
                        r: 54,
                        pct: rotaPct,
                        color: rotaColor,
                        sw: 6,
                        trackColor: T.ringTrack
                    })}

                    <div class="ep-ring-center">
                        <span
                            class="ep-ring-pct"
                            style="color:${rotaColor}"
                        >
                            ${rotaPct.toFixed(0)}%
                        </span>

                        <span class="ep-ring-lbl">
                            rota
                        </span>
                    </div>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Recorded
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(summary.recorded)}
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Real Rota
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(realRota)}
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Absences
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(summary.absences)}
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Holidays
                    </span>

                    <span class="ep-stat-v">
                        ${fmt(summary.holidays)}
                    </span>
                </div>

                <div class="ep-stat-row">
                    <span class="ep-stat-k">
                        Days worked
                    </span>

                    <span class="ep-stat-v">
                        ${ds.workedDays}d
                    </span>
                </div>
            </div>
        `;
        /* Card 4 */
        const wfhDaysAvailable = Math.max(0, ds.daysLeft - offRemDays);
        const wfhAvailableMins = Math.max(0, ds.remainingMinutes - offRemMins);
        /*
         * Display exact time instead of decimal / half-day values.
         *
         * Examples:
         * 2 days + 4 hours       -> 2d 4h
         * 3 days + 3h 30m       -> 3d 3h 30m
         * exactly 2 days         -> 2d
         * <= 1 day               -> exact hours, e.g. 6h 30m
         */
        const officeChipLbl = offRemMins <= STANDARD_DAY_MINUTES ? 'Office Time Needed' : 'Office Days Needed';
        const wfhChipVal = fmtDaysAndTime(wfhAvailableMins);
        const wfhChipLbl = wfhAvailableMins <= STANDARD_DAY_MINUTES ? 'WFH Time Available' : 'WFH Days Available';
        const officeChipCompact = officeChipVal.includes(' ');
        const wfhChipCompact = wfhChipVal.includes(' ');
        const bc = ds.bufferMinutes > 0 ? 'pos' : ds.bufferMinutes < 0 ? 'neg' : 'zer';
        const bi = ds.bufferMinutes > 0 ? 'trending_up' : ds.bufferMinutes < 0 ? 'trending_down' : 'trending_flat';
        const bCol = ds.bufferMinutes > 0 ? '#22c55e' : ds.bufferMinutes < 0 ? '#ef4444' : T.muted;
        html += `
            <div class="ep-card">
                <div class="ep-card-title">
                    Buffer &amp; Outlook
                </div>

                <div class="ep-buf-top">
                    ${icon(
                        bi,
                        20,
                        bCol
                    )}

                    <span class="ep-buf-val ${bc}">
                        ${fmt(ds.bufferMinutes)}
                    </span>

                    <span class="ep-buf-sub">
                        ${ds.bufferMinutes >= 0 ? 'ahead of' : 'behind'}
                        scheduled daily target
                        <br>
                        to date
                    </span>
                </div>

                <div class="ep-chip-grid">
                    <div class="ep-chip">
                        <div class="ep-chip-val">
                            ${ds.workableDays}
                        </div>

                        <div class="ep-chip-lbl">
                            Workable
                        </div>
                    </div>

<div class="ep-chip" style="min-width:0;overflow:hidden;">
    <div
        class="ep-chip-val"
        style="color:#3b82f6;white-space:nowrap;overflow:hidden;${offRemDays <= 1 || officeChipVal.includes(' ') ? 'font-size:14px;' : ''}"
    >
        ${officeChipVal}
    </div>

    <div class="ep-chip-lbl">
        ${officeChipLbl}
    </div>
</div>

                    <div class="ep-chip">
                        <div
                            class="ep-chip-val"
                            style="color:#a855f7"
                        >
                            ${ds.daysLeft}
                        </div>

                        <div class="ep-chip-lbl">
                            Days Left
                        </div>
                    </div>

<div class="ep-chip" style="min-width:0;overflow:hidden;">
    <div
        class="ep-chip-val"
        style="color:#f59e0b;white-space:nowrap;overflow:hidden;${wfhDaysAvailable <= 1 || wfhChipVal.includes(' ') ? 'font-size:14px;' : ''}"
    >
        ${wfhChipVal}
    </div>

    <div class="ep-chip-lbl">
        ${wfhChipLbl}
    </div>
</div>
                </div>

                <div class="ep-prog-wrap">
                    <div class="ep-prog-hdr">
                        <span>
                            Month progress
                        </span>

                        <span>
                            ${ds.progressPct.toFixed(0)}%
                        </span>
                    </div>

                    <div class="ep-prog-track">
                        <div
                            class="ep-prog-fill"
                            style="width:${clamp(ds.progressPct,0,100).toFixed(1)}%"
                        ></div>
                    </div>
                </div>

                <div class="ep-notices">
                    ${
                        ds.remainingMinutes > 0
                            ? `
                                <div class="ep-notice">
                                    ${icon(
                                        'calendar',
                                        12,
                                        T.muted
                                    )}

                                    <span>
                                        ${ds.daysLeft}d equivalent left
                                        · ${fmt(ds.remainingMinutes)} remaining
                                    </span>
                                </div>
                            `
                            : ''
                    }

                    ${
                        ds.bufferMinutes > 0
                            ? `
                                <div class="ep-notice good">
                                    ${icon(
                                        'savings',
                                        12,
                                        '#22c55e'
                                    )}

                                    <span>
                                        ${fmt(ds.bufferMinutes)} banked
                                    </span>
                                </div>
                            `
                            : ds.bufferMinutes < 0
                                ? `
                                    <div class="ep-notice warn">
                                        ${icon(
                                            'warning',
                                            12,
                                            '#ef4444'
                                        )}

                                        <span>
                                            ${fmt(Math.abs(ds.bufferMinutes))} deficit
                                        </span>
                                    </div>
                                `
                                : `
                                    <div class="ep-notice">
                                        ${icon(
                                            'flag',
                                            12,
                                            T.muted
                                        )}

                                        <span>
                                            Exactly on target!
                                        </span>
                                    </div>
                                `
                    }

                    <div class="ep-notice">
                        ${icon(
                            'flag',
                            12,
                            T.muted
                        )}

                        <span>
                            Month target:
                            ${fmt(ds.realRota)}
                        </span>
                    </div>
                </div>
            </div>
        `;
        html += `</div>`;
        html += buildTodayStrip({
            T,
            ds
        });
        html += buildOfficePlannerPanel({
            T,
            ds,
            days
        });
        container.innerHTML = html;
        bindInteractions(container);
    };
    /* ═══════════════════════════════════════════════════════════════
       UNIFIED TIMESHEET NAVIGATION
    ═══════════════════════════════════════════════════════════════ */
    const TIMESHEET_NAV_BUTTON_ID = 'ep-timesheet-nav';
    const TIMESHEET_SETTINGS_BUTTON_ID = 'ep-timesheet-settings';
    let timesheetNavScrollParent = null;
    let timesheetNavObserver = null;
    let timesheetNavRaf = 0;

    const getTimesheetHeader = () => document.getElementById('timesheetMonthHeader');


    const enhanceTimesheetHeading = () => {
        const heading = getTimesheetHeader()?.querySelector('h2');
        if (!heading || heading.querySelector('.ep-enhanced-text')) return;
        const text = heading.textContent.replace(/\s+/g, ' ').trim();
        if (!/^time tracking$/i.test(text)) return;

        heading.textContent = 'Time Tracking ';
        const enhanced = document.createElement('span');
        enhanced.className = 'ep-enhanced-text';
        enhanced.textContent = 'Enhanced';
        heading.appendChild(enhanced);
    };

    const createTimesheetSettingsButton = () => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_SETTINGS_BUTTON_ID;
        button.className = 'disallow-impersonation-action';
        button.setAttribute('icon', 'settings');
        button.setAttribute('title', 'Analyzer settings');
        button.setAttribute('aria-label', 'Analyzer settings');
        button.addEventListener('click', event => {
            event.preventDefault();
            openSettingsModal();
        });
        return button;
    };

    const ensureTimesheetSettingsButton = navButton => {
        if (!navButton) return;
        let settingsButton = document.getElementById(TIMESHEET_SETTINGS_BUTTON_ID);
        if (!settingsButton || settingsButton.tagName.toLowerCase() !== 'c3-button') {
            settingsButton?.remove();
            settingsButton = createTimesheetSettingsButton();
        }
        if (navButton.nextElementSibling !== settingsButton) {
            navButton.insertAdjacentElement('afterend', settingsButton);
        }
    };


    const getSubmitMonthButton = () => {
        const header = getTimesheetHeader();
        if (!header) return null;
        const buttons = [...header.querySelectorAll('.button_container c3-button')];
        return buttons.find(button => button.textContent.trim() === 'Submit month')
            || header.querySelector('.button_container c3-button[accesskey="s"]');
    };

    const getTodayRow = () => document.querySelector('.today_chip')?.closest('.tt_day_container') || null;

    const getScrollMetrics = element => {
        const scrollParent = getScrollParent(element);
        if (scrollParent === window) {
            return {
                scrollParent,
                current: window.scrollY,
                target: element.getBoundingClientRect().top + window.scrollY
            };
        }
        return {
            scrollParent,
            current: scrollParent.scrollTop,
            target: element.getBoundingClientRect().top
                - scrollParent.getBoundingClientRect().top
                + scrollParent.scrollTop
        };
    };

    const getTimesheetNavState = () => {
        const todayRow = getTodayRow();
        if (!todayRow) return 'top';

        const metrics = getScrollMetrics(todayRow);
        const todayReachedAt = Math.max(0, metrics.target - 100);
        return metrics.current >= todayReachedAt ? 'top' : 'today';
    };

    const getTimesheetNavLabel = target => target === 'today'
        ? '↓ To today'
        : '↑ To home';

    const configureTimesheetNavButton = (button, target) => {
        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';

        button.dataset.epTarget = target;
        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };

    const createTimesheetNavButton = target => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_NAV_BUTTON_ID;
        button.className = 'disallow-impersonation-action';

        // eDays' c3-button initializes its visible content when connected.
        // Give it the label first, then attach it to the document.
        button.textContent = getTimesheetNavLabel(target);
        configureTimesheetNavButton(button, target);

        button.addEventListener('click', event => {
            event.preventDefault();
            if (button.dataset.epTarget === 'today') {
                jumpToToday();
            } else {
                jumpToAnalyzer();
            }
        });

        return button;
    };

    const updateTimesheetNavButton = () => {
        const button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button) return;

        const target = getTimesheetNavState();

        // Never rewrite text on an already-connected c3-button. Recreate it only
        // when the target actually changes, with its new label set before insertion.
        if (button.dataset.epTarget !== target) {
            button.replaceWith(createTimesheetNavButton(target));
            return;
        }

        configureTimesheetNavButton(button, target);
    };

    const scheduleTimesheetNavUpdate = () => {
        if (timesheetNavRaf) return;
        timesheetNavRaf = requestAnimationFrame(() => {
            timesheetNavRaf = 0;
            updateTimesheetNavButton();
        });
    };

    const bindTimesheetNavScroll = () => {
        const target = getTodayRow() || document.getElementById('ep13') || document.getElementById('mainTimesheetPanel');
        const nextScrollParent = target ? getScrollParent(target) : window;
        if (nextScrollParent === timesheetNavScrollParent) return;

        if (timesheetNavScrollParent) {
            timesheetNavScrollParent.removeEventListener('scroll', scheduleTimesheetNavUpdate);
        }

        timesheetNavScrollParent = nextScrollParent;
        timesheetNavScrollParent.addEventListener('scroll', scheduleTimesheetNavUpdate, { passive: true });
    };

    const ensureTimesheetNavButton = () => {
        const submitButton = getSubmitMonthButton();
        if (!submitButton) return;

        let button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button || button.tagName.toLowerCase() !== 'c3-button') {
            button?.remove();
            button = createTimesheetNavButton(getTimesheetNavState());
        }

        if (submitButton.nextElementSibling !== button) {
            submitButton.insertAdjacentElement('afterend', button);
        }

        enhanceTimesheetHeading();
        ensureTimesheetSettingsButton(button);
        bindTimesheetNavScroll();
        updateTimesheetNavButton();
    };

    const initTimesheetNavigation = () => {
        ensureTimesheetNavButton();

        if (!timesheetNavObserver) {
            timesheetNavObserver = new MutationObserver(() => {
                ensureTimesheetNavButton();
            });
            timesheetNavObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            window.addEventListener('resize', scheduleTimesheetNavUpdate, { passive: true });
        }
    };
    /* ═══════════════════════════════════════════════════════════════
       BOOT
    ═══════════════════════════════════════════════════════════════ */
    const boot = () => {
        initSiteEnhancements();
        const tick = setInterval(
            () => {
                if (document.querySelector('.tt_day_container') && document.querySelector('.desktop_summary')) {
                    clearInterval(tick);
                    renderUI();
                    initTimesheetNavigation();
                    let debounce = null;
                    const observer = new MutationObserver(mutations => {
                        const ep = document.getElementById('ep13');
                        if (mutations.every(m => ep && (ep.contains(m.target) || ep === m.target))) {
                            return;
                        }
                        clearTimeout(debounce);
                        debounce = setTimeout(
                            () => {
                                renderUI();
                            }, 600);
                    });
                    const panel = document.getElementById('mainTimesheetPanel');
                    if (panel) {
                        observer.observe(panel, {
                            childList: true,
                            subtree: true,
                            characterData: true
                        });
                    }
                    setInterval(renderUI, 30000);
                }
            }, 800);
    };
    boot();
})();
