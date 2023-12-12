require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    quickNodeSepolia: {
      url: process.env.HTTP_PROVIDER,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.20",
};
