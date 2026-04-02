const mysql = require('mysql');

function connectionFactory() {
  const sslCaRaw = process.env.DB_SSL_CA;
  const sslCa = sslCaRaw ? sslCaRaw.replace(/\\n/g, '\n') : undefined;
  const useSsl = !!sslCa || process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'equantom',
    port: Number(process.env.DB_PORT || 3306),
    ssl: useSsl
      ? {
          ca: sslCa || undefined,
          rejectUnauthorized: true,
        }
      : undefined,
  });
}

module.exports = () => connectionFactory;
