const Fam = artifacts.require("Fam");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const {expect, assert} = require('chai')

Contract('TEST : FAM Token Smart contract',([owner, client]) => {
   
    let FamERC20Instance;
    describe("Testing Faucet", function (){
        before (async function (){
            FamERC20Instance = await Fam.new({ from : owner});
        });

        it ("it should give amount of Fam ", async ()=> {
            const amount = 2;
            await FamERC20Instance.faucet(client , amount , {from:owner});
            const credit = await balanceOf(client, {from:client})
            expectRevert((credit + amount) , "The account was not credited")
        })
    })
   

})