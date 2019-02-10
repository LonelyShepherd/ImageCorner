import Notifier from './Notifier';
import Dashboard from './Dashboard';
import Dropdown from './Dropdown';

class Global {
    static init() {
        Dropdown.init();
        Dashboard.init();

        Notifier.for(document.querySelector('.js-actions-info'), false);
    }
}

export default Global;