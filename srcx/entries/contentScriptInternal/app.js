/* eslint-disable no-param-reassign */

import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

async function inspectDomElements() {
    const elements = document.querySelectorAll('[data-streamfinity-extension]');

    elements.forEach((element) => {
        const action = element.getAttribute('data-streamfinity-extension');

        switch (action) {
        case 'hide':
            if (element.style.display !== 'none') {
                element.style.display = 'none';
            }
            break;
        case 'show':
            if (element.style.display === 'none') {
                element.style.display = 'block';
            }
            break;
        default:
            log.warn(`unknown action: ${action}`);
        }
    });
}

export default async function app() {
    setInterval(async () => {
        await inspectDomElements();
    }, 2000);
}
