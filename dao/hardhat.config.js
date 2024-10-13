require("@nomicfoundation/hardhat-toolbox");
const YOUR_PRIVATE_KEY = '662f765d309ddfaee7ae4055ede8797ff7fe776e01859f4143ef7466b01046bb'
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/8929f03ca18d42ecb1a22e612fec54a1`,
      accounts: [`0x${YOUR_PRIVATE_KEY}`]
    }
  }
};


