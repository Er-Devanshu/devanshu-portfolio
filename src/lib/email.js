/* global __EMAIL_CODE__ */
// Decodes the email only when someone clicks Email me / Copy email (see vite.config.js).
export const getEmail = () => [...atob(__EMAIL_CODE__)].reverse().join("");
