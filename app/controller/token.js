/**
 * @file init csrf token
 * @author atom-yang
 */
const BigNumber = require('bignumber.js');
const Controller = require('../core/baseController');

class TokenController extends Controller {

  async getChains() {
    const { app } = this;

    const result = Object.entries(app.config.aelf.nodes).map(([ name, value ]) => {
      return {
        name,
        chainId: value.chainId,
        symbol: value.nativeTokenSymbol
      };
    });
    this.sendBody(result);
  }

  async apply() {
    const { ctx, app } = this;
    const rule = {
      address: {
        type: 'string',
        required: 'true'
      },
      symbol: {
        type: 'string',
        required: 'true'
      },
      memo: {
        type: 'string',
        required: false
      }
    };
    try {
      this.validate(rule);
      const {
        address,
        symbol,
        memo
      } = ctx.request.body;
      const {
        nodes,
        amount
      } = app.config.aelf;
      const hasAppliedResult = await ctx.model.Token.hasAppliedToken(address, symbol);
      if (hasAppliedResult.length > 0) {
        this.error({
          code: 300,
          message: 'You have applied this token'
        });
        this.sendBody(hasAppliedResult);
      } else {
        const results = [];
        for (const [ , value ] of Object.entries(nodes)) {
          const {
            tokenContract,
            chainId
          } = value;
          const {
            decimals
            // eslint-disable-next-line no-await-in-loop
          } = await tokenContract.GetTokenInfo({
            symbol
          });
          const coef = new BigNumber(`1e${decimals}`);
          // eslint-disable-next-line no-await-in-loop
          const tx = await tokenContract.Transfer({
            to: address,
            symbol,
            amount: coef.times(new BigNumber(amount)).toString(),
            memo
          });
          const {
            TransactionId
          } = tx;
          // eslint-disable-next-line no-await-in-loop
          const result = await ctx.model.Token.addApplyInfo(
            address,
            symbol,
            amount,
            TransactionId,
            chainId,
            memo
          );
          results.push({
            txId: result.txId,
            chainId: result.chainId,
            symbol: result.symbol
          });
        }
        this.sendBody(results);
      }
    } catch (e) {
      e.code = e.code ? e.code : 400;
      this.error(e);
      this.sendBody();
    }

  }
}

module.exports = TokenController;
