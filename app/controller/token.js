/**
 * @file init csrf token
 * @author atom-yang
 */
const AElf = require('aelf-sdk');
const BigNumber = require('bignumber.js');
const Controller = require('../core/baseController');

class TokenController extends Controller {

  async getChains() {
    const { app } = this;

    const result = Object.entries(app.config.aelf.nodes).map(([ name, value ]) => {
      return {
        name,
        chainId: value.chainId,
        nativeTokenSymbol: value.nativeTokenSymbol,
        primaryTokenSymbol: value.primaryTokenSymbol
      };
    });
    this.sendBody(result);
  }

  async apply() {
    const { ctx, app } = this;
    const rule = {
      address: {
        type: 'string',
        required: true
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
        memo
      } = ctx.request.body;
      const {
        nodes,
        amount
      } = app.config.aelf;
      try {
        AElf.utils.base58.decode(address);
      } catch (e) {
        throw new Error(`${address} is not a valid AElf wallet address`);
      }
      const allChainsSymbols = Object.values(nodes).map(v => v.primaryTokenSymbol);
      const hasAppliedResult = await ctx.model.Token.hasAppliedToken(address, allChainsSymbols);
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
            chainId,
            primaryTokenSymbol
          } = value;
          const {
            decimals
            // eslint-disable-next-line no-await-in-loop
          } = await tokenContract.GetTokenInfo.call({
            symbol: primaryTokenSymbol
          });

          const coef = new BigNumber(`1e${decimals}`);
          // eslint-disable-next-line no-await-in-loop
          const tx = await tokenContract.Transfer({
            to: address,
            symbol: primaryTokenSymbol,
            amount: coef.times(new BigNumber(amount)).toString(),
            memo
          });
          const {
            TransactionId
          } = tx;
          // eslint-disable-next-line no-await-in-loop
          const result = await ctx.model.Token.addApplyInfo(
            address,
            primaryTokenSymbol,
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
