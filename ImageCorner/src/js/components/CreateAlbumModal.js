import Notifier, { operation } from "./Notifier";
import { hasClass, prepend, addImages } from "../utils";

class CreateAlbumModal {
    constructor(element) {
        this.element = element;

        this.init();
    }

    init() {
        let albumsList = document.querySelector('.corner ul.albums'),
            imagesList = document.querySelector('.corner ul.images'),
            formData;

        function addCreated(albumsList, data) {
            let li = document.createElement('li');

            li.id = data.Id;
            li.className = 'album-item';

            li.innerHTML =
                `<a href="/User/MyAlbum?id=${data.Id}"></a>
                <div>
                    ${data.Mode === 'Public' ? '<span>showcasing</span>' : ''}
                </div>
                <div>
                    <span>${data.Name}</span>
                    <span>${data.ImageCount} images</span>
                    <div class="js-dropdown js-image-dropdown">
                        <button class="js-dropdown-drop"><i></i><i></i><i></i></button>
                        <div class="menu" aria-hidden="true">
                            <ul class="section">
                                <li><button>Share</button></li>
                                <li><button>Make ${data.Mode === 'Public' ? 'Private' : 'Public'}</button></li>
                                <li><button>Remove</button></li>
                            </ul>
                        </div>
                    </div>
                </div>`;

            prepend(li, albumsList);
        }

        let fileInput = this.element.querySelector('.modal-body #upload-to-album');

        fileInput.addEventListener('change', () => {
            formData = new FormData();

            let ul = document.createElement('ul');

            ul.className = 'upload-list clearfix';

            [].forEach.call(fileInput.files, file => {
                let li = document.createElement('li');

                li.innerHTML =
                    '<span>' + file.name + '</span>' +
                    '<span>' + file.size + ' bytes</span>';

                ul.appendChild(li);
                formData.append(file.name, file);
            });

            let selectList = this.element.querySelector('.modal-body ul');
            console.log(selectList);

            selectList.parentNode.replaceChild(ul, selectList);

            this.element.setAttribute('data-option', 'will-upload');
        });

        this.element.addEventListener('click', e => {
            let isSelected,
                item;

            function selectItem() {
                if ((isSelected === 'false' || !isSelected) && hasClass(item, 'selectable')) {
                    item.querySelector('span').style.display = 'block';
                    item.setAttribute('data-selected', true);
                }
            }

            function deselectItem() {
                if (isSelected && isSelected === 'true' && hasClass(item, 'selectable')) {
                    item.querySelector('span').style.display = 'none';
                    item.setAttribute('data-selected', false);
                }
            }

            switch (e.target.tagName) {
                case 'IMG':
                    item = e.target.parentNode;
                    isSelected = item.getAttribute('data-selected');

                    selectItem();
                    break;
                case 'LI':
                    item = e.target;
                    isSelected = item.getAttribute('data-selected');

                    selectItem();
                    break;
                case 'SPAN':
                    item = e.target.parentNode;
                    isSelected = item.getAttribute('data-selected');

                    deselectItem();
                    break;
                case 'BUTTON':
                    let items = this.element.querySelectorAll('ul li'),
                        name = this.element.querySelector('input');

                    if (e.target.innerHTML === 'Cancel') {
                        this.element.remove();

                        return;
                    }

                    if (e.target.innerHTML !== 'Create')
                        return;

                    let mode = this.element.querySelector('.js-select .selected').innerHTML,
                        selected = [];

                    [].forEach.call(items, item => {
                        if (item.getAttribute('data-selected') === 'true') {
                            selected.push(item.id);
                        }
                    });

                    selected = selected.join(',');

                    Notifier.setState(true, operation.pending, 'Creating album...');
                    Notifier.pauseClosing();

                    let url;
                    let options = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                        }, 
                        credentials: 'include'
                    }                    

                    if (this.element.getAttribute('data-option') === 'will-upload') {
                        formData.append('mode', mode);
                        formData.append('albumName', name.value);

                        url = '/User/UploadAlbum';

                        options.body = formData;
                    } else {
                        url = `/User/CreateAlbum?name=${name.value}&mode=${mode}&selected=${selected}`;
                    }

                    fetch(url, options)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            addCreated(albumsList, data);

                            if (this.element.getAttribute('data-option') == 'will-upload')
                                addImages(imagesList, data.Images);

                            Notifier.setState(true, operation.success, 'Album created');
                            this.element.remove();
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

export default CreateAlbumModal;