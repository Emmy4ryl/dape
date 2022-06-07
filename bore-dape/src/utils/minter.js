import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import ApeMarketAddress from "../contracts/ApeMarketAddress.json";
import ApeAddress from "../contracts/ApeAddress.json";
import { BigNumber, ethers } from "ethers";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const createApe = async (
  minterContract,
  marketContract,
  performActions,
  { name, price, description, ipfsImage, attributes }
) => {
  await performActions(async (kit) => {
    if (!name || !description || !ipfsImage) return
    const { defaultAccount } = kit;

    // convert NFT metadata to JSON format
    const data = JSON.stringify({
      name,
      description,
      image: ipfsImage,
      owner: defaultAccount,
      attributes,
    });
    console.log(data);
    try {
      // save NFT metadata to IPFS
      const added = await client.add(data);

      // IPFS url for uploaded metadata
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // mint the NFT and save the IPFS url to the blockchain
      let tx = await minterContract.methods
        .mint(url)
        .send({ from: defaultAccount });

      let tokenId = BigNumber.from(tx.events.Transfer.returnValues.tokenId);

      const auctionPrice = ethers.utils.parseUnits(String(price), "ether");
      console.log(auctionPrice);

      await marketContract.methods
        .createApe(ApeAddress.Ape, tokenId, auctionPrice)
        .send({ from: defaultAccount });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

export const uploadToIpfs = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export const getApes = async (minterContract, marketContract) => {
  console.log(minterContract, marketContract)
  try {
    const apes = [];
    const apeLength = await marketContract.methods.getApeLength().call();
    console.log(apeLength);
    for (let i = 0; i < Number(apeLength); i++) {
      const ape = new Promise(async (resolve) => {
        const _ape = await marketContract.methods.getApe(i).call();
        const res = await minterContract.methods
          .tokenURI(_ape.tokenId)
          .call();
        const meta = await fetchNftMeta(res);
        const owner = await fetchNftOwner(minterContract, _ape.tokenId);
        resolve({
          index: i,
          contractOwner: owner,
          owner: _ape.owner,
          seller: _ape.seller,
          price: _ape.price,
          sold: _ape.sold,
          token: _ape.token,
          tokenId: _ape.tokenId,
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
          attributes: meta.data.attributes,
        });
      });
      apes.push(ape);
      console.log(apes)
    }
    return Promise.all(apes);
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const meta = await axios.get(ipfsUrl);
    return meta;
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftContractOwner = async (minterContract) => {
  try {
    let owner = await minterContract.methods.owner().call();
    return owner;
  } catch (e) {
    console.log({ e });
  }
};

export const buyApe = async (
  minterContract,
  marketContract,
  performActions,
  index,
  tokenId
) => {
  try {
    await performActions(async (kit) => {
      try {
        const { defaultAccount } = kit;
        const ape = await marketContract.methods.getApe(index).call();
        await marketContract.methods
          .buyApe(index)
          .send({ from: defaultAccount, value: ape.price });
        await minterContract.methods.resaleApproval(tokenId).send({from: defaultAccount})
      } catch (error) {
        console.log({ error });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
