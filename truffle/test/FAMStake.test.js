

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect, assert } = require('chai');
const { advanceTimeAndBlock } = require('./helpers/timeTravelHelper');


contract('TEST Staking FAM', ([owner, client]) => {

    const FAMStake = artifacts.require('FAMStake');
    const FAM = artifacts.require("FAM");

    let FAMStakeInstance, FAMInstance

    let DAIStakeInstance;
    let oneFAM = web3.utils.toWei(new BN(1), "ether");
    let twoFAM = web3.utils.toWei(new BN(2), "ether");
    let sixFAM = web3.utils.toWei(new BN(6), "ether");

    describe('Tests : FAM staking and withdrawal', () => {

        before(async () => {

            FAMInstance = await FAM.new();
            FAMStakeInstance = await FAMStake.new(FAMInstance.address);
            await FAMInstance.authorize(FAMStakeInstance.address);
            console.log(FAMInstance.address);
            console.log(1);
        })

        it("should get balance of FAM ", async () => {
            await FAMStakeInstance.getBalance(client);
        });

        it("should get balance equal 0", async () => {
            const userBalance = await FAMStakeInstance.getBalance(client);
            assert.equal(userBalance, 0);
        });

        it("... should allow to deposit FAM", async () => {
            await FAMInstance.faucet(client, oneFAM);
            await FAMInstance.approve(FAMStakeInstance.address, oneFAM, {from: client});
            const receipt = await FAMStakeInstance.deposit(oneFAM, {from:client});
            expectEvent(receipt, "DepositRegistered", {
                userAddress: client,
                amount: oneFAM
            });
        });

        
        it("... should now hold 1 FAM", async () => {
            let contractBalance = await FAMStakeInstance.getBalance(client);
            expect(contractBalance).to.be.bignumber.equal(oneFAM, "Incorrect balance");
        });

        it("... should now hold 1 FAM", async () => {
            let contractBalance = await FAMStakeInstance.getTotalStaked();
            expect(contractBalance).to.be.bignumber.equal(oneFAM, "Incorrect balance");
        });


        it("... should hold 1 FAM in the user1 account", async () => {
            const stakedBalance = await FAMStakeInstance.getBalance(client); 
            expect(stakedBalance).to.be.bignumber.equal(oneFAM, "Incorrect balance");
        });

        it("... should time lock user's deposits for 2 days", async () => {
            await expectRevert(FAMStakeInstance.withdraw.call(oneFAM, {from: client}), "Deposit is time locked");
        });

        it("... should forbid user to withdraw more than their balance", async () => {
            // Forwarding time to 3 days later
            await advanceTimeAndBlock(259200);
            await expectRevert(FAMStakeInstance.withdraw(twoFAM, {from: client}), 'Cannot withdraw more than your current balance');
        });

        it("... should allow to withdraw FAM", async () => {
            const receipt = await FAMStakeInstance.withdraw(oneFAM, {from: client});
            // Should emit an event
            expectEvent(receipt, "WithdrawRegistered", {
                userAddress: client,
                amount: oneFAM
            });
        });
        
        it("... should have emptied the pending rewards of the user", async() => {
            expect(await FAMStakeInstance.getPendingRewards.call(client, {from: client})).to.be.bignumber.equal(new BN(0), "PendingRewards still positive after withdraw");
        });

        it("... should now hold 0 FAM again", async () => {
            let contractBalance =  await FAMStakeInstance.getBalance(client);
            assert.equal(contractBalance, 0);
        });

        it("... should hold 0 FAM in the user1 account", async () => {
            const stakedBalance = await FAMStakeInstance.getBalance(client); 
            expect(stakedBalance).to.be.bignumber.equal(new BN(0), "Incorrect balance");
        });
        
        it("... should forbid user to withdraw when their account is empty", async () => {
            await expectRevert(FAMStakeInstance.withdraw(oneFAM, {from: client}), 'Account is empty');
        });
    });

    describe('Tests: Misc/To do', function () {
        beforeEach(async () => {
            FAMInstance = await FAM.new();
            FAMStakeInstance = await FAMStake.new(FAMInstance.address);
            await FAMInstance.authorize(FAMStakeInstance.address);
        });

        // it("... should add value to an account even in case of a send", async () => {
        //     const receipt = await  FAMStakeInstance.send(BN(50), {from: client});
        //     expectEvent(receipt, "DepositRegistered", {
        //         userAddress: client,
        //         amount: BN(50)
        //     });
        // });

        
        it("... should calculate intermediate pendingRewards balance between two deposit", async () => {
            // Get new FAM tokens
            await FAMInstance.faucet(client, sixFAM);
            // Add approval
            await FAMInstance.approve(FAMStakeInstance.address, sixFAM, {from:client});
            // Deposit a new amount
            await FAMStakeInstance.deposit(oneFAM, {from:client});
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await FAMStakeInstance.deposit(oneFAM, {from: client});
            // PendingRewards should have been calculated
            const pendingRewards = await FAMStakeInstance.getPendingRewards(client, {from: client});
            expect(pendingRewards).to.be.bignumber.greaterThan(new BN(0), "PendingRewards not calculated");
            // Forwarding time to 10 days later
            await advanceTimeAndBlock(864000);
            // Deposit a new amount
            await FAMStakeInstance.deposit(oneFAM, {from: client});
            // PendingRewards should have been updated
            expect(await FAMStakeInstance.getPendingRewards.call(client, {from: client})).to.be.bignumber.greaterThan(pendingRewards, "PendingRewards not updated")
        });

      

        
    });
});
