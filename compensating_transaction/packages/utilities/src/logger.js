import winston from 'winston';

const { createLogger, format, transports } = winston;
const {
  combine, printf, timestamp, label,
} = format;

const formatLogs = printf(
  ({
    level, message, label: labelText, timestamp: date,
  }) => `${date} [${labelText}] - ${level}: ${message}`,
);
export default (labelText) => createLogger({
  format: combine(
    label({
      label: labelText,
    }),
    timestamp(),
    formatLogs,
  ),
  transports: [new transports.Console()],
});
