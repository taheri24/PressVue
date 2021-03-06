import Vuex from 'vuex'

import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueGoodTablePlugin from 'vue-good-table';
export default ({ Vue, router, siteData }) => {
    Vue.use(Vuex)
    Vue.use(VueChartkick, { adapter: Chart })
    Vue.use(VueGoodTablePlugin)
    const routesForNav = siteData.themeConfig.nav.filter(n => n.link0).map(n => (
        { path: n.link, redirect: n.link0 }
    ));
    router.addRoutes(routesForNav);
}
let avoidStoreToggleMode = 0;
var simulateClick = function (elem) {

    // Create our event (with options)
    var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // If cancelled, don't dispatch our event
    return !elem.dispatchEvent(evt);
};
let lastSidebarClicked = +new Date();
function updateSidebar() {
    const sidebarButton = document.querySelector('.sidebar-button');
    if (sidebarButton && !sidebarButton.hasAttribute('data-click')) {
        sidebarButton.setAttribute('data-click', 'toggleMode');

        sidebarButton.addEventListener('click', () => {
            if (+new Date() - lastSidebarClicked < 200) return;
            lastSidebarClicked = +new Date();

            if (!document.querySelector('.theme-container.no-sidebar')) {
                const { documentElement } = document;
                documentElement.classList.toggle('is-sidebar-open');
                if (!avoidStoreToggleMode) localStorage.setItem('sidebar', documentElement.classList.contains('is-sidebar-open') ? '' : 'hide');
            }
        });

    }
    const sidebarToggled = localStorage.getItem('sidebar') == 'hide' ? false : true;
    avoidStoreToggleMode = 1;
    document.body.clientWidth > 959 &&
        (document.documentElement.classList.contains('is-sidebar-open') != sidebarToggled)
        && simulateClick(sidebarButton);
    setTimeout(() => avoidStoreToggleMode = 0, 100);
}
let current_page_url = '';
function pageChanged() {
    updateSidebar();
    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-links li'));
    for (const li of sidebarLinks) li.classList.remove('active');
    setTimeout(function () {
        const sidebarActive = document.querySelector('.sidebar-link.active');
        if (sidebarActive && sidebarActive.parentElement) {
            sidebarActive && sidebarActive.parentElement.classList.add('active');
            const hasChildren = !!sidebarActive.parentElement.querySelector('ul');
            if (hasChildren) {
                sidebarActive.parentElement.classList.add('has-children');
                sidebarActive.parentElement.classList.remove('no-children');
            }
            else {
                sidebarActive.parentElement.classList.remove('has-children');
                sidebarActive.parentElement.classList.add('no-children');
            }
        }
    }, 300);
}
function _pageChanged() {
    const contentElement = document.querySelector('.content');
    if (contentElement && current_page_url != location.pathname) {
        current_page_url = location.pathname;
        pageChanged();
    }
}

try {
    if (window && document && document.body) {
        setInterval(_pageChanged, 400);

    }
} catch (exc1) {

}