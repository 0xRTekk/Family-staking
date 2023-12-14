const { expect } = require("chai");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Staking contract", function () {
  async function deployStakeFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy FMLY token
    const fmlyToken = await ethers.deployContract("FMLYToken");
    await fmlyToken.waitForDeployment();
    const FMLYTokenAddress = await fmlyToken.getAddress();

    // Deploy staking contract with FMLY token address
    const stakeFmly = await ethers.deployContract("StakeFMLY", [
      FMLYTokenAddress,
    ]);
    await stakeFmly.waitForDeployment();

    console.log("FMLYToken deployed to:", fmlyToken.address);


    return { stakeFmly, fmlyToken, FMLYTokenAddress, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should use FMLY as staking & rewards token", async function () {
      const { stakeFmly, FMLYTokenAddress } = await loadFixture(deployStakeFixture);

      expect(await stakeFmly.stakingToken()).to.equal(FMLYTokenAddress);
    });

    // it("Should assign the total supply of tokens to the owner", async function () {
    //   const { stakeFmly, owner } = await loadFixture(deployStakeFixture);
    //   const ownerBalance = await stakeFmly.balanceOf(owner.address);
    //   expect(await stakeFmly.totalSupply()).to.equal(ownerBalance);
    // });
  });

  // describe("Transactions", function () {
  //   it("Should transfer tokens between accounts", async function () {
  //     const { stakeFmly, owner, addr1, addr2 } = await loadFixture(
  //       deployStakeFixture
  //     );
  //     // Transfer 50 tokens from owner to addr1
  //     await expect(
  //       stakeFmly.transfer(addr1.address, 50)
  //     ).to.changeTokenBalances(stakeFmly, [owner, addr1], [-50, 50]);

  //     // Transfer 50 tokens from addr1 to addr2
  //     // We use .connect(signer) to send a transaction from another account
  //     await expect(
  //       stakeFmly.connect(addr1).transfer(addr2.address, 50)
  //     ).to.changeTokenBalances(stakeFmly, [addr1, addr2], [-50, 50]);
  //   });

  //   it("Should emit Transfer events", async function () {
  //     const { stakeFmly, owner, addr1, addr2 } = await loadFixture(
  //       deployStakeFixture
  //     );

  //     // Transfer 50 tokens from owner to addr1
  //     await expect(stakeFmly.transfer(addr1.address, 50))
  //       .to.emit(stakeFmly, "Transfer")
  //       .withArgs(owner.address, addr1.address, 50);

  //     // Transfer 50 tokens from addr1 to addr2
  //     // We use .connect(signer) to send a transaction from another account
  //     await expect(stakeFmly.connect(addr1).transfer(addr2.address, 50))
  //       .to.emit(stakeFmly, "Transfer")
  //       .withArgs(addr1.address, addr2.address, 50);
  //   });

  //   it("Should fail if sender doesn't have enough tokens", async function () {
  //     const { stakeFmly, owner, addr1 } = await loadFixture(
  //       deployStakeFixture
  //     );
  //     const initialOwnerBalance = await stakeFmly.balanceOf(owner.address);

  //     // Try to send 1 token from addr1 (0 tokens) to owner.
  //     // `require` will evaluate false and revert the transaction.
  //     await expect(
  //       stakeFmly.connect(addr1).transfer(owner.address, 1)
  //     ).to.be.revertedWithCustomError(stakeFmly, "ERC20InsufficientBalance");

  //     // Owner balance shouldn't have changed.
  //     expect(await stakeFmly.balanceOf(owner.address)).to.equal(
  //       initialOwnerBalance
  //     );
  //   });
  // });
});