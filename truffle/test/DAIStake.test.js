const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { inLogs } = require('@openzeppelin/test-helpers/src/expectEvent');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { latestBlock } = require('@openzeppelin/test-helpers/src/time');
const { expect, assert } = require('chai');
const DAI = artifacts.require('DAI');
const DAIStake = artifacts.require('DAIStake');
const FAM = artifacts.require('FAM');
const { advanceTimeAndBlock } = require('./helpers/timeTravelHelper');

contract('Test Staking DAI', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

    let DAIStakeInstance;
    let oneDai = web3.utils.toWei(new BN(1), "ether");
    let twoDai = web3.utils.toWei(new BN(2), "ether");
    let sixDai = web3.utils.toWei(new BN(6), "ether");

    describe('Tests: Dai staking and withdrawal', function () {
        before(async () => {
            FAMInstance = await FAM.new();
            DAIInstance = await DAI.new();
            DAIStakeInstance = await DAIStake.new(DAIInstance.address, FAMInstance.address);
            await FAMInstance.authorize(DAIStakeInstance.address);
        })

        it("... should hold 0 DAI at start", async () => {
            let contractBalance = await web3.eth.getBalance(DAIStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        // it("... should forbid to deposit less than 0,01ETH (10000000000000000 WEI)", async () => {
        //     await expectRevert(ETHStakeInstance.deposit({from: _user1, value: 100000000000}), "Minimum deposit is 0.01 ETH");
        // });

        it("... should allow to deposit DAI", async () => {
            await DAIInstance.faucet(_user1, oneDai);
            await DAIInstance.approve(DAIStakeInstance.address, oneDai, {from: _user1});
            const receipt = await DAIStakeInstance.deposit(oneDai, {from: _user1});
            expectEvent(receipt, "DepositRegistered", {
                userAddress: _user1,
                amount: oneDai
            });
        });

        it("... should now hold 1 DAI", async () => {
            let contractBalance = await DAIStakeInstance.getTotalStaked();
            expect(contractBalance).to.be.bignumber.equal(oneDai, "Incorrect balance");
        });

        it("... should hold 1 DAI in the user1 account", async () => {
            const stakedBalance = await DAIStakeInstance.getStakedBalance(_user1); 
            expect(stakedBalance).to.be.bignumber.equal(oneDai, "Incorrect balance");
        });

        it("... should time lock user's deposits for 2 days", async () => {
            await expectRevert(DAIStakeInstance.withdraw.call(oneDai, {from: _user1}), "Deposit is time locked");
        });

        it("... should forbid user to withdraw more than their balance", async () => {
            // Forwarding time to 3 days later
            await advanceTimeAndBlock(259200);
            await expectRevert(DAIStakeInstance.withdraw(twoDai, {from: _user1}), 'Cannot withdraw more than your current balance');
        });

        it("... should allow to withdraw DAI", async () => {
            const receipt = await DAIStakeInstance.withdraw(oneDai, {from: _user1});
            // Should emit an event
            expectEvent(receipt, "WithdrawRegistered", {
                userAddress: _user1,
                amount: oneDai
            });
        });
        
        it("... should have emptied the pending rewards of the user", async() => {
            expect(await DAIStakeInstance.getPendingRewards.call(_user1, {from: _user1})).to.be.bignumber.equal(new BN(0), "PendingRewards still positive after withdraw");
        });

        it("... should now hold 0 DAI again", async () => {
            let contractBalance = await web3.eth.getBalance(DAIStakeInstance.address);
            assert.equal(contractBalance, 0);
        });

        it("... should hold 0 DAI in the user1 account", async () => {
            const stakedBalance = await DAIStakeInstance.getStakedBalance(_user1); 
            expect(stakedBalance).to.be.bignumber.equal(new BN(0), "Incorrect balance");
        });

        it("... should forbid user to withdraw when their account is empty", async () => {
            await expectRevert(DAIStakeInstance.withdraw(oneDai, {from: _user1}), 'Account is empty');
        });
    });

    describe('Tests: Misc/To do', function () {
        beforeEach(async () => {
            FAMInstance = await FAM.new();
            DAIInstance = await DAI.new();
            DAIStakeInstance = await DAIStake.new(DAIInstance.address, FAMInstance.address);
            await FAMInstance.authorize(DAIStakeInstance.address);
        });

        // it("... should add value to an account even in case of a send", async () => {
        //     const receipt = await ETHStakeInstance.send(oneEth, {from: _user1});
        //     expectEvent(receipt, "DepositRegistered", {
        //         userAddress: _user1,
        //         amount: oneEth
        //     });
        // });

        
        it("... should calculate intermediate pendingRewards balance between two deposit", async () => {
            // Get new DAI tokens
            await DAIInstance.faucet(_user1, sixDai);
            // Add approval
            await DAIInstance.approve(DAIStakeInstance.address, sixDai, {from: _user1});
            // Deposit a new amount
            await DAIStakeInstance.deposit(oneDai, {from: _user1});
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await DAIStakeInstance.deposit(oneDai, {from: _user1});
            // PendingRewards should have been calculated
            const pendingRewards = await DAIStakeInstance.getPendingRewards(_user1, {from: _user1});
            expect(pendingRewards).to.be.bignumber.greaterThan(new BN(0), "PendingRewards not calculated");
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await DAIStakeInstance.deposit(oneDai, {from: _user1});
            // PendingRewards should have been updated
            expect(await DAIStakeInstance.getPendingRewards.call(_user1, {from: _user1})).to.be.bignumber.greaterThan(pendingRewards, "PendingRewards not updated")
        });
    });
});