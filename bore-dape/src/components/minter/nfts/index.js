import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getApes,
  createApe,
  fetchNftContractOwner,
  buyApe,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({ minterContract, marketContract, name }) => {
  const { performActions, address } = useContractKit();
  const [apes, setApes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState(null);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);
      const _apes = await getApes(minterContract, marketContract);
      if (!_apes) return;
      setApes(_apes);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [marketContract, minterContract]);

  const addNft = async (data) => {
    try {
      setLoading(true);
      await createApe(minterContract, marketContract, performActions, data);
      toast(<NotificationSuccess text="Updating Ape list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an Ape." />);
    } finally {
      setLoading(false);
    }   
  };

  const buyToken = async (index, tokenId) => {
    try {
      setLoading(true);
      await buyApe(
        minterContract,
        marketContract,
        performActions,
        index,
        tokenId
      );
      toast(<NotificationSuccess text="Updating Ape list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an Ape." />);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractOwner = useCallback(async (minterContract) => {
    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner]);

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>
                <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {apes.map((ape) => (
                <Nft
                  key={ape.index}
                  buyApe={() => buyToken(ape.index, ape.tokenId)}
                  ape={{
                    ...ape,
                  }}
                  address = {address}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};
NftList.propTypes = {
  minterContract: PropTypes.instanceOf(Object),
  marketContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
  marketContract: null,
};

export default NftList;
