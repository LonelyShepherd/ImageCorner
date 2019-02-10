import 'whatwg-fetch';
import { parents, prepend } from '../utils';
import Notifier, { operation } from './Notifier';
import ShareModal from './ShareModal';

class Dashboard {
    static init() {
        function getItem(element) {
            let item = parents(element, 'image-item'),
                type = '';

            if (item === null) {
                item = parents(element, 'album-item');

                if (item !== null)
                    type = 'album';
            } else {
                type = 'image';
            }

            return {
                item: item,
                type: type
            }
        }

        document.body.addEventListener('click', e => {
            if (e.target.tagName !== 'BUTTON')
                return;

            let listItem;

            let item,
                type;

            switch (e.target.innerHTML) {
                case 'Share':
                case 'Share album':
                case 'Share image':
                    let toShare = e.target.getAttribute('data-share');

                    listItem = getItem(e.target);
                    item = toShare ? e.target : listItem.item;
                    type = toShare ? e.target.getAttribute('data-share-type') : listItem.type;

                    Notifier.setState(true, operation.pending, 'Loading...');
                    Notifier.pauseClosing();

                    fetch(`/User/Share?id=${item.id}&type=${type}`, {
                        credentials: 'include'
                    })
                        .then(response => {
                            return response.text();
                        })
                        .then(html => {
                            let fragment = document.createDocumentFragment(),
                                modal = document.createElement('div');

                            modal.className = 'js-modal js-modal-share js-modal-no-footer';
                            modal.innerHTML = html;
                            modal.setAttribute('data-type', type);
                            modal.setAttribute('data-id', item.id);

                            fragment.appendChild(modal);
                            prepend(fragment, document.body);

                            new ShareModal(modal);

                            Notifier.setState(false);
                        })
                        .catch(() => {
                            Notifier.setState(true, operation.failure, 'Something went wrong');
                        });
                    break;
                case 'Remove':
                    listItem = getItem(e.target);
                    item = listItem.item;
                    type = listItem.type;

                    Notifier.setState(true, operation.pending, 'Loading...');
                    Notifier.pauseClosing();
                    console.log(item);
                    fetch(`/User/Remove?id=${item.id}&type=${type}`, {
                        method: 'POST',
                        credentials: 'include'
                    })
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            item.remove();

                            if (type === 'album') {
                                let imagesList = document.querySelectorAll('.corner ul.images > li');

                                [].forEach.call(imagesList, child => {
                                    if (~data.indexOf(+child.id))
                                        child.remove();
                                });
                            }

                            Notifier.setState(true, operation.success, 'Item successfuly deleted');
                        })
                        .catch(() => {
                            Notifier.setState(true, operation.failure, 'Something went wrong');
                        });
                    break;
                case 'Show':
                    e.target.parentNode.nextElementSibling.style.display = 'block';
                    e.target.innerHTML = 'Hide';
                    break;
                case 'Hide':
                    e.target.parentNode.nextElementSibling.style.display = 'none';
                    e.target.innerHTML = 'Show';
                    break;
                case 'Make Private':
                case 'Make Public':
                    listItem = getItem(e.target);
                    item = listItem.item;
                    type = listItem.type;

                    Notifier.setState(true, operation.pending, 'Working on it...');
                    Notifier.pauseClosing();

                    fetch(`/User/ChangeMode?id=${item.id}&type=${type}`, {
                        method: 'POST',
                        credentials: 'include'
                    })
                        .then(() => {
                            let mode = e.target.innerHTML,
                                changed = mode === 'Make Public' ? 'Public' : 'Private';

                            Notifier.setState(true, operation.success, 'View mode changed to ' + changed);

                            if (changed === 'Public') {
                                e.target.innerHTML = 'Make Private';

                                let span = document.createElement('span');
                                span.innerHTML = 'showcasing';

                                item.querySelector('div').appendChild(span);
                            } else {
                                e.target.innerHTML = 'Make Public';
                                item.querySelector('div span').remove();
                            }
                        })
                        .catch(() => {
                            Notifier.setState(true, operation.failure, 'Something went wrong');
                        });
                    break;
                default:
            }
        });
    }
}

export default Dashboard;