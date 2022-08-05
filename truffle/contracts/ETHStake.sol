// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

/// @title Staking contract for ETH
/// @notice This contract is used to stake ETH through the Family-Staking app
contract ETHStake {
    // Variables
    mapping(address => Stake) stakes;

    struct Stake {
        uint amount;
        uint lockRelease;
    }   

    // Events
    event DepositRegistered(address userAddress, uint amount, uint lockedUntil);
    event WithdrawRegistered(address userAddress, uint amount);

    /**
     * @dev Internal function that register the stake. Used by the stake function and the default receive function. Emits a StakeRegistered event.
     */ 
    function registerDeposit() internal {
        uint userStake = stakes[msg.sender].amount;
        uint newLock = block.timestamp + 2 days;
        stakes[msg.sender].amount = userStake + msg.value;
        stakes[msg.sender].lockRelease = newLock;
        emit DepositRegistered(msg.sender, msg.value, newLock);
    }

    /**
     * @notice Return the provided address balance
     * @param _userAddress address of the user
     */ 
    function getBalance(address _userAddress) view external returns(uint){
        return stakes[_userAddress].amount;
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
        uint userStake = stakes[msg.sender].amount;
        uint timeLock = stakes[msg.sender].lockRelease;

        require(userStake != 0, "Account is empty");
        require(block.timestamp >= timeLock, "Deposit is time locked");
        require(userStake >= _amount, "Cannot withdraw more than your current balance");
        require(address(this).balance >= _amount);

        stakes[msg.sender].amount = userStake - _amount;

        emit WithdrawRegistered(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

    /**
     * @notice Fallback function to receive ETH from a transfer or a send. Please note that this is not the preferred method of staking on this contract.
     */
    receive() external payable{
        registerDeposit();
    }
}