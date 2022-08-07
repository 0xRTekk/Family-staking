// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FAM.sol";
import "./DataFeedETHUSD.sol";

/// @title Staking contract for ETH
/// @notice This contract is used to stake ETH through the Family-Staking app
contract ETHStake {
    // Variables
    mapping(address => Stake) stakes;
    mapping(address => uint) pendingRewards;

    struct Stake {
        uint amount;
        uint depositDate;
    }   

    FAM private FAMInstance;
    DataFeedETHUSD private ETHUSDFeed;

    uint minDeposit = 10000000000000000;

    // Events
    event DepositRegistered(address userAddress, uint amount);
    event WithdrawRegistered(address userAddress, uint amount);
    event UpdatedRewards(address userAddress, uint amount);

    /**
     * @dev Require the address of the FAM token contract to be able to mint FAM to users
     * @param _FAM address of the deployed contract
     */
    constructor(address _FAM, address _dataFeed) {
        FAMInstance = FAM(_FAM);
        ETHUSDFeed = DataFeedETHUSD(_dataFeed);
    }

    /**
     * @dev Internal function that register the stake and calculate pending rewards. Used by the stake function and the default receive function. Emits a StakeRegistered event.
     */ 
    function registerDeposit() internal {
        require(msg.value >= minDeposit, "Minimum deposit is 0.01 ETH");

        uint currentStake = stakes[msg.sender].amount;
        uint currentDepositDate = stakes[msg.sender].depositDate;
        // Updating the user stake first
        stakes[msg.sender].amount = currentStake + msg.value;
        stakes[msg.sender].depositDate = block.timestamp;
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
        uint ETHValue = uint(ETHUSDFeed.getLatestPrice());
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
        return stakes[_userAddress].amount;
    }

    /**
     * @notice Return the total staked DAI tokens 
     * @dev Calls the balanceOf ERC20 function to return the total staked DAI tokens on this contract 
     */ 
    function getTotalStaked() view external returns(uint) {
        return address(this).balance;
    }

    /**
     * @notice Return a user pending reward balance
     * @param _userAddress address of the user
     */
    function getPendingRewards(address _userAddress) view external returns(uint){
        return pendingRewards[_userAddress];
    }

    /**
     * @notice Allow user to stake an amount of ETH and to add this amount to their balance.
     * @dev Calls the registerStake internal function to process the user balance
     */ 
    function deposit() payable external {
        registerDeposit();
    }

    /**
     * @notice Allow user to unstake an amount of ETH from their account if balance is sufficient. There is a timelock on deposit of 2 days.
     * @dev Will revert if the contract ETH balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    function withdraw(uint _amount) external {
        // verifications on the user balance
        uint userStake = stakes[msg.sender].amount;
        require(userStake != 0, "Account is empty");
        require(userStake >= _amount, "Cannot withdraw more than your current balance");
        require(address(this).balance >= _amount);
        // Storing the current date of reference and calculating the lock release
        uint referenceDate = stakes[msg.sender].depositDate;
        uint timeLock = referenceDate + 2 days;
        require(block.timestamp >= timeLock, "Deposit is time locked");

        // Updating the user's stake
        stakes[msg.sender].amount = userStake - _amount;

        // Calculating and updating the pending rewards amount
        updatePendingRewards(userStake, referenceDate, msg.sender);
        uint rewardsToMint = pendingRewards[msg.sender];
        pendingRewards[msg.sender] = 0;
        // Minting the rewards to the user using the faucet function of the FAM contract
        FAMInstance.faucet(msg.sender, rewardsToMint);
        // Transfering back the amount to the user
        payable(msg.sender).transfer(_amount);
        // TODO Error management

        emit WithdrawRegistered(msg.sender, _amount);
    }

    /**
     * @notice Fallback function to receive ETH from a transfer or a send. Please note that this is not the preferred method of staking on this contract.
     */
    receive() external payable{
        registerDeposit();
    }
}