// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FMLYToken is ERC20 {
  // uint8 constant _decimals = 18;
  // uint256 constant _totalSupply = 100 * (10**6) * 10**_decimals; // 100 * 1m * 1eth = 100m

  constructor() ERC20("Family Token", "FMLY") {
    // _mint(msg.sender, _totalSupply);
  }

  function mint(address _to, uint256 _amount) public {
    require(_amount > 0, "Mint : amount must be > to 0");
    _mint(_to, _amount);
  }
}
