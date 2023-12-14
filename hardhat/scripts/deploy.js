// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const fmlyStake = await hre.ethers.deployContract("StakeFMLY");
  await fmlyStake.waitForDeployment();
  const fmlyStakeAddr = await fmlyStake.getAddress();
  const tokenFmlyAddr = await fmlyStake.stakingToken();

  console.log(`Token contract deployed to: ${tokenFmlyAddr}`);
  console.log(`Staking contract deployed to: ${fmlyStakeAddr}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
