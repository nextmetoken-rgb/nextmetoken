/** Logout khud kiya ya session expire hua, ye alag karne ke liye. */
let manual = false;
export const markManualLogout = () => { manual = true; };
export const isManualLogout = () => manual;
