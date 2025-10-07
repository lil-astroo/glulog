// ثبت Service Worker برای PWA

// بررسی اینکه مرورگر Service Worker ساپورت میکنه
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export default function register() {
    if ('serviceWorker' in navigator) {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (isLocalhost) {
            // روی localhost بررسی می‌کنیم که service worker درست کار کنه
            checkValidServiceWorker(swUrl);
        } else {
            // ثبت معمولی
            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('Service Worker ثبت شد:', registration);
                })
                .catch(error => {
                    console.error('ثبت Service Worker با خطا مواجه شد:', error);
                });
        }
    }
}

function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
        .then(response => {
            if (
                response.status === 404 ||
                response.headers.get('content-type').indexOf('javascript') === -1
            ) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                navigator.serviceWorker.register(swUrl);
            }
        })
        .catch(() => {
            console.log('هیچ اتصال اینترنتی وجود ندارد، در حالت آفلاین اجرا می‌شود');
        });
}

export default function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}