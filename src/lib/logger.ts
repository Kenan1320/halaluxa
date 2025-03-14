
/**
 * A lightweight logging utility to centralize and control console logs
 * Makes it easy to disable all logs in production or selectively enable them
 */

// Set to false in production to disable all logs
const ENABLE_LOGS = process.env.NODE_ENV === 'development';

// Set to true to enable debug level logs
const ENABLE_DEBUG = false;

export const logger = {
  // Regular info logs - general application flow
  info: (message: string, ...args: any[]) => {
    if (ENABLE_LOGS) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  // Success logs - for successful operations
  success: (message: string, ...args: any[]) => {
    if (ENABLE_LOGS) {
      console.log(`[SUCCESS] ${message}`, ...args);
    }
  },
  
  // Warning logs - potential issues
  warn: (message: string, ...args: any[]) => {
    if (ENABLE_LOGS) {
      console.warn(`[WARNING] ${message}`, ...args);
    }
  },
  
  // Error logs - should always be enabled even in production
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  // Debug logs - very verbose, disabled by default
  debug: (message: string, ...args: any[]) => {
    if (ENABLE_LOGS && ENABLE_DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
};

export default logger;
