/* eslint-disable no-param-reassign */

import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

/**
 * Function: inspectDomElements
 * 
 * Description: This function inspects DOM elements with a specific attribute and performs actions based on the attribute value.
 * 
 * Steps:
 * 1. Select all elements with the attribute '[data-streamfinity-extension]'.
 * 2. Iterate over each element and get the value of the 'data-streamfinity-extension' attribute.
 * 3. Based on the attribute value, perform the following actions:
 *    - If the value is 'hide', hide the element by setting its display style to 'none'.
 *    - If the value is 'show', show the element by setting its display style to 'block'.
 *    - For any other value, log a warning message indicating an unknown action.
 * 
 * @returns {void}
 */
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

/**
 * Asynchronous function that runs at regular intervals to inspect DOM elements with specific attributes.
 * Uses setInterval to call the inspectDomElements function every 2000 milliseconds.
 * 
 * @returns {Promise<void>} A Promise that resolves once the function is executed.
 */
export default async function app() {
    setInterval(async () => {
        await inspectDomElements();
    }, 2000);
}
