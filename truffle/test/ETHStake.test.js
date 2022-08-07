const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { inLogs } = require('@openzeppelin/test-helpers/src/expectEvent');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { latestBlock } = require('@openzeppelin/test-helpers/src/time');
const { expect, assert } = require('chai');
const ETHStake = artifacts.require('ETHStake');
const FAM = artifacts.require('FAM');
const DataFeedETHUSD = artifacts.require('DataFeedETHUSD');
const { advanceTimeAndBlock } = require('./helpers/timeTravelHelper');

contract('Test Staking ETH', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

    let ETHStakeInstance;
    let oneEth = web3.utils.toWei(new BN(1), "ether");
    let twoEth = web3.utils.toWei(new BN(2), "ether");

    describe('Tests: Eth staking and withdrawal', function () {
        before(async () => {
            feedETHUSDInstance = await DataFeedETHUSD.new();
            FAMInstance = await FAM.new();
            ETHStakeInstance = await ETHStake.new(FAMInstance.address, feedETHUSDInstance.address);
            await FAMInstance.authorize(ETHStakeInstance.address);
        })

        it("... should hold 0 ETH at start", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should forbid to deposit less than 0,01ETH (10000000000000000 WEI)", async () => {
            await expectRevert(ETHStakeInstance.deposit({from: _user1, value: 100000000000}), "Minimum deposit is 0.01 ETH");
        });

        it("... should allow to deposit ETH", async () => {
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

        it("... should time lock user's deposits for 2 days", async () => {
            await expectRevert(ETHStakeInstance.withdraw.call(oneEth, {from: _user1}), "Deposit is time locked");
        });

        it("... should forbid user to withdraw more than their balance", async () => {
            // Forwarding time to 3 days later
            await advanceTimeAndBlock(259200);
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
        
        it("... should have emptied the pending rewards of the user", async() => {
            expect(await ETHStakeInstance.getPendingRewards.call(_user1, {from: _user1})).to.be.bignumber.equal(new BN(0), "PendingRewards still positive after withdraw");
        });

        it("... should now hold 0 ETH again", async () => {
            let contractBalance = await web3.eth.getBalance(ETHStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should hold 0 ETH in the user1 account", async () => {
            expect(await ETHStakeInstance.getBalance.call(_user1)).to.be.bignumber.equal(new BN(0), "Incorrect balance");
        });

        it("... should forbid user to withdraw when their account is empty", async () => {
            await expectRevert(ETHStakeInstance.withdraw(oneEth, {from: _user1}), 'Account is empty');
        });
    });

    describe('Tests: Misc/To do', function () {
        beforeEach(async () => {
            feedETHUSDInstance = await DataFeedETHUSD.new();
            FAMInstance = await FAM.new();
            ETHStakeInstance = await ETHStake.new(FAMInstance.address, feedETHUSDInstance.address);
            await FAMInstance.authorize(ETHStakeInstance.address);
        });

        it("... should add value to an account even in case of a send", async () => {
            const receipt = await ETHStakeInstance.send(oneEth, {from: _user1});
            expectEvent(receipt, "DepositRegistered", {
                userAddress: _user1,
                amount: oneEth
            });
        });

        
        it("... should calculate intermediate pendingRewards balance between two deposit", async () => {
            // Deposit a new amount
            await ETHStakeInstance.deposit({from: _user1, value: oneEth});
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await ETHStakeInstance.deposit({from: _user1, value: oneEth});
            // PendingRewards should have been calculated
            const pendingRewards = await ETHStakeInstance.getPendingRewards(_user1, {from: _user1});
            expect(pendingRewards).to.be.bignumber.greaterThan(new BN(0), "PendingRewards not calculated");
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await ETHStakeInstance.deposit({from: _user1, value: oneEth});
            // PendingRewards should have been updated
            expect(await ETHStakeInstance.getPendingRewards.call(_user1, {from: _user1})).to.be.bignumber.greaterThan(pendingRewards, "PendingRewards not updated")
        });
    });
});