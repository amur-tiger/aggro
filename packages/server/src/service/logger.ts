export class Logger {
  public constructor(private readonly prefix?: Function | string) {}

  private log(
    level: "debug" | "info" | "warn" | "error",
    message: unknown,
    args: unknown[]
  ) {
    const color = {
      debug: "\x1b[37m",
      info: "\x1b[92m",
      warn: "\x1b[93m",
      error: "\x1b[91m",
    }[level];
    const highlight = "\x1b[93m";
    const reset = "\x1b[0m";

    const pad = (n1: number, n2 = 2) => `${n1}`.padStart(n2, "0");

    let prefix = "";
    if (this.prefix) {
      prefix = `${highlight}[${
        typeof this.prefix === "string" ? this.prefix : this.prefix.name
      }]${reset} `;
    }
    const date = new Date();
    const dateStamp = `${pad(date.getDate())}.${pad(
      date.getMonth() + 1
    )}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(
      date.getMinutes()
    )}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;

    console[level === "error" ? "error" : "log"](
      typeof message === "string"
        ? `${color}[Aggro] ${process.pid}${reset} ${dateStamp} ${color}${level
            .toUpperCase()
            .padEnd(5)}${reset} ${prefix}${color}${message}${reset}`
        : message,
      ...args
    );
  }

  public debug(message: unknown, ...args: unknown[]) {
    this.log("debug", message, args);
  }

  public info(message: unknown, ...args: unknown[]) {
    this.log("info", message, args);
  }

  public warn(message: unknown, ...args: unknown[]) {
    this.log("warn", message, args);
  }

  public error(message: unknown, ...args: unknown[]) {
    this.log("error", message, args);
  }
}
