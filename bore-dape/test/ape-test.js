const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ApeMarket", function () {});

describe("Ape", function () {
  this.timeout(50000);

  let ape;
  let owner;
  let acc1;
  let acc2;
  let market;
  let tokenId;

  before(async () => {
    [owner, acc1, acc2] = await ethers.getSigners();
    market = await (await ethers.getContractFactory("ApeMarket")).deploy();
    console.log(market.address);
    ape = await (await ethers.getContractFactory("Ape")).deploy(market.address);
    console.log(ape.address);
  });

  it("Should create and execute market sales", async function () {
    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    const nftContractAddress = ape.address;
    const transaction = await ape.mint("https://example.com/1");
    const tx = await transaction.wait();
    tokenId = tx.events[0].args[2];
    console.log(tokenId);
    await market.createApe(nftContractAddress, 1, auctionPrice);
  });

  it("should buy ape", async function () {
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    await market.connect(acc1).buyApe(0, { value: auctionPrice });
    const t = await ape.connect(acc1).resaleApproval(tokenId);
    await market.connect(acc2).buyApe(0, { value: auctionPrice });
  });

  it("get length of apes", async function () {
    const apeLength = await market.getApeLength();
    
    console.log(apeLength);
    for (let index = 0; index < apeLength; index++) {
      const _ape = await market.getApe(index);
      console.log(_ape);
      const tokenUri = await ape.tokenURI(_ape.tokenId);
    }
  });
});
