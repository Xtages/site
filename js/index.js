
const feather = require('feather-icons');
window.jQuery = window.$ = require('jquery');
require('bootstrap/js/dist/collapse');
require('bootstrap/js/dist/modal');
const lightbox = require('lightbox2');

feather.replace({
    'width': '1em',
    'height': '1em',
});

// function maybeShowCookiesModal() {
//     const $modal = $("#modal-cookies");

//     function show($this) {
//         const cookies = localStorage.getItem('modal_cookies');

//         if (!cookies) {
//             $this.modal('show')
//         }
//     }

//     function hide($this) {
//         $this.modal('hide')
//     }

//     if ($modal.length) {
//         show($modal);

//         $modal.on('hidden.bs.modal', function (e) {
//             localStorage.setItem('modal_cookies', 1);
//         })
//     }
// }
// maybeShowCookiesModal();

function maybeDoGtag(method, event, argsMap) {
    if (window['gtag']) {
        window['gtag'](method, event, argsMap);
    } else if (argsMap['event_callback']) {
        argsMap['event_callback']();
    }
}

(function registerSubmitSubscribeForm(formEl) {
    window['submitSubscribeForm'] = function (formEl) {
        function showThanks() {
            const thanks = document.getElementById('subscribe-thanks');
            thanks.style.display = 'block';
            formEl.style.display = 'none';
        }

        if (!formEl.classList.contains('submitted')) {
            const form = new FormData(formEl);
            const honeyPot = form.get('___honey___pot');
            if (honeyPot == null || honeyPot == '') {
                function doSubmit() {
                    formEl.classList.add('submitted');
                    try {
                        const data = new URLSearchParams(form).toString();
                        const req = new XMLHttpRequest();
                        req.addEventListener('error', () => {
                        });
                        req.open('POST', formEl.action);
                        req.setRequestHeader('Accept', 'application/xml, text/xml, */*; q=0.01');
                        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        req.send(data);
                    } catch (e) { } finally {
                        showThanks();
                    }
                }
                maybeDoGtag('event', 'sign_up', {
                    'method': 'form',
                    'event_callback': doSubmit
                });
            } else {
                maybeDoGtag('event', 'exception', { 'description': 'Honey pot not empty' });
            }
        }
        return false;
    };
})();


(function registerSubmitContactForm(formEl) {
    window['submitContactForm'] = function (formEl) {
        function showThanks() {
            const thanks = document.getElementById('contact-thanks');
            thanks.style.display = 'block';
            formEl.style.display = 'none';
        }

        if (!formEl.classList.contains('submitted')) {
            const form = new FormData(formEl);
            const honeyPot = form.get('___honey___pot');
            if (honeyPot == null || honeyPot == '') {
                function doSubmit() {
                    formEl.classList.add('submitted');
                    try {
                        const data = new URLSearchParams(form).toString();
                        const req = new XMLHttpRequest();
                        req.addEventListener('error', () => {
                        });
                        req.open('POST', formEl.action);
                        req.setRequestHeader('Accept', 'application/xml, text/xml, */*; q=0.01');
                        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        req.send(data);
                    } catch (e) { } finally {
                        showThanks();
                    }
                }
                maybeDoGtag('event', 'contact_us', {
                    'method': this.___planName || 'form',
                    'event_callback': doSubmit
                });
            } else {
                maybeDoGtag('event', 'exception', { 'description': 'Honey pot not empty' });
            }
        }
        return false;
    };
})();

(function setGallery() {
    lightbox.option({
        'resizeDuration': 300,
    });
})();

(function registerCapturePurchase(anchor, planName) {
    window['capturePurchase'] = function capturePurchase(anchor, planName) {
        window.___planName = planName;
        maybeDoGtag('event', 'select_content', {
            'content_type': 'product',
            'items': [{
                'id': planName,
                'name': planName,
            }],
            'event_callback': function () {
                document.location = anchor.href;
            }
        });
    }
})();
