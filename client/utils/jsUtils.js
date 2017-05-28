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