export const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    gray: "\x1b[90m",
    bold: "\x1b[1m",
};
export function green(text) {
    return `${colors.green}${text}${colors.reset}`;
}
export function red(text) {
    return `${colors.red}${text}${colors.reset}`;
}
export function yellow(text) {
    return `${colors.yellow}${text}${colors.reset}`;
}
export function blue(text) {
    return `${colors.blue}${text}${colors.reset}`;
}
export function gray(text) {
    return `${colors.gray}${text}${colors.reset}`;
}
export function bold(text) {
    return `${colors.bold}${text}${colors.reset}`;
}
