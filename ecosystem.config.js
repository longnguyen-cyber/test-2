module.exports = {
  apps: [
    {
      name: 'seim',
      script: './dist/main.js',
      watch: true,
      ignore_watch: ['node_modules', 'src'],
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      pre_start: 'npm run build',
      interpreter: '/bin/bash',
    },
  ],
};
