/**
 * @file init token bonus
 * @author atom-yang
 */
const Sequelize = require('sequelize');

const {
  DataTypes
} = Sequelize;

const {
  BIGINT,
  STRING,
  DATE,
  NOW
} = DataTypes;

const tokenBonus = {
  id: {
    type: BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    field: 'id'
  },
  address: {
    type: STRING(64),
    allowNull: false,
    field: 'address'
  },
  symbol: {
    type: STRING(64),
    allowNull: false,
    field: 'symbol'
  },
  chainId: {
    type: STRING(64),
    allowNull: false,
    field: 'chain_id'
  },
  amount: {
    type: BIGINT,
    allowNull: false,
    field: 'amount'
  },
  time: {
    type: DATE,
    allowNull: false,
    defaultValue: NOW,
    field: 'time'
  },
  memo: {
    type: STRING(255),
    allowNull: false,
    field: 'memo'
  },
  txId: {
    type: STRING(64),
    allowNull: false,
    field: 'tx_id'
  }
};
const tokenBonusTableName = 'token_bonus';
module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable(tokenBonusTableName, tokenBonus);
    await queryInterface.addIndex(
      tokenBonusTableName,
      {
        unique: true,
        fields: [
          {
            attribute: 'address'
          },
          {
            attribute: 'symbol'
          },
          {
            attribute: 'chain_id'
          }
        ],
        name: 'address_symbol_chain_id'
      }
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tokenBonusTableName);
  }
};
