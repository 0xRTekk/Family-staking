// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;


import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FAM.sol";


/**
@title Family token contract by Maud Hutchinson
@dev This contractt is stacking FAM token
 */

contract FAMStake {

    /// variables

    IERC20 fam;

    /// someones address -> how much they staked;
    mapping (address => Stake) stakeBalances;

    uint256 public totalSupply;

    /// someones address -> who claimed they reward;
    mapping (address => bool) public rewardClaimed;
    
    /// struct of an account 
      struct Stake {
        uint amount;
        uint depositDate;
    } 

    /// Events
   
    event DepositRegistered(address userAddress, uint amount);
    event WithdrawRegistered(address userAddress, uint amount);
    event UpdatedRewards(address userAddress, uint amount);

    /// Constructor

    /**
     * @dev Require the address of the FAM token contract to be able to mint FAM to users
     * @param _FAM address of the deployed contract
     */

    constructor (address _FAM) {
        fam = IERC20(_FAM);
        
    }

        function balance(address _addr) public view returns (uint256) {
        return stakeBalances[_addr].amount;
    }

    /**
    @dev create a pool and calculate the reward for the stacker
     */
    
    function deposit() external payable {
        require(msg.value > 0, "Amount cannot be 0");
        uint currentStake = stakeBalances[msg.sender].amount;
        stakeBalances[msg.sender].amount = currentStake + msg.value;
        totalSupply = totalSupply + msg.value;
        bool success = fam.transferFrom(msg.sender, address(this), msg.value);
        require(success, "Failed");
        emit DepositRegistered(msg.sender, msg.value);
    }

     
   

     /**
    @dev allow the stacker to withdraw some stacked money 
     */


    function withdraw( uint256 _amount) external {
         require(_amount < totalSupply, "Amount cannot be 0");
         uint userStake = stakeBalances[msg.sender].amount;
        stakeBalances[msg.sender].amount = userStake - _amount;
        totalSupply = totalSupply - _amount;
        bool success = fam.transfer(msg.sender, _amount);
        require(success, "Something went wrong");
        emit WithdrawRegistered(msg.sender, _amount);
    }


    

}