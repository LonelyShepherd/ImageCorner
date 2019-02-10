import { hideOrDisplay, hasClass } from "../utils";

class Select {
    constructor(element) {
        this.element = element;

        this.init();
    }

    init() {
        let defaultValue = this.element.querySelector('li.default').innerHTML,
            selected = this.element.querySelector('span.selected');

        selected.innerHTML = defaultValue;

        this.element.addEventListener('click', (e) => {
            if (hasClass(e.target, 'js-select-drop')) {
                let menu = e.target.nextElementSibling;

                hideOrDisplay(menu);
            }
            if (e.target.tagName === 'LI') {
                let li = e.target,
                    newValue = li.innerHTML;

                let menu = li.parentNode.parentNode;
                menu.previousElementSibling.innerHTML = newValue;

                hideOrDisplay(menu);
            }
        });
    }
}

export default Select;