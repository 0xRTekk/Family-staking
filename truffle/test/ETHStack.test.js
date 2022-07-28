const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { inLogs } = require('@openzeppelin/test-helpers/src/expectEvent');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const ETHStack = artifacts.require('ETHStack');

contract('Test Stacking ETH', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

    let ETHStackInstance;
    let oneEth = web3.utils.toWei(new BN(1), "ether");

    describe('Tests: Eth stacking and withdrawal', function () {
        before(async () => {
            ETHStackInstance = await ETHStack.new();
        })

        it("... should hold 0 ETH at start", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStackInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should allow to stack ETH", async () => {
            const receipt = await ETHStackInstance.stack({from: _user1, value: oneEth});
            expectEvent(receipt, "StackRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });

        it("... should now hold 1 ETH", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStackInstance.address);
            console.log(contractBalance);
            assert.equal(contractBalance, oneEth);
        });

        it("... should allow to unstack ETH", async () => {
            const receipt = await ETHStackInstance.unstack(oneEth, {from: _user1});
            // Should emit an event
            expectEvent(receipt, "UnstackRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });

        it("... should now hold 0 ETH again", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStackInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should forbid user to unstack more than their balance", async () => {
            expectRevert(await ETHStackInstance.unstack(oneEth, {from: _user1}), "Cannot withdraw more than your current balance");
        });
    });

    describe('Tests: Misc/To do', function () {

        beforeEach(async () => {
            ETHStackInstance = await ETHStack.new();
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
});