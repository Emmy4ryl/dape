import { useContract } from "./useContract";
import ApeAbi from "../contracts/Ape.json";
import ApeAddress from "../contracts/ApeAddress.json";

export const useMinterContract = () =>
  useContract(ApeAbi.abi, ApeAddress.Ape);
