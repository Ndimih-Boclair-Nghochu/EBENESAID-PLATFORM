module.exports = {
  apps: [
    {
      name: 'ebenesaid-platform',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/var/www/ebenesaid',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      error_file: '/var/log/ebenesaid/error.log',
      out_file: '/var/log/ebenesaid/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
