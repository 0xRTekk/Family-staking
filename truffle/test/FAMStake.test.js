

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect, assert } = require('chai');


contract('TEST Staking FAM', ([owner, client]) => {

    const FAMStake = artifacts.require('FAMStake');
    const FAM = artifacts.require("FAM");

    let FAMStakeInstance, FAMInstance

    describe('Tests : FAM staking and withdrawal', () => {

        before(async () => {

            FAMInstance = await FAM.new();
            FAMStakeInstance = await FAMStake.new(FAMInstance.address);
            await FAMInstance.authorize(FAMStakeInstance.address);
            console.log(FAMInstance.address);
            console.log(1);
        })
        it("should get balance of Fam ", async () => {
            await FAMStakeInstance.getBalance(client);
        })

        it("should get balance equal 0", async () => {
            const userBalance = await FAMStakeInstance.getBalance(client);
            assert.equal(userBalance, 0);
        })

        it("should allow deposit of FAM", async () => {
            await FAMInstance.faucet(client, 100);
            await FAMInstance.allowance(owner, client);
            await FAMInstance.approve(client, 50);
            const deposit = await FAMStakeInstance.deposit({ from: client, value: new { BN: 25 } });
            expectEvent(deposit, "StackRegistered", {
                _amount: BN(50)
            });

        });

        it("should now hold 50 FAM", async () => {
            const deposit = await FAMStakeInstance.deposit({ from: client, value: new { BN: 50 } });
            expectRevert(deposit, "StackRegistered", {
                _amount: 50
            });
            let contractBalance = await FAMStakeInstance.balance({ client });
            assert.equal(contractBalance, BN(50));
        });

        it("should hold 50 FAM in the user1 account", async () => {
            expect(await FAMStakeInstance.getBalance.call(client)).to.be.bignumber.equal(new { BN: 50 }, "Incorrect balance");

        });

        it("should allow to withdraw FAM", async () => {
            const withdraw = await FAMStakeInstance.withdraw({ from: client, value: new { BN: 25 } });
            expectRevert(withdraw, "WithdrawRegistered", {
                _amount: 25
            });
        })

        it("should not allow to withdraw FAM", async () => {
            await expectRevert(FAMStakeInstance.withdraw(new { BN: 100 }, { from: client }), 'Cannot withdraw more than your current balance');
        })
    });
});
