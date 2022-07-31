// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
 
contract Fam is ERC20, Ownable {
	

	constructor() ERC20('Family Token', 'FAM') {}
	
	/* 
	@dev fonction faucet pour créer des Fam tokens
	**/
	function faucet(address recipient, uint amount) external onlyOwner {
		_mint(recipient, amount);
	}
    /* 
	@dev replace default 18 decimals to 8 decimals
	**/
	function decimals() public view virtual override returns (uint8){
		return 8;
	}
}
