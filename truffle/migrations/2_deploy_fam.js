const Fam = artifacts.require("Fam");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Fam);
};
