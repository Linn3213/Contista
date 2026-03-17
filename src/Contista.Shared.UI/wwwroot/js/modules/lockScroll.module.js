// wwwroot/js/modules/lockScroll.module.js
let count = 0;
export const lockScroll = {
    lock() {
        count++;
        document.body.classList.add("cal-modalOpen");
    },
    unlock() {
        count = Math.max(0, count - 1);
        if (count === 0) document.body.classList.remove("cal-modalOpen");
    }
};