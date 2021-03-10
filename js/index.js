
const feather = require('feather-icons');
window.jQuery = window.$ = require('jquery');
require('bootstrap/js/dist/collapse');
require('bootstrap/js/dist/modal');

feather.replace({
    'width': '1em',
    'height': '1em',
});

function maybeShowCookiesModal() {
    const $modal = $("#modal-cookies");

    function show($this) {
        const cookies = localStorage.getItem('modal_cookies');

        if (!cookies) {
            $this.modal('show')
        }
    }

    function hide($this) {
        $this.modal('hide')
    }

    if ($modal.length) {
        show($modal);

        $modal.on('hidden.bs.modal', function (e) {
            localStorage.setItem('modal_cookies', 1);
        })
    }
}
maybeShowCookiesModal();