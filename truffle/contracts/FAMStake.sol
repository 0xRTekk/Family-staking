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
    FAM private FAMInstance;

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
        FAMInstance = FAM(_FAM);
        
    }

    /**
    @dev create a pool and calculate the reward for the stacker
     */
    
    function registerDeposit(uint _amount) internal {
        require(msg.sender != address(0), "Address can not be null");
        require(FAMInstance.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Transfer tokens to this contract
        FAMInstance.transferFrom(msg.sender, address(this), _amount);

        uint currentStake = stakeBalances[msg.sender].amount;
        uint currentDepositDate = stakeBalances[msg.sender].depositDate;
        // Updating the user stake
        stakeBalances[msg.sender].amount = currentStake + _amount;
        stakeBalances[msg.sender].depositDate = block.timestamp;
        // We need to calculate the pending reward amount and store it
        if(currentStake > 0) {
            updatePendingRewards(currentStake, currentDepositDate, msg.sender);
        }   

        emit DepositRegistered(msg.sender, _amount);
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
     * @notice Allow user to stake an amount of DAI and to add this amount to their balance.
     * @dev Calls the registerStake internal function to process the user balance
     */ 
    function deposit(uint256 _amount) payable external {
        registerDeposit(_amount);
    }

     /**
     * @notice Return the provided address balance
     * @param _userAddress address of the user
     */ 
    function getBalance(address _userAddress) view external returns(uint){
        return stakeBalances[_userAddress].amount;
    }


     /**
     * @notice Return the total staked DAI tokens 
     * @dev Calls the balanceOf ERC20 function to return the total staked FAM tokens on this contract 
     */ 
    function getTotalStaked() view external returns(uint) {
        return FAMInstance.balanceOf(address(this));
    }


     /**
     * @notice Return a user pending reward balance
     * @param _userAddress address of the user
     */
    function getPendingRewards(address _userAddress) view external returns(uint){
        return pendingRewards[_userAddress];
    }

     
    
    /**
     * @notice Allow user to unstake an amount of DAI from their account if balance is sufficient. There is a timelock on deposit of 2 days.
     * @dev Will revert if the contract DAI balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    function withdraw(uint _amount) external {
        // verifications on the user balance
        uint userStake = stakeBalances[msg.sender].amount;
        require(userStake != 0, "Account is empty");
        require(userStake >= _amount, "Cannot withdraw more than your current balance");
        require(FAMInstance.balanceOf(address(this)) >= _amount, "Not enough liquidity");
        // Storing the current date of reference and calculating the lock release
        uint referenceDate = stakeBalances[msg.sender].depositDate;
        uint timeLock = referenceDate + 2 days;
        require(block.timestamp >= timeLock, "Deposit is time locked");

        // Updating the user's stake
        stakeBalances[msg.sender].amount = userStake - _amount;

        // Calculating and updating the pending rewards amount
        updatePendingRewards(userStake, referenceDate, msg.sender);
        uint rewardsToMint = pendingRewards[msg.sender];
        pendingRewards[msg.sender] = 0;
        
        // Minting the rewards to the user using the faucet function of the FAM contract
        FAMInstance.faucet(msg.sender, rewardsToMint);

        // Transfering back the amount to the user
        FAMInstance.transfer(msg.sender, _amount);
        
        // TODO Error management

        emit WithdrawRegistered(msg.sender, _amount);
    }
    

}