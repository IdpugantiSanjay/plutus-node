import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = new Date();

  res.on('finish', function () {
    const now = new Date();
    const took = +now - +start;

    const formatStatusCode = (statusCode: number): string => {
      const formattedStatusCode = '  ' + res.statusCode.toString() + '  '
      if (statusCode < 500 && statusCode >= 300) return chalk.bgYellowBright.bold.black(formattedStatusCode)
      if (statusCode >= 500) return chalk.bgRedBright.bold.white(formattedStatusCode)
      return chalk.bgGreen.bold.whiteBright(formattedStatusCode);
    }

    const formatTimeTook = (took: number): string => {
      const timeString = took + ' ms'
      if (took < 100) return chalk.greenBright.bold(timeString)
      if (took > 500) return chalk.redBright.bold(timeString)
      return chalk.yellowBright.bold(timeString)
    }

    const formatTime = () => `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getDate()).toString().padStart(2, '0')} - ${now.toLocaleTimeString()}`

    console.log(`[EXPRESS-${process.env['NODE_ENV']}] ${formatTime()}  |${formatStatusCode(res.statusCode)}|  ${formatTimeTook(took)}  |${chalk.bgBlue.bold.white('  ' + req.method.toUpperCase() + '  ')}|  ${chalk.magentaBright.bold(req.originalUrl)}`)
  })
  next();
};