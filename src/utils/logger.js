/**
 * Application logger utility
 * Provides consistent logging with timestamps and log levels
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Formats a log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data to log
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
};

/**
 * Logs an informational message
 * @param {string} message - Message to log
 * @param {Object} [data] - Optional data to log
 */
export const logInfo = (message, data) => {
  const formattedMessage = formatLogMessage(LOG_LEVELS.INFO, message, data);
  console.log(formattedMessage);
};

/**
 * Logs a warning message
 * @param {string} message - Message to log
 * @param {Object} [data] - Optional data to log
 */
export const logWarning = (message, data) => {
  const formattedMessage = formatLogMessage(LOG_LEVELS.WARN, message, data);
  console.warn(formattedMessage);
};

/**
 * Logs an error message
 * @param {string} message - Message to log
 * @param {Error|Object} [error] - Error object or data to log
 */
export const logError = (message, error) => {
  const formattedMessage = formatLogMessage(LOG_LEVELS.ERROR, message);
  
  if (error instanceof Error) {
    console.error(formattedMessage);
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
  } else if (error) {
    console.error(formattedMessage);
    console.error(error);
  } else {
    console.error(formattedMessage);
  }
};

/**
 * Logs a debug message (only in development)
 * @param {string} message - Message to log
 * @param {Object} [data] - Optional data to log
 */
export const logDebug = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    const formattedMessage = formatLogMessage(LOG_LEVELS.DEBUG, message, data);
    console.debug(formattedMessage);
  }
}; 