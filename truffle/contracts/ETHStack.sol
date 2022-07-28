// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract ETHStack {
    event StackRegistered(address userAddress, uint amount);
    event UnstackRegistered(address userAddress, uint amount);

    mapping(address => uint) stacks;

    function stack() payable external {
        uint userStack = stacks[msg.sender];
        stacks[msg.sender] = userStack + msg.value;
        emit StackRegistered(msg.sender, msg.value);
    }

    function unstack(uint _amount) external {
        uint userStack = stacks[msg.sender];

        require(userStack != 0, "Cannot withdraw more than your current balance");
        require(_amount >= userStack, "Cannot withdraw more than your current balance");
        require(address(this).balance >= _amount);

        stacks[msg.sender] = userStack - _amount;

        emit UnstackRegistered(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }
}