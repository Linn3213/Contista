// wwwroot/networkStatus.js
window.laNetwork = (() => {
    let dotnetRef = null;

    function isOnline() {
        return navigator.onLine === true;
    }

    function notify() {
        if (dotnetRef) {
            dotnetRef.invokeMethodAsync("SetOnline", isOnline());
        }
    }

    function start(ref) {
        dotnetRef = ref;
        window.addEventListener("online", notify);
        window.addEventListener("offline", notify);
        notify();
    }

    function stop() {
        window.removeEventListener("online", notify);
        window.removeEventListener("offline", notify);
        dotnetRef = null;
    }

    return { start, stop, isOnline };
})();
