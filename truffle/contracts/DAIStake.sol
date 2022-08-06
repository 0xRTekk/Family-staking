// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DAI.sol";

pragma solidity 0.8.15;

/// @title Staking contract for ETH
/// @notice This contract is used to stake ETH through the Family-Staking app
contract DAIStake {
    // Variables
    IERC20 dai;
    mapping(address => Stake) stakes;

    struct Stake {
        uint amount;
        uint lastDistribution;
    }   

    // Events
    event DepositRegistered(address userAddress, uint amount, uint lockedUntil);
    event WithdrawRegistered(address userAddress, uint amount);

    /**
     * @dev Must pass the DAI token's address from the kovan network : 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa to use the ERC20 functions
     * @param _DAI ERC20 DAI token contract address
     */
    constructor(address _DAI) {
        dai = IERC20(_DAI);
    }

    /**
     * @notice Return the provided address staked token's balance
     * @param _userAddress address of the user
     */ 
    function getStakedBalance(address _userAddress) view external returns(uint) {
        return stakes[_userAddress].amount;
    }

    /**
     * @notice Return the total staked DAI tokens 
     * @dev Calls the balanceOf ERC20 function to return the total staked DAI tokens on this contract 
     */ 
    function getTotalStaked() view external returns(uint) {
        return dai.balanceOf(address(this));
    }

    /**
     * @notice Allow user to stake an amount of DAI and to add this amount to their balance.
     * @dev Calls the ERC20 approve function before the transferFrom to process the user balance
     * @param _amount amount to stake
     */ 
    function deposit(uint256 _amount) external {
        require(msg.sender != address(0), "Address can not be null");
        require(dai.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        dai.transferFrom(msg.sender, address(this), _amount);
        emit DepositRegistered(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Allow user to unstake an amount of ETH from their account if balance is sufficient. There is a timelock on deposit of 2 days.
     * @dev Will revert if the contract ETH balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    // function withdraw(uint _amount) external {
    //     uint userStake = stakes[msg.sender].amount;
    //     uint timeLock = stakes[msg.sender].lockRelease;

    //     require(userStake != 0, "Account is empty");
    //     require(block.timestamp >= timeLock, "Deposit is time locked");
    //     require(userStake >= _amount, "Cannot withdraw more than your current balance");
    //     require(address(this).balance >= _amount);

    //     stakes[msg.sender].amount = userStake - _amount;

    //     emit WithdrawRegistered(msg.sender, _amount);
    //     payable(msg.sender).transfer(_amount);
    // }
}