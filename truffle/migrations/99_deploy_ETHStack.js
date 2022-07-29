const ETHStack = artifacts.require("ETHStack");

module.exports = async (deployer) => {
  await deployer.deploy(ETHStack);
};

