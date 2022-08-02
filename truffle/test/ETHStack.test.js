const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { inLogs } = require('@openzeppelin/test-helpers/src/expectEvent');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const ETHStake = artifacts.require('ETHStake');

contract('Test Staking ETH', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

    let ETHStakeInstance;
    let oneEth = web3.utils.toWei(new BN(1), "ether");
    let twoEth = web3.utils.toWei(new BN(2), "ether");

    describe('Tests: Eth staking and withdrawal', function () {
        before(async () => {
            ETHStakeInstance = await ETHStake.new();
        })

        it("... should hold 0 ETH at start", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should allow to stake ETH", async () => {
            const receipt = await ETHStakeInstance.deposit({from: _user1, value: oneEth});
            expectEvent(receipt, "DepositRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });

        it("... should now hold 1 ETH", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStakeInstance.address);
            assert.equal(contractBalance, oneEth);
        });

        it("... should hold 1 ETH in the user1 account", async () => {
            expect(await ETHStakeInstance.getBalance.call(_user1)).to.be.bignumber.equal(oneEth, "Incorrect balance");
        });

        it("... should forbid user to withdraw more than their balance", async () => {
            await expectRevert(ETHStakeInstance.withdraw(twoEth, {from: _user1}), 'Cannot withdraw more than your current balance');
        });

        it("... should allow to withdraw ETH", async () => {
            const receipt = await ETHStakeInstance.withdraw(oneEth, {from: _user1});
            // Should emit an event
            expectEvent(receipt, "WithdrawRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });

        it("... should now hold 0 ETH again", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should hold 0 ETH in the user1 account", async () => {
            expect(await ETHStakeInstance.getBalance.call(_user1)).to.be.bignumber.equal(new BN(0), "Incorrect balance");
        });

        it("... should forbid user to withdrax when their account is empty", async () => {
            await expectRevert(ETHStakeInstance.withdraw(oneEth, {from: _user1}), 'Account is empty');
        });
    });

    describe('Tests: Misc/To do', function () {
        beforeEach(async () => {
            ETHStakeInstance = await ETHStake.new();
        });

        it("... should add value to an account even in case of a send", async () => {
            const receipt = await ETHStakeInstance.send(oneEth, {from: _user1});
            expectEvent(receipt, "DepositRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });
    });
});