const FamStack = artifacts.require('FamStack');

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');


contract('TEST Staking FAM', ([owner, client]) => {
    

   describe('Tests : FAM stacking and withdrawal', () => {

      before (async () => {
        FamStackInstance = await FamStack.new({ from : owner});
      })

      it("should have a balance of 0 FAM" , async () => {
            let contractBalance = await balanceOf(FamStackInstance.address);
            assert.equal(contractBalance, 0);
      });

      it("should allow deposit of FAM", async ()=> {
            const deposit = await FamStackInstance.deposit({from: client, value: new {BN:50}});
            expectRevert(deposit, "StackRegistered", {
                _amount: 50
            });
            
      });

      it ("should now hold 50 FAM", async () => {
            let contractBalance = await balance(FamStackInstance.address);
            assert.equal(contractBalance, BN(50));
      });
      
      it("should hold 50 FAM in the user1 account", async () => {
            expect(await FamStackInstance.getBalance.call(client)).to.be.bignumber.equal(new {BN:50}, "Incorrect balance");

       });

       it("should allow to withdraw FAM", async () => {
            const withdraw = await FamStackInstance.withdraw({from: client, value:new {BN: 25}});
            expectRevert(withdraw, "WithdrawRegistered", {
                  _amount: 25
              });
       })

       it("should not allow to withdraw FAM" , async () => {
            await expectRevert(FamStackInstance.withdraw(new {BN: 100}, {from: client}), 'Cannot withdraw more than your current balance');
       })
   });
});

