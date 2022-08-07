// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';


/** 
*@title Minting contract for FAM
* @notice This contract is used to create FAM 
*/
 
contract FAM is ERC20, Ownable {

	mapping(address => bool) private authorizedContract;

	// events
	event FamTransfered(address recipient, uint amount);

	// modifiers
	modifier onlyAuthorized(){
		require(
			authorizedContract[msg.sender] || msg.sender == owner(),
			"Caller is not authorized to execute this function"
		);
		_;
	}
    
    // Constructor

	constructor() ERC20('Family Token', 'FAM') {
		// _mint(msg.sender, 100 * 10 ** decimals());
	}
	
	/** 
	 * @dev fonction faucet pour créer des Fam tokens
	 * @param recipient recipient of the mint
	 * @param amount amount to mint
	 */
	function faucet(address recipient, uint amount) external onlyAuthorized {
		_mint(recipient, amount);
		emit FamTransfered(recipient, amount);
	}

	/**
	 * @dev authorizes specifics contract to mint 
	 * @param _contract address of the trusted contract
	 */
	function authorize(address _contract) external onlyOwner {
		authorizedContract[_contract] = true;
	}

    /** 
	 @dev replace default 18 decimals to 8 decimals
	*/

	function decimals() public view virtual override returns (uint8){
		return 18;
	}

   
}
