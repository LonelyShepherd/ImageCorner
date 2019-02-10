import Global from './components/Global';
import Gallery from './components/Gallery';
import Notifier, { operation } from './components/Notifier';
import ResponsiveDashboard from './components/ResponsiveDashboard';
import Select from './components/Select';
import { prepend, hasClass } from './utils';
import CreateAlbumModal from './components/CreateAlbumModal';
import 'whatwg-fetch';
import UploadModal from './components/UploadModal';

Global.init();
Gallery.init();

const imagesList = document.querySelector('ul.images');

imagesList.addEventListener('click', e => {
    if (e.target.tagName === 'DIV' && hasClass(e.target, 'image-container'))
        Gallery.show(e.target.querySelector('img'));
    else if (e.target.tagName === 'IMG')
        Gallery.show(e.target);
});

document.querySelector('.image-upload-button input').addEventListener('change', () => {
    Notifier.setState(true, operation.pending, 'Loading...');
    Notifier.pauseClosing();

    fetch('/User/UploadImages', {
        credentials: 'include'
    })
        .then(result => {
            return result.text();
        })
        .then(html => {
            let fragment = document.createDocumentFragment(),
                modal = document.createElement('div');

            modal.className = 'js-modal js-modal-image-upload';
            modal.innerHTML = html;

            let select = modal.querySelector('.js-select');

            fragment.appendChild(modal);
            prepend(fragment, document.body);

            new Select(select);
            new UploadModal(modal);

            Notifier.setState(false);
        })
        .catch(() => {
            Notifier.setState(true, operation.failure, 'Something went wrong');
        });
});

document.querySelector('.create-album-button').addEventListener('click', () => {
    Notifier.setState(true, operation.pending, 'Loading...');
    Notifier.pauseClosing();

    fetch('/User/NewAlbum', {
        credentials: 'include'
    })
        .then(result => {
            return result.text();
        })
        .then(html => {
            let fragment = document.createDocumentFragment(),
                modal = document.createElement('div');

            modal.className = 'js-modal js-modal-album-create';
            modal.innerHTML = html;

            let select = modal.querySelector('.js-select');

            fragment.appendChild(modal);
            prepend(fragment, document.body);

            new Select(select);
            new CreateAlbumModal(modal);

            Notifier.setState(false);
        })
        .catch(() => {
            Notifier.setState(true, operation.failure, 'Something went wrong');
        });
});

new ResponsiveDashboard(document.getElementsByClassName('nav-collapser')[0],
    document.getElementsByClassName('dashboard-nav-container')[0],
    document.getElementsByClassName('dashboard-nav-overlay')[0], true).init();