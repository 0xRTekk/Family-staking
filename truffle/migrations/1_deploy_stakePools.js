const FAM = artifacts.require("FAM");
const DAI = artifacts.require("DAI");
const FAMStake = artifacts.require("FAMStake");
const ETHStake = artifacts.require("ETHStake");
const DAIStake = artifacts.require("DAIStake");
const DataFeedETHUSD = artifacts.require('DataFeedETHUSD');
const DataFeedDAIUSD = artifacts.require('DataFeedDAIUSD');

module.exports =  async function (deployer, _network) {
	// Deploying the Datafeeds contract
	await deployer.deploy(DataFeedETHUSD);
	const ETHUSDFeed = await DataFeedETHUSD.deployed();
	await deployer.deploy(DataFeedDAIUSD);
	const DAIUSDFeed = await DataFeedDAIUSD.deployed();

    await deployer.deploy(FAM);
	const FAMToken = await FAM.deployed();
	// Deploying the FAM Staking contract
	await deployer.deploy(FAMStake, FAMToken.address);
	const FAMStakingContract = await FAMStake.deployed();
	// Deploying the ETH Staking contract
	await deployer.deploy(ETHStake, FAMToken.address, ETHUSDFeed.address);
	const ETHStakingContract = await ETHStake.deployed();
	// Deploying the DAI token contract
	await deployer.deploy(DAI);
	const DAIToken = await DAI.deployed();
	// Deploying the DAI Staking contract
	await deployer.deploy(DAIStake, DAIToken.address, FAMToken.address);
	const DAIStakingContract = await DAIStake.deployed();

	// Authorizing the staking contract to mint
	await FAMToken.authorize(FAMStakingContract.address);
	await FAMToken.authorize(ETHStakingContract.address);
	await FAMToken.authorize(DAIStakingContract.address);
} 