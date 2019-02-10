import { prepend } from "../utils";

class Gallery {
    static prevImage(e) {
        this.current = this.current.previousElementSibling;

        if (this.current === null)
            return

        let src = this.current.querySelector('img').getAttribute('src');

        this.title.innerHTML = this.current.getAttribute('data-title');
        this.author.innerHTML = this.current.getAttribute('data-author') ? 'by ' + this.current.getAttribute('data-author') : '';
        this.preview.setAttribute('src', src);

        if (this.current.previousElementSibling === null)
            e.target.style.display = 'none';

        if (e.target.nextElementSibling.style.display === 'none')
            e.target.nextElementSibling.style.display = 'block';
    }

    static nextImage(e) {
        this.current = this.current.nextElementSibling;

        if (this.current === null)
            return;

        let src = this.current.querySelector('img').getAttribute('src');

        this.title.innerHTML = this.current.getAttribute('data-title');
        this.author.innerHTML = this.current.getAttribute('data-author') ? 'by ' + this.current.getAttribute('data-author') : '';
        this.preview.setAttribute('src', src);

        if (this.current.nextElementSibling === null)
            e.target.style.display = 'none';

        if (e.target.previousElementSibling.style.display === 'none')
            e.target.previousElementSibling.style.display = 'block';
    }

    static close() {
        this.gallery.style.display = 'none';
    }

    static init(element) {
        this.gallery = document.querySelector('.gallery');
        this.preview = this.gallery.querySelector('img');
        this.prev = this.gallery.querySelector('button:nth-of-type(2)');
        this.next = this.gallery.querySelector('button:last-of-type');
        this.title = this.gallery.querySelector('div .title');
        this.author = this.gallery.querySelector('div .author');

        this.gallery.addEventListener('click', e => {
            switch (e.target.getAttribute('data-action')) {
                case 'prev':
                    this.prevImage(e);
                    break;
                case 'next':
                    this.nextImage(e);
                    break;
                case 'close':
                    this.close();
                    break;
                default:
            }
        });
    }

    static show(element) {
        this.current = element.parentNode.parentNode;
        this.prev.style.display = 'block';
        this.next.style.display = 'block';

        if (this.current === this.current.parentNode.children[0])
            this.prev.style.display = 'none';

        if (this.current === this.current.parentNode.children[this.current.parentNode.children.length - 1])
            this.next.style.display = 'none';

        this.preview.setAttribute('src', element.getAttribute('src'));

        this.title.innerHTML = this.current.getAttribute('data-title');
        this.author.innerHTML = this.current.getAttribute('data-author') ? 'by ' + this.current.getAttribute('data-author') : '';

        this.gallery.style.display = 'block';
    }
}

export default Gallery;