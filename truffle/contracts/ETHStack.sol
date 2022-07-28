// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract ETHStack {
    event StackRegistered(address userAddress, uint amount);
    event UnstackRegistered(address userAddress, uint amount);

    function stack() payable external {
        emit StackRegistered(msg.sender, msg.value);
    }

    function unstack(uint _amount) external {
        emit UnstackRegistered(msg.sender, _amount);
    }

    function mesCouilles(uint _amount) external {
        emit UnstackRegistered(msg.sender, _amount);
    }
}