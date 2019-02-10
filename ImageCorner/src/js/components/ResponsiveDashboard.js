import { setTimeout } from "timers";

class ResponsiveDashboard {
    constructor(collapser, nav, navOverlay, onResize) {
        this.collapser = collapser;
        this.nav = nav;
        this.navOverlay = navOverlay;
        this.onResize = onResize;
    }

    handleOnResize() {
        if (!this.onResize)
            return;

        let _ = this;

        window.addEventListener('resize', () => {
            let windowSize = window.innerWidth;

            if (windowSize >= 720) {
                _.collapser.setAttribute('aria-hidden', true);
                _.navOverlay.style.display = 'none';
                _.nav.style.marginLeft = 0;
            } else {
                if (_.collapser.getAttribute('aria-hidden') === 'true')
                    _.nav.style.marginLeft = '-240px';
            }
        });
    }

    handleCollapserOnClick() {
        let _ = this;

        _.collapser.addEventListener('click', () => {
            if (_.collapser.getAttribute('aria-hidden') === 'true') {
                _.nav.style.zIndex = '1000';
                _.navOverlay.style.display = 'block';
                _.nav.style.marginLeft = 0;
                _.collapser.setAttribute('aria-hidden', false);
            }
        });
    }

    handleOverlayOnClick() {
        let _ = this;

        _.navOverlay.addEventListener('click', () => {
            if (_.collapser.getAttribute('aria-hidden') === 'false') {
                _.navOverlay.style.display = 'none';
                _.nav.style.marginLeft = '-240px';
                setTimeout(() => _.nav.style.zIndex = '1', 300);
                _.collapser.setAttribute('aria-hidden', true);
            }
        });
    }

    init() {
        this.handleOnResize();
        this.handleCollapserOnClick();
        this.handleOverlayOnClick();
    }
}

export default ResponsiveDashboard;