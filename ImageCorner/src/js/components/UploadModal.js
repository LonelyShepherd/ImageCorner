import Notifier, { operation } from "./Notifier";
import { prepend, addImages } from "../utils";

class UploadModal {
    constructor(element) {
        this.element = element;

        this.init();
    }

    init() {
        let formData = new FormData(),
            input = document.querySelector('.image-upload-button input'),
            ul = document.createElement('ul');

        [].forEach.call(input.files, file => {
            let li = document.createElement('li');

            li.innerHTML =
                '<span>' + file.name + '</span>' +
                '<span>' + file.size + ' bytes</span>';

            ul.appendChild(li);
            formData.append(file.name, file);
        });

        this.element.querySelector('.modal-body').appendChild(ul);

        let _ = this;

        function uploadImages() {
            _.element.remove();

            Notifier.setState(true, operation.pending, 'Uploading...');
            Notifier.pauseClosing();

            formData.append('mode', _.element.querySelector('.js-select .selected').innerHTML);

            fetch('/User/Upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    return response.json();
                }).then(data => {
                    let uploaded = data.files,
                        itemsList = document.querySelector('.corner ul.images');

                    addImages(itemsList, uploaded);

                    Notifier.setState(true, operation.success, 'Upload successful');
                })
                .catch(() => {
                    Notifier.setState(true, operation.failure, 'Upload failed');
                });
        }

        this.element.addEventListener('click', e => {
            switch (e.target.innerHTML) {
                case 'Upload':
                    uploadImages();
                    break;
                case 'Cancel':
                    this.element.remove();
                    break;
            }
        });
    }
}

export default UploadModal;