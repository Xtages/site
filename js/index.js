const feather = require('feather-icons');
window.jQuery = window.$ = require('jquery');
require('bootstrap/js/dist/collapse');
require('bootstrap/js/dist/dropdown');
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
    if (window['gtag'] && window['gaIsLoaded']) {
        window['gtag'](method, event, argsMap);
    } else if (argsMap['event_callback']) {
        argsMap['event_callback']();
    }
}

(function registerSubmitSubscribeForm() {
    window['submitSubscribeForm'] = function (formEl) {
        function showThanks() {
            const thanks = document.getElementById('subscribe-thanks');
            thanks.style.display = 'block';
            formEl.style.display = 'none';
        }

        if (!formEl.classList.contains('submitted')) {
            const form = new FormData(formEl);
            const honeyPot = form.get('___honey___pot');
            form.set('entry.1961309452', window.___planName);
            if (honeyPot == null || honeyPot === '') {
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
                    } catch (e) {
                    } finally {
                        showThanks();
                    }
                }

                maybeDoGtag('event', 'sign_up', {
                    'method': window.___planName || 'form',
                    'event_callback': doSubmit
                });
            } else {
                maybeDoGtag('event', 'exception', {'description': 'Honey pot not empty'});
            }
        }
        return false;
    };
})();


(function registerSubmitContactForm() {
    window['submitContactForm'] = function (formEl) {
        function showThanks() {
            const thanks = document.getElementById('contact-thanks');
            thanks.style.display = 'block';
            formEl.style.display = 'none';
        }

        if (!formEl.classList.contains('submitted')) {
            const form = new FormData(formEl);
            const honeyPot = form.get('___honey___pot');
            if (honeyPot == null || honeyPot === '') {
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
                    } catch (e) {
                    } finally {
                        showThanks();
                    }
                }

                maybeDoGtag('event', 'contact_us', {
                    'method': window.___planName || 'form',
                    'event_callback': doSubmit
                });
            } else {
                maybeDoGtag('event', 'exception', {'description': 'Honey pot not empty'});
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

(function () {
    window['captureJoinMailingList'] = function captureJoinMailingList(anchor, planName) {
        window.___planName = planName;
        maybeDoGtag('event', 'select_item', {
            'item_list_name': anchor.href,
            'items': [{
                'item_id': planName,
                'item_name': planName,
            }],
            'event_callback': function () {
                document.location = anchor.href;
            }
        });
    };

    window['captureJoinWaitList'] = function captureJoinWaitList(anchor) {
        const priceId = anchor.dataset.priceId;
        window.___planName = anchor.dataset.planSku;
        maybeDoGtag('event', 'add_to_wishlist', {
            'items': [{
                'item_id': anchor.dataset.planSku,
                'item_name': priceId,
            }],
            'event_callback': function () {
                document.location = anchor.href;
            }
        });
    };

    window['capturePurchase'] = function capturePurchase(anchor) {
        const priceId = anchor.dataset.priceId;
        window.___planName = anchor.dataset.planSku;
        maybeDoGtag('event', 'begin_checkout', {
            'items': [{
                'item_id': anchor.dataset.planSku,
                'item_name': priceId,
            }],
            'event_callback': function () {
                document.location = anchor.href;
            }
        });
    };

    window['toggleBillingCycle'] = function toggleBillingCycle(button) {
        if (button.classList.contains('active')) {
            return;
        }
        const plans = {
            'free': {
                'monthly': {
                    'priceId': '',
                    'price': '0',
                    'sku': 'free-monthly',
                },
                'yearly': {
                    'priceId': '',
                    'price': '0',
                    'sku': 'free-yearly',
                },
            },
            'starter': {
                'monthly': {
                    'priceId': 'price_1JrxP2IfxICi4AQgc1IrRkmF',
                    'price': '188',
                    'sku': 'starter-monthly',
                    'billingInfo': 'per month'
                },
                'yearly': {
                    'priceId': 'price_1JrxN0IfxICi4AQgOdyA0KrI',
                    'price': '150',
                    'sku': 'starter-yearly',
                    'billingInfo': 'per month, paid yearly'
                },
            },
            'pro': {
                'monthly': {
                    'priceId': 'price_1JrxRfIfxICi4AQgqOq4bq3C',
                    'price': '438',
                    'sku': 'pro-monthly',
                    'billingInfo': 'per month'
                },
                'yearly': {
                    'priceId': 'price_1JrxQUIfxICi4AQgdh0e4NG3',
                    'price': '350',
                    'sku': 'pro-yearly',
                    'billingInfo': 'per month, paid yearly'
                },
            },
        };
        const isMonthly = button.dataset.pricing === 'monthly';
        const cycle = isMonthly ? 'monthly' : 'yearly';
        const buttonToToggle = isMonthly ? 'yearly' : 'monthly';
        button.classList.add('active');
        button.classList.remove('btn-soft-primary');
        button.classList.add('btn-primary');
        document.querySelectorAll(`[data-pricing="${buttonToToggle}"]`).forEach((toToggle) => {
            toToggle.classList.remove('active');
            toToggle.classList.add('btn-soft-primary');
            toToggle.classList.remove('btn-primary');
        });
        for (let planKey in plans) {
            const plan = plans[planKey];
            const planForCycle = plan[cycle];
            document.querySelectorAll(`[data-plan-price-id="${planKey}"]`).forEach((planPriceEl) => {
                planPriceEl.textContent = planForCycle.price;
            });
            document.querySelectorAll(`a[data-purchase-button="${planKey}"]`).forEach((anchorEl) => {
                const url = new URL(anchorEl.href);
                if (url.searchParams.has('priceId')) {
                    url.searchParams.set('priceId', planForCycle.priceId);
                }
                anchorEl.href = url.toString();
                anchorEl.dataset.priceId = planForCycle.priceId;
                anchorEl.dataset.planSku = planForCycle.sku;
            })
            document.querySelectorAll(`[data-plan-billing-info="${planKey}"]`).forEach((planBillingInfoEl) => {
                planBillingInfoEl.textContent = planForCycle.billingInfo;
            })
        }
    };
})();
