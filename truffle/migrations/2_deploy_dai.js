const DAI = artifacts.require("DAI");
const DAIStake = artifacts.require("DAIStake");

module.exports = async function (deployer) {
  // Déploiement du contract DAI
  await deployer.deploy(DAI);
  // Recup l'instance du contract DAI déployé
  const dai = await DAI.deployed();
  // Déploiement du contract DAIStake en passant l'adresse du contract DAI en argument du constructor
	await deployer.deploy(DAIStake, dai.address);
  // On recup l'instance du contract DAIStake déployé
	const daiStake = await DAIStake.deployed();
};
