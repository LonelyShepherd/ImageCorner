import { hasClass } from '../utils';
import 'whatwg-fetch';
import Notifier, { operation } from './Notifier';

class ShareModal {
    constructor(element) {
        this.element = element;

        this.init();
    }

    init() {
        this.element.addEventListener('click', e => {
            if (e.target.tagName !== 'BUTTON')
                return;

            if (hasClass(e.target, 'js-modal-close'))
                this.element.remove();

            switch (e.target.innerHTML) {
                case 'Create link':
                    let type = this.element.getAttribute('data-type'),
                        id = this.element.getAttribute('data-id');

                    Notifier.setState(true, operation.pending, 'Creating link...');
                    Notifier.pauseClosing();

                    fetch(`/User/Link?id=${id}&type=${type}`, {
                        method: 'POST'
                    })
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            let span = this.element.querySelector('.modal-body div span'),
                                input = document.createElement('input');

                            input.type = 'text';
                            input.readOnly = true;
                            input.value = data;

                            span.parentNode.replaceChild(input, span);

                            e.target.innerHTML = 'Copy link';

                            Notifier.setState(true, operation.success, 'Your link has been created');
                        })
                        .catch(() => {
                            Notifier.setState(true, operation.failure, 'Something went wrong');
                        });
                    break;
                case 'Copy link':
                    let input = this.element.querySelector('.modal-body div input');

                    input.focus();
                    input.select();

                    try {
                        var successful = document.execCommand('copy');

                        if (successful)
                            Notifier.setState(true, operation.success, 'Link copied to clipboard');
                    } catch (e) {
                        Notifier.setState(true, operation.failure, 'Sorry, you will have to do it manually this time');
                    }
                    break;
                default:
            }
        });
    }
}

export default ShareModal;