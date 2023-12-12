const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const fmlyToken = await ethers.deployContract("FMLYToken");
    await fmlyToken.waitForDeployment();

    return { fmlyToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { fmlyToken, owner } = await loadFixture(deployTokenFixture);

      expect(await fmlyToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { fmlyToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await fmlyToken.balanceOf(owner.address);
      expect(await fmlyToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { fmlyToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        fmlyToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(fmlyToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        fmlyToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(fmlyToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { fmlyToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(fmlyToken.transfer(addr1.address, 50))
        .to.emit(fmlyToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(fmlyToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(fmlyToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { fmlyToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await fmlyToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        fmlyToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(fmlyToken, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed.
      expect(await fmlyToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});