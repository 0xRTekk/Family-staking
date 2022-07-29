// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

/// @title Stacking contract for ETH
/// @notice This contract is used to stack ETH through the Family-Stacking app
contract ETHStack {
    // Variables
    mapping(address => uint) stacks;

    // Events
    event StackRegistered(address userAddress, uint amount);
    event UnstackRegistered(address userAddress, uint amount);

    /**
     * @dev Internal function that register the stack. Used by the stack function and the default receive function. Emits a StackRegistered event.
     */ 
    function registerStack() internal {
        uint userStack = stacks[msg.sender];
        stacks[msg.sender] = userStack + msg.value;
        emit StackRegistered(msg.sender, msg.value);
    }

    /**
     * @notice Return the provided address balance
     * @param _userAddress address of the user
     */ 
    function getBalance(address _userAddress) view external returns(uint){
        return stacks[_userAddress];
    }

    /**
     * @notice Allow user to stack an amount of ETH and to add this amount to their balance.
     * @dev Calls the registerStack internal function to process the user balance
     */ 
    function stack() payable external {
        registerStack();
    }

    /**
     * @notice Allow user to unstack an amount of ETH from their account if balance is sufficient.
     * @dev Will revert if the contract ETH balance is not sufficient to fullfill the withdrawal
     * @param _amount uint - Number of wei to withdraw
     */
    function unstack(uint _amount) external {
        uint userStack = stacks[msg.sender];

        require(userStack != 0, "Account is empty");
        require(userStack >= _amount, "Cannot withdraw more than your current balance");
        require(address(this).balance >= _amount);

        stacks[msg.sender] = userStack - _amount;

        emit UnstackRegistered(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

    /**
     * @notice Fallback function to receive ETH from a transfer or a send. Please note that this is not the preferred method of stacking on this contract.
     */
    receive() external payable{
        registerStack();
    }
}