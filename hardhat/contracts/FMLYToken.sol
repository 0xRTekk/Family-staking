// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FMLYToken is ERC20, Ownable {
  uint8 constant _decimals = 18;
  uint256 constant _initialSupply = 100 * (10**6) * 10**_decimals; // 100 * 1m * 1eth = 100m

  constructor() ERC20("Family Token", "FMLY") Ownable(msg.sender) {
    _mint(msg.sender, _initialSupply);
  }

  function faucet() external {
    _mint(msg.sender, 10 * 10**_decimals);
  }
}
