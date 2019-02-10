import ResponsiveDashboard from './components/ResponsiveDashboard';
import Dropdown from './components/Dropdown';
import Notifier from './components/Notifier';
import { hasClass, isChildOf } from './utils';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';

Notifier.for(document.querySelector('.js-actions-info'), false);

Dropdown.init();
Dashboard.init();
Gallery.init();

let lastClicked;

document.body.addEventListener('click', e => {
    if (hasClass(e.target, 'js-dropdown-drop') || hasClass(e.target, 'js-select-drop')) {
        lastClicked = e.target;

    } else if (!hasClass(e.target, 'js-dropdown-drop') && !hasClass(e.target, 'js-select-drop')) {
        if (lastClicked !== undefined && !isChildOf(e.target, lastClicked.parentNode)) {
            let menu = lastClicked.nextElementSibling;

            menu.style.display = 'none';
            menu.setAttribute('aria-hidden', true);
        }
    }
});

document.querySelector('.album-content ul').addEventListener('click', e => {
    if (e.target.tagName === 'DIV' && hasClass(e.target, 'image-container'))
        Gallery.show(e.target.querySelector('img'));
    else if (e.target.tagName === 'IMG')
        Gallery.show(e.target);
});

new ResponsiveDashboard(document.getElementsByClassName('nav-collapser')[0],
    document.getElementsByClassName('dashboard-nav-container')[0],
    document.getElementsByClassName('dashboard-nav-overlay')[0], false).init();