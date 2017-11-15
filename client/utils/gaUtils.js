var GA = require('react-ga');

if (typeof window !== "undefined") {
    GA.initialize('UA-79863706-2');
    if (typeof document !== "undefined" && typeof window !== "undefined") {
        if (document.cookie.indexOf("TYPITAP_NOTRACK=") >= 0) {
            GA.ga('set', 'dimension1', 1);
        }
    }
    logPageView(window.location.pathname)
}
export function logPageView(path) {
    GA.set({page: path});
    GA.pageview(path);
}


export function logEvent(category, action, label) {
    GA.event({
        category,
        action,
        label
    });
}

export function logModal(modalName) {
    GA.modalview(modalName);
}