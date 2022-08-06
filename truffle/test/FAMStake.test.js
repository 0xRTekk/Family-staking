

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect, assert } = require('chai');


contract('TEST Staking FAM', ([owner, client]) => {

    const FAMStake = artifacts.require('FAMStake');
    const FAM = artifacts.require("FAM");

    let FamStackInstance, FamInstance

    describe('Tests : FAM staking and withdrawal', () => {

        before(async () => {

            FamInstance = await FAM.new();
            FamStackInstance = await FAMStake.new(FamInstance.address);
            console.log(FamInstance.address);
            console.log(1);
        })
        it("should get balance of Fam ", async () => {
            await FamStackInstance.balance(client);
        })

        it("should get balance equal 0", async () => {
            const userBalance = await FamStackInstance.balance(client);
            assert.equal(userBalance, 0);
        })

        it("should allow deposit of FAM", async () => {
            await FamInstance.faucet(client, 100);
            await FamInstance.allowance(owner, client);
            await FamInstance.approve(client, 50);
            const deposit = await FamStackInstance.deposit({ from: client, value: new { BN: 25 } });
            expectEvent(deposit, "StackRegistered", {
                _amount: BN(50)
            });

        });

        it("should now hold 50 FAM", async () => {
            const deposit = await FamStackInstance.deposit({ from: client, value: new { BN: 50 } });
            expectRevert(deposit, "StackRegistered", {
                _amount: 50
            });
            let contractBalance = await FamStackInstance.balance({ client });
            assert.equal(contractBalance, BN(50));
        });

        it("should hold 50 FAM in the user1 account", async () => {
            expect(await FamStackInstance.getBalance.call(client)).to.be.bignumber.equal(new { BN: 50 }, "Incorrect balance");

        });

        it("should allow to withdraw FAM", async () => {
            const withdraw = await FamStackInstance.withdraw({ from: client, value: new { BN: 25 } });
            expectRevert(withdraw, "WithdrawRegistered", {
                _amount: 25
            });
        })

        it("should not allow to withdraw FAM", async () => {
            await expectRevert(FamStackInstance.withdraw(new { BN: 100 }, { from: client }), 'Cannot withdraw more than your current balance');
        })
    });
});
