import Gallery from "./components/Gallery";

Gallery.init();

const imagesList = document.querySelector('ul.shared-album');

if (imagesList !== null) {
    imagesList.addEventListener('click', e => {
        if (e.target.tagName === 'DIV' && hasClass(e.target, 'image-container'))
            Gallery.show(e.target.querySelector('img'));
        else if (e.target.tagName === 'IMG')
            Gallery.show(e.target);
    });
}