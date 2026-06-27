export const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

export function green(text: string): string {
  return `${colors.green}${text}${colors.reset}`;
}

export function red(text: string): string {
  return `${colors.red}${text}${colors.reset}`;
}

export function yellow(text: string): string {
  return `${colors.yellow}${text}${colors.reset}`;
}

export function blue(text: string): string {
  return `${colors.blue}${text}${colors.reset}`;
}

export function gray(text: string): string {
  return `${colors.gray}${text}${colors.reset}`;
}

export function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}
