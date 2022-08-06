const Fam = artifacts.require("Fam");
const FamStack = artifacts.require("FamStack");

module.exports =  async function (deployer, _network) {
    await deployer.deploy(Fam);
	const token = await Fam.deployed();
	await deployer.deploy(FamStack, token.address);
	const famStack = await FamStack.deployed();
	await token.faucet(famStack.address, 100);

	const balance0 = await token.balanceOf(FamStack.address);
	console.log(balance0.toString());
    console.log(token.address);
	
	
}