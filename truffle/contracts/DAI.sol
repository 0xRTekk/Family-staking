//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;
 
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract DAI is ERC20 {
    constructor() ERC20("Dai Stablecoin", "DAI") {} 
 
    // fonction faucet pour créer des Dai tokens
    function faucet(address recipient, uint amount) external {
        _mint(recipient, amount);
    }
}