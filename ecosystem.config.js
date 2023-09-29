module.exports = {
  apps: [
    {
      name: 'chad-weblog',
      script: 'server.js',
      instance: 1,
      watch: false,
      max_memory_restart: '250M',
      env_production: {
        APP_ENV: 'production',
      },
    },
  ],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
}
