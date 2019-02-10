import { hideOrDisplay, hasClass } from '../utils';

class Dropdown {
    static init() {
        document.addEventListener('click', e => {
            if (hasClass(e.target, 'js-dropdown-drop')) {
                let menu = e.target.nextElementSibling;

                hideOrDisplay(menu);
            }
        });
    }
}

export default Dropdown;