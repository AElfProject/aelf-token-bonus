/**
 * @file config file
 * @author atom-yang
 */
const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  exports = {};
  const config = exports;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_development';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks'
    }
  };

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(__dirname, '../favicon.ico')),
  };

  // change to your own sequelize configurations
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'aelf_bonus',
    username: 'root',
    password: '',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false
    }
  };

  config.security = {
    csrf: {
      enable: process.env.NODE_ENV === 'production'
    }
  };
  config.aelf = {
    nodes: {
      main: {
        endpoint: 'http://192.168.197.14:8000',
        chainId: 'AELF',
        nativeTokenSymbol: '',
        primaryTokenSymbol: ''
      },
      side01: {
        endpoint: 'http://192.168.197.14:8001',
        chainId: '',
        nativeTokenSymbol: '',
        primaryTokenSymbol: ''
      },
      side02: {
        endpoint: 'http://192.168.197.14:8002',
        chainId: '',
        nativeTokenSymbol: '',
        primaryTokenSymbol: ''
      }
    },
    amount: 1000,
    privateKey: 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b' // Do not add real private key!!!
  };
  return config;
};
