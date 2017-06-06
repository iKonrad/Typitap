import {addNotification as notify} from 'reapop';

class Notifications {

    /**
     * Generic error template
     * @param message
     */
    static error(message) {
        return notify({
            title: `Error`,
            message: message,
            status: 'error',
        })
    }

    /**
     * Generic success message
     * @param message
     */
    static success(message) {
        return notify({
            title: `Success`,
            message: message,
            status: 'success',
        })
    }

    /**
     * Notification displayed after logging in successfully
     * @param name
     */
    static welcomeBack(name) {
        return notify({
            title: 'Welcome back',
            message: `Welcome back, ${name}`,
            status: 'success',
        })
    };

    /**
     * After account is created
     */
    static accountCreated() {
        return notify({
            title: `Activate your account`,
            message: 'We have sent you an e-mail with a confirmation link to activate your account',
            status: 'success',
            dismissAfter: 0,
            buttons: [
                {
                    name: "Got it",
                    primary: true,
                }
            ]
        })
    }

    /**
     * Once game is finished
     * @param time
     * @param wpm
     * @param accuracy
     * @param mistakes
     */
    static gameCompleted(time, wpm, accuracy, mistakes) {
        return notify({
            title: `Race completed`,
            message: `Game finished in ${time} seconds with score <strong>${wpm}</strong> wpm. Your accuracy: <strong>${accuracy}%</strong> (${mistakes} mistakes)`,
            status: 'success',
            dismissAfter: 0,
            allowHTML: true,
            buttons: [
                {
                    name: "Close",
                    primary: false,
                }
            ]
        })
    }

    /**
     * When cannot connect to websocket
     */
    static connectionIssue() {
        return notify({
            title: `Connection issue`,
            message: "You're not connected to the server. Refresh the page and try again.",
            status: 'error',
        })
    }





}

export default Notifications;