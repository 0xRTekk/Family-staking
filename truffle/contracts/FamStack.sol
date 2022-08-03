// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import "./Fam.sol";


/**
@title Family token contract by Maud Hutchinson
@dev This contrcat is stacking FAM token
 */

contract FamStack is ERC20 {

    /// variables

    FAM fam;
    mapping (address => bool) public rewardClaimed;
    uint  public start;
    uint public end;
    uint public totalStacked;
    uint public reward;

    /// Events
   
    event StackRegistered( uint _amount);

    /// Constructor

    constructor (address _FAM) ERC20 ('Family Token', 'FAM'){
        fam = FAM(_FAM);
        start = block.timestamp;
        end = block.timestamp + 2 days;
    }

    /**
    @dev get the balance of the stacker
     */

    function balance() public view returns (uint256) {
        return fam.balanceOf(address(this));
    }

   /**
    @dev create a pool and calculate the reward for the stacker
     */

    function deposit(uint256 _amount) public {
        uint256 _pool = balance();
        uint256 _before = fam.balanceOf(address(this));
        fam.transferFrom(msg.sender, address(this), _amount);
        uint256 _after = fam.balanceOf(address(this));
        _amount = _after - _before;
        uint256 shares = 0;
        emit StackRegistered( _amount);
        if (totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = _amount * totalSupply() / _pool;
        }
        _mint(msg.sender, shares);
    }
    


   /**
    @dev allow to deposit all assets
     */


     function depositAll() public {
        deposit(
            fam.balanceOf(msg.sender)
        );
    }
  
   /**
    @dev allow the stacker to withdraw stacked money and burn shares
    @notice require time to be minimun two days after the stack
     */


    function withdraw(uint256 _shares) public {
        require(block.timestamp >= end, 'too early');
        uint256 r = balance() * _shares/ totalSupply();
        _burn(msg.sender, _shares);
        fam.transfer(msg.sender, r);
    }
    /**
    @dev allow the stacker to withdraw  all stacked money
    @notice depends of fonction withdraw conditions
     */


    function withdrawAll() public {
        require(rewardClaimed[msg.sender] == false, 'you already received your reward');
        require(balanceOf(msg.sender) > 0 , 'not a stacker');
        withdraw(balanceOf(msg.sender));
        rewardClaimed [msg.sender] =  true;
    }

}