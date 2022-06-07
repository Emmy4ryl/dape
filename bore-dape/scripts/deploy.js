const hre = require("hardhat");

async function main() {
  // market contract
  const ApeMarket = await hre.ethers.getContractFactory("ApeMarket");
  const market = await ApeMarket.deploy();

  await market.deployed();

  storeMarketData(market);

  const Ape = await hre.ethers.getContractFactory("Ape");
  const ape = await Ape.deploy(market.address);

  await ape.deployed();

  console.log("Ape NFT deployed to:", ape.address);
  storeContractData(ape);

}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/ApeAddress.json",
    JSON.stringify({ Ape: contract.address }, undefined, 2)
  );

  const ApeArtifact = artifacts.readArtifactSync("Ape");

  fs.writeFileSync(
    contractsDir + "/Ape.json",
    JSON.stringify(ApeArtifact, null, 2)
  );
}

function storeMarketData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/ApeMarketAddress.json",
    JSON.stringify({ ApeMarket: contract.address }, undefined, 2)
  );

  const ApeMarketArtifact = artifacts.readArtifactSync("ApeMarket");

  fs.writeFileSync(
    contractsDir + "/ApeMarket.json",
    JSON.stringify(ApeMarketArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
