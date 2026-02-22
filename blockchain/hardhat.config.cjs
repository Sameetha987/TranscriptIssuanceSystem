require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://young-crimson-snowflake.ethereum-sepolia.quiknode.pro/4c60740b1347f66b0968b74d0e98d09f491127ab/",
      accounts: ["706dbdb2d10114b7b8a553f1b5f66f98d478fdb1c96dd5dd59027b06f7c77e75"]
    }
  }
};
