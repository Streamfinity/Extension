import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { HANDSHAKE_VALIDATE } from '~/messages';

const log = createLogger('Content-Handshake');

let loading = false;
let hasToken = false;

async function performHandshake(data) {
    log.debug('got data from frontend', data);

    const waitForTokenInterval = setInterval(() => {
        if (hasToken) {
            return;
        }

        const { data: nextData } = findHandshakeData();
        if (!nextData.token) {
            log.debug('waiting for token...', nextData);
            return;
        }

        log.debug('found token', nextData.token);
        hasToken = true;
        validateHandshake(nextData);
        clearInterval(waitForTokenInterval);
    }, 200);
}

async function validateHandshake(data) {
    const response = await browser.runtime.sendMessage({
        type: HANDSHAKE_VALIDATE,
        data,
    });

    const element = findElement();

    if (response.success) {
        element.dispatchEvent(new CustomEvent('verify-success'));
    } else {
        element.dispatchEvent(new CustomEvent('verify-error'));
    }

    log.debug('validation', response);
}

function findElement() {
    return document.querySelector('#extension-handshake-trigger');
}

function findHandshakeData() {
    const element = findElement();
    if (!element) {
        return {};
    }

    return { data: JSON.parse(element.dataset.handshake), element };
}

const findElementInterval = setInterval(async () => {
    if (loading) {
        return;
    }

    const { data, element } = findHandshakeData();
    if (!data) {
        return;
    }

    element.dispatchEvent(new CustomEvent('attempt'));
    loading = true;

    await performHandshake(data);

    clearInterval(findElementInterval);
}, 200);
