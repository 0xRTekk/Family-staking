const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const ETHStack = artifacts.require('ETHStack');

contract('Test Stacking ETH', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

    let ETHStackInstance;

    const stackAmount = new BN(100000000);

    beforeEach(async () => {
        ETHStackInstance = await ETHStack.new();
    });

    it("... should allow to stack ETH", async () => {
        const receipt = await ETHStackInstance.stack({from: _user1, value: stackAmount});
        expectEvent(receipt, "StackRegistered", {
            userAddress: _user1,
            amount: stackAmount
        });
    });

    it("... should allow to unstack ETH", async () => {
        // Adding ETH to the user's stash
        await ETHStackInstance.stack({from: _user1, value: stackAmount});
        // console.log("La suite 1");
        const userETHAmount = await web3.eth.getBalance(_user1);
        // Unstacking ETH from the user's stash
        const receipt = await ETHStackInstance.unstack(stackAmount, {from: _user1});
        // Should emit an event
        expectEvent(receipt, "UnstackRegistered", {
            userAddress: _user1,
            amount: stackAmount
        });
        console.log(3);
        // should receive ETH
        const newUserETHAmount = await web3.eth.getBalance(_user1);
        console.log(parseInt(userETHAmount, 16));
        console.log(parseInt(newUserETHAmount, 16)); 
        expect(parseInt(newUserETHAmount, 16)).to.be.greaterThanOrEqual(parseInt(userETHAmount, 16), "User did not receive funds");
    });

    it("... should forbid to unstack more than the user balance", async () => {
        expectRevert(await ETHStackInstance.unstack(stackAmount, {from: _user1}), "Cannot withdraw more than the user's current balance");
    });

    it("... should track user total stack amount", async () => {
        let totalAmount = stackAmount;
        await ETHStackInstance.stack({from: _user1, value: stackAmount});
        expect(await ETHStackInstance.getBalance.call(_user1)).to.be.bignumber.equal(totalAmount, "Incorrect balance");
        totalAmount += stackAmount;
        await ETHStackInstance.stack({from: _user1, value: stackAmount});
        expect(await ETHStackInstance.getBalance.call(_user1)).to.be.bignumber.equal(totalAmount, "Incorrect balance");
        totalAmount -= stackAmount;
        await ETHStackInstance.unstack(stackAmount, {from: _user1});
        expect(await ETHStackInstance.getBalance.call(_user1)).to.be.bignumber.equal(totalAmount, "Incorrect balance");
    });

});