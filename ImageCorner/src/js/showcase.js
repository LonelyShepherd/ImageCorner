import Gallery from './components/Gallery';
import ResponsiveDashboard from './components/ResponsiveDashboard';
import { hasClass } from './utils';
import Global from './components/Global';

Global.init();
Gallery.init();

const imagesList = document.querySelector('ul.images');

imagesList.addEventListener('click', e => {
    if (e.target.tagName === 'DIV' && hasClass(e.target, 'image-container'))
        Gallery.show(e.target.querySelector('img'));
    else if (e.target.tagName === 'IMG')
        Gallery.show(e.target);
});

new ResponsiveDashboard(document.getElementsByClassName('nav-collapser')[0],
    document.getElementsByClassName('dashboard-nav-container')[0],
    document.getElementsByClassName('dashboard-nav-overlay')[0], true).init();