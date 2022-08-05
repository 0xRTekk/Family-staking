const Fam = artifacts.require("FAM");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Fam);
};