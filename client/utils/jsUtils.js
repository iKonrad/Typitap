export function resolveAll(promises, callback) {

    let loaded = 0;

    promises.forEach((promise) => {
        promise.then(() => {
            loaded++;
            if (loaded === promises.length) {
                callback();
            }
        })
    })

}


export function getBaseUrl() {

    return process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "production" ? "https://typitap.com/" : "http://localhost:5000/";

}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
export function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}