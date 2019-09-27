/**
 * @file results model
 * @author atom-yang
 */

module.exports = app => {
  const {
    STRING,
    BIGINT,
    DATE,
    NOW
  } = app.Sequelize;

  const Bonus = app.model.define('tokenBonus', {
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
  }, {
    tableName: 'token_bonus',
    indexes: [
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
    ]
  });

  Bonus.addApplyInfo = async function(address, symbol, amount, txId, chainId, memo = '') {
    const result = await this.create({
      address,
      symbol,
      amount,
      txId,
      chainId,
      memo
    });
    return result;
  };

  Bonus.hasAppliedToken = async function(address, symbol) {
    const result = await this.findAll({
      attributes: [ 'txId', 'chainId' ],
      where: {
        address,
        symbol
      }
    });
    return result;
  };

  return Bonus;
};
