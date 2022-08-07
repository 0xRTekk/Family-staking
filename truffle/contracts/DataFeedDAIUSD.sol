// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DataFeedDAIUSD {
    AggregatorV3Interface internal priceFeed;

    uint private kovanChainId = 42;

    /**
     * @dev Uses the kovan network DAI/USD aggregator address
     */
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x777A68032a88E5A84678A77Af2CD65A7b3c0775a
        );
    }

    /**
     * @notice returns the latest price of the DAI/USD pair or a dummy DAI value
     * @return int256 latest price with 18 decimals
     */
    function getLatestPrice() public view returns (int256) {
        if(getChainId() != kovanChainId)
        {
            // Dummy DAI Value of 1 USD
            return 1000000000000000000;
        }

        (/*uint80 roundID*/,int256 price,/*uint startedAt*/, /*uint timeStamp*/, /*uint80 answeredInRound*/) = priceFeed.latestRoundData();
        return price*10000000000;
    }

    /**
     * @dev Will get the current chain ID. Used to test if we are on Kovan or if we need to use dummy values
     */
    function getChainId() private view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }
}
