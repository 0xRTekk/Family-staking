const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const FamStack = artifacts.require('FamStack');

contract('TEST Staking FAM', accounts => {
    const _owner = accounts[0];
    const _user1 = accounts[1];

   describe('Tests : FAM stacking and withdrawal', () => {

      before (async () => {
        FamStackInstance =await FamStack.new();
      })

      it("should have a balance of 0 FAM" , async () => {
            let contractBalance = await balance(FamStackInstance.address);
            assert.equal(contractBalance, 0);
      });

      it("should allow deposit of FAM", async ()=> {
            const depot = await FamStackInstance.deposit({from : _user1, value: new {BN:50}});
            expectRevert(depot, "StackRegistered", {
                address: _user1,
                _amount: 50
            });
           // expectEvent
        });

      it ("should now hold 50 FAM", async () => {
            let contractBalance = await balance(FamStackInstance.address);
      });
      
      it("should hold 50 FAM in the user1 account", async () => {
            expect(await FamStackInstance.getBalance.call(_user1)).to.be.bignumber.equal(new {BN:50}, "Incorrect balance");

       });
   });
});

