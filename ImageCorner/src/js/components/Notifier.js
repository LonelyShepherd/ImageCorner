export const operation = {
    pending: 'pending',
    success: 'success',
    failure: 'failure'
}

class Notifier {
    static slide(direction) {
        switch (direction) {
            case 'up':
                this.element.style.marginBottom = '30px';
                break;
            case 'down':
            default:
                this.element.style.marginBottom = '-70px';

        }
    }

    static scheduleClosing() {
        this.action.style.display = '';

        clearTimeout(this.scheduled);

        this.scheduled = setTimeout(() => {
            this.setState(false);
        }, 10000);
    }

    static pauseClosing() {
        if (this.scheduled)
            clearTimeout(this.scheduled);

        this.action.style.display = 'none';
    }

    static setState(state, operation, message) {
        this.state = state;

        this.indicator.className = operation || '';
        this.message.innerHTML = message || '';

        if (this.state) {
            this.slide('up');
            this.scheduleClosing();
        } else {
            this.slide('down');
        }
    }

    static setElement(element) {
        this.element = element;
    }

    static getElement() {
        return this.element;
    }

    static for(element, state) {
        this.setElement(element);
        this.init();
        this.setState(state);
    }

    static init() {
        this.indicator = this.element.querySelector('i');
        this.message = this.element.querySelector('span');
        this.action = this.element.querySelector('button');

        this.action.addEventListener('click', () => {
            this.setState(false);
        });
    }
}

export default Notifier;