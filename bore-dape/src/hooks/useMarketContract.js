import { useContract } from "./useContract";
import ApeMarketAbi from "../contracts/ApeMarket.json";
import ApeContract from "../contracts/ApeMarketAddress.json";

export const useMarketContract = () =>
  useContract(ApeMarketAbi.abi, ApeContract.ApeMarket);
