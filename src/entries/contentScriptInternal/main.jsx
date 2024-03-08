import './enableDevHmr';
import app from './app';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

log.debug('content script INTERNAL main');

app();
