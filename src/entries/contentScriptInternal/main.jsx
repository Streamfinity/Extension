/**
 * Imports necessary modules and functions, creates a logger for the 'Content-Script' section,
 * logs a debug message, and executes the 'app' function.
 */
import '~/enableDevHmr';
import app from './app';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

log.debug('content script INTERNAL main');

app();
