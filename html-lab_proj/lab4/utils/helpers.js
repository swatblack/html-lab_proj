
export const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds} секунд`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} минут ${remainingSeconds} секунд`;
};

export const isEmpty = (value) => {
    return value === null || value === undefined || value === '';
};

export const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};