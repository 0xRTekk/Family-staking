// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DAI.sol";
import "./FAM.sol";

pragma solidity 0.8.15;

/// @title Staking contract for ETH
/// @notice This contract is used to stake ETH through the Family-Staking app
contract DAIStake {
    // Variables
    IERC20 dai;
    FAM private FAMInstance;
    mapping(address => Stake) stakes;
    mapping(address => uint) pendingRewards;
    uint minDeposit = 10000000000000000;

    struct Stake {
        uint amount;
        uint depositDate;
    }   

    // Events
    event DepositRegistered(address userAddress, uint amount);
    event WithdrawRegistered(address userAddress, uint amount);
    event UpdatedRewards(address userAddress, uint amount);

    /**
     * @dev Can pass the DAI token's address from the kovan network : 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa to use the ERC20 functions
     * @param _DAI ERC20 DAI token contract address
     * @param _FAM address of the deployed contract
     */
    constructor(address _DAI, address _FAM) {
        dai = IERC20(_DAI);
        FAMInstance = FAM(_FAM);
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
     * @notice Return a user pending reward balance
     * @param _userAddress address of the user
     */
    function getPendingRewards(address _userAddress) view external returns(uint){
        return pendingRewards[_userAddress];
    }

    /**
     * @notice Allow user to stake an amount of DAI and to add this amount to their balance.
     * @dev Calls the ERC20 approve function before the transferFrom to process the user balance
     * @param _amount amount to stake
     */ 
    function registerDeposit(uint256 _amount) internal {
        require(msg.sender != address(0), "Address can not be null");
        require(dai.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Transfer tokens to this contract
        dai.transferFrom(msg.sender, address(this), _amount);

        uint currentStake = stakes[msg.sender].amount;
        uint currentDepositDate = stakes[msg.sender].depositDate;
        // Updating the user stake
        stakes[msg.sender].amount = currentStake + _amount;
        stakes[msg.sender].depositDate = block.timestamp;
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
     * @notice Allow user to unstake an amount of DAI from their account if balance is sufficient. There is a timelock on deposit of 2 days.
     * @dev Will revert if the contract DAI balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    function withdraw(uint _amount) external {
        // verifications on the user balance
        uint userStake = stakes[msg.sender].amount;
        require(userStake != 0, "Account is empty");
        require(userStake >= _amount, "Cannot withdraw more than your current balance");
        require(dai.balanceOf(address(this)) >= _amount, "Not enough liquidity");
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
        dai.transfer(msg.sender, _amount);
        
        // TODO Error management

        emit WithdrawRegistered(msg.sender, _amount);
    }
}