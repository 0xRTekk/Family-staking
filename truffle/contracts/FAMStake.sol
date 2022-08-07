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


    /// Token interface
    IERC20 fam;

    /// someones address -> how much they staked;
    mapping (address => Stake) stakeBalances;
    mapping(address => uint) pendingRewards;

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

    /**
    @dev create a pool and calculate the reward for the stacker
     */
    
    function deposit() external payable {
        require(msg.value > 0, "Amount cannot be 0");
        uint currentStake = stakeBalances[msg.sender].amount;
        uint currentDepositDate = stakeBalances[msg.sender].depositDate;
        stakeBalances[msg.sender].amount = currentStake + msg.value;
        totalSupply = totalSupply + msg.value;
        stakeBalances[msg.sender].depositDate = block.timestamp;
        bool success = fam.transferFrom(msg.sender, address(this), msg.value);
        require(success, "Failed");
        // We need to calculate the pending reward amount and store it
        if(currentStake > 0) {
            updatePendingRewards(currentStake, currentDepositDate, msg.sender);
        }   
        
        emit DepositRegistered(msg.sender, msg.value);
    }


    /**
     * @notice Updates the pending rewards balance of the user
     * @dev never called from outside of the contract
     * @param _stakes stake balance of the user
     * @param _from uint date of last deposit / to calcul from
     * @param _userAddress address of the user
     */
    function updatePendingRewards(uint _stakes, uint _from, address _userAddress) internal{
        // calculating nbDay since deposit
        uint nbDay = (block.timestamp - _from) / 60 / 60 / 24;
        uint FAMValue = 7500000000000000000; // Converted to WEI
        uint ETHValue = 1500000000000000000000; // DummyValue
        // FAMValue / (NbJour * (0,01% * ((ETHValue * _stakes) / 10^18)))
        uint FAMReward = ( ( ( nbDay * ( ( ( ETHValue * _stakes ) / 1000000000000000000 ) / 10000 ) ) * 1000000000000000000 ) / FAMValue );
        // Updating user pending balance
        pendingRewards[_userAddress] += FAMReward;

        emit UpdatedRewards(_userAddress, FAMReward);
    }

     /**
     * @notice Return the provided address balance
     * @param _userAddress address of the user
     */ 
    function getBalance(address _userAddress) view external returns(uint){
        return stakeBalances[_userAddress].amount;
    }


     /**
     * @notice Return a user pending reward balance
     * @param _userAddress address of the user
     */
    function getPendingRewards(address _userAddress) view external returns(uint){
        return pendingRewards[_userAddress];
    }

     
    /**
     * @notice Allow user to unstake an amount of ETH from their account if balance is sufficient. There is a timelock on deposit of 2 days.
     * @dev Will revert if the contract ETH balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    function withdraw( uint256 _amount) external {
        // verifications on the user balance
        uint userStake = stakeBalances[msg.sender].amount;
        require(userStake != 0, "Account is empty");
        require(userStake >= _amount, "Cannot withdraw more than your current balance");
        require(address(this).balance >= _amount);
        // Storing the current date of reference and calculating the lock release
        uint referenceDate = stakeBalances[msg.sender].depositDate;
        uint timeLock = referenceDate + 2 days;
        require(block.timestamp >= timeLock, "Deposit is time locked");
        // Updating the user's stake
        stakeBalances[msg.sender].amount = userStake - _amount;
        totalSupply = totalSupply - _amount;
        

   
        emit WithdrawRegistered(msg.sender, _amount);
    }


    

}