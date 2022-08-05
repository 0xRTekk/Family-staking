const ETHStake = artifacts.require("ETHStake");

module.exports = async (deployer) => {
  await deployer.deploy(ETHStake);
};

