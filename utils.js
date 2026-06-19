export function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return ''; // Handle invalid or empty input
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function checkPeriod(str) {
    if (str.charAt(str.length - 1) !== '.') {
        return str + '.'; // add the period at the end
    }
    return str;
}