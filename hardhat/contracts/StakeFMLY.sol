// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FMLYToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract StakeFMLY is Ownable {
    FMLYToken public stakingToken;
    struct StakingInfos {
        uint dateStart;
        uint amount;
        bool hasStaked;
    }
    mapping (address => StakingInfos) public stakingInfos;
    uint public totalStaker;
    uint public stakingRate = 32;

    event Stake(address account, uint amount);
    event Withdraw(address account, uint amount, uint rewards);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = FMLYToken(_stakingToken);
    }

    function stake(uint _amount) external {
        // Checks :
        // - Minimum stake amount
        // - Sufficent amount in wallet
        // - Have already stake
        require(_amount >= 0, "Please entrer a correct amount to stake");
        require(_amount <= stakingToken.balanceOf(msg.sender), "You don't have enought token in your wallet");
        require(stakingInfos[msg.sender].hasStaked == false, "Please withdraw before stake again");

        // Effects:
        // - call token.transfertFrom()
        // - update stakingInfos in SC state
        // - increment totalStaker
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        stakingInfos[msg.sender] = StakingInfos({
            dateStart: block.timestamp,
            amount: _amount,
            hasStaked: true
        });
        totalStaker++;

        // Interractions:
        // - emit Stake event
        emit Stake(msg.sender, _amount);
    }

    function withdraw() external {
        // Checks :
        // - Have token staked
        require(stakingInfos[msg.sender].amount > 0, "You don't have any token staked");

        // Effects :
        // - Rewards calculation
        // - Tranfer staked tokens + rewards on msg sender's wallet
        // - Update SC state
        uint rewards = getRewards();
        stakingToken.transfer(msg.sender, stakingInfos[msg.sender].amount + rewards);
        // stakingToken.transfer(msg.sender, rewards);
        delete stakingInfos[msg.sender];
        totalStaker--;

        // Interractions :
        // - emit Withdraw event
        emit Withdraw(msg.sender, stakingInfos[msg.sender].amount, rewards);
    }

    function getRewards() public view returns (uint) {
        // Checks :
        // - Account has staked
        require(stakingInfos[msg.sender].hasStaked, "No staking found for the user");

        // Effects :
        // - Get the staking duration in seconds
        // - Calcul the rewards => (amount * duration * rate) / 365 days
        // --> Using the ethers unit for the rate so we can do a division with a float
        uint stakingDuration = block.timestamp - stakingInfos[msg.sender].dateStart;
        uint rewards = (
            stakingInfos[msg.sender].amount *
            stakingDuration *
            stakingRate * (10**18)  // 10^18 = 1 ETH (Wei)
        ) / (
            365 days * (10**18)  // 1 year in seconds
        );

        return rewards;
    }
}
