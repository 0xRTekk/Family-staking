const FAM = artifacts.require("FAM");
const FAMStake = artifacts.require("FAMStake");

module.exports =  async function (deployer, _network) {
    await deployer.deploy(FAM);
	const token = await FAM.deployed();
	await deployer.deploy(FAMStake, token.address);
	const FAMStake = await FAMStake.deployed();
	await token.faucet(FAMStake.address, 100);

	const balance0 = await token.balanceOf(FAMStake.address);
	console.log(balance0.toString());
    console.log(token.address);


} 