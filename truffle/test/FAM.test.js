const FAM = artifacts.require("FAM");
const { BN } = require('@openzeppelin/test-helpers');

const {expect} = require('chai')

contract('TEST : FAM Token Smart contract',([owner, client]) => {
   
    let FamERC20Instance;
    describe("Testing Faucet", function (){
        before (async function (){
            FamERC20Instance = await FAM.new({ from : owner});
        });

        it ("it should give amount of Fam ", async ()=> {
            const amount = 2;
            await FamERC20Instance.faucet(client , amount , {from:owner});
            const credit = await FamERC20Instance.balanceOf(client, {from:client})
            expect(credit).to.be.bignumber.equal(new BN(amount));
        })
    })
   

})