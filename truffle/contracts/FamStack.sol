// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;


import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Fam.sol";


/**
@title Family token contract by Maud Hutchinson
@dev This contractt is stacking FAM token
 */

contract FamStack {

    /// variables

    IERC20 fam;
    mapping (address => bool) public rewardClaimed;
    uint  public start;
    uint public end;
    uint public totalStacked;
    uint public reward;

    /// Events
   
    event StackRegistered( uint _amount);
    event WithdrawRegistered ( uint _amount);

    /// Constructor

    constructor (address _FAM) {
        fam = IERC20(_FAM);
        start = block.timestamp;
        end = block.timestamp + 2 days;
    }

        function balance() public view returns (uint256) {
        return fam.balanceOf(address(this));
    }

    /**
    @dev create a pool and calculate the reward for the stacker
     */
    
    function deposit(uint256 _amount) public payable {
        require(_amount > 0, "Amount cannot be 0");
        fam.transferFrom(msg.sender, address(this), _amount);
        emit StackRegistered( _amount);
    }

     /**
    @dev allow to deposit all assets
     */


    function depositAll() public payable {
        deposit(
            fam.balanceOf(msg.sender)
        );
    }

     /**
    @dev allow the stacker to withdraw some stacked money 
    @notice require time to be minimun two days after the stack
     */


    function withdraw( uint256 _amount) public {
        require(block.timestamp >= end, 'too early');
        fam.transfer(msg.sender, _amount);
        emit WithdrawRegistered (  _amount);
    }

    /**
    @dev allow the stacker to withdraw  all stacked money
    @notice depends of fonction withdraw conditions
     */


    function withdrawAll() public {
        require(rewardClaimed[msg.sender] == false, 'you already received your reward');
        require(balance() > 0 , 'not a stacker');
        withdraw(balance());
        rewardClaimed [msg.sender] = true;
    }

}