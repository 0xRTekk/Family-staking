const FAM = artifacts.require("FAM");
const FAMStake = artifacts.require("FAMStake");
const ETHStake = artifacts.require("ETHStake");

module.exports =  async function (deployer, _network) {
    await deployer.deploy(FAM);
	const FAMToken = await FAM.deployed();
	// Deploying the FAM Staking contract
	await deployer.deploy(FAMStake, FAMToken.address);
	const FAMStakingContract = await FAMStake.deployed();
	// Deploying the ETH Staking contract
	await deployer.deploy(ETHStake, FAMToken.address);
	const ETHStakingContract = await ETHStake.deployed();
	// Deploying the DAI and DAI Staking Contract

	// Authorizing the staking contract to mint
	await FAMToken.authorize(FAMStakingContract.address);
	await FAMToken.authorize(ETHStakingContract.address);


	// Misc
	// await FAMToken.faucet(FAMStakingContract.address, 100);

	// const balance0 = await FAMToken.balanceOf(FAMStakingContract.address);
	// console.log(balance0.toString());
    // console.log(FAMToken.address);

} 