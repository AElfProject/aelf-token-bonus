/**
 * @file app
 * @author atom-yang
 */
const AElf = require('aelf-sdk');

module.exports = async app => {
  const {
    privateKey,
    nodes
  } = app.config.aelf;
  const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  const nodesValue = Object.values(nodes);
  for (const node of nodesValue) {
    const aelf = new AElf(new AElf.providers.HttpProvider(node.endpoint));
    node.instance = aelf;
    const {
      ChainId,
      GenesisContractAddress
      // eslint-disable-next-line no-await-in-loop
    } = await aelf.chain.getChainStatus();
    node.chainId = ChainId;
    // eslint-disable-next-line no-await-in-loop
    const genContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
    // eslint-disable-next-line no-await-in-loop,max-len
    const tokenContractAddress = await genContract.GetContractAddressByName.call(AElf.utils.sha256('AElf.ContractNames.Token'));
    // eslint-disable-next-line no-await-in-loop
    const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
    const {
      symbol
      // eslint-disable-next-line no-await-in-loop
    } = await tokenContract.GetNativeTokenInfo.call();
    node.nativeTokenSymbol = symbol;
    node.tokenContract = tokenContract;
  }
};
