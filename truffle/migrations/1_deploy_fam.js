const Fam = artifacts.require("Fam");

module.exports = async function (deployer, _network) {
  await deployer.deploy(Fam);
};