const Fam = artifacts.require("FAM");
const FamStack = artifacts.require("FamStack");

module.exports =  async function (deployer, _network) {
    await deployer.deploy(Fam);
	const token = await Fam.deployed();
	await deployer.deploy(FamStack, dai.address);
	const FamStack = await FamStack.deployed();
	await token.faucet(FamStack.address, 100);
	
 
	const balance0 = await token.balanceOf(FamStack.address);
	
 
	console.log(balance0.toString());
	
};
