import React from "react";
import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/minter/Cover";
import Nfts from "./components/minter/nfts";
import { useEffect } from "react";
import { useBalance, useMinterContract, useMarketContract } from "./hooks"
import "./App.css";


const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance, getBalance } = useBalance();
  const minterContract = useMinterContract();
  const marketContract = useMarketContract()

  return (
    <>
      <Notification />
      {address ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                address={address}
                amount={balance.CELO}
                symbol="CELO"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main>
            <Nfts
              name="Bore-Dape"
              updateBalance={getBalance}
              minterContract={minterContract}
              marketContract = {marketContract}
            />
          </main>
        </Container>
      ) : (
        <Cover name="Bore-Dape" coverImg={"https://upload.wikimedia.org/wikipedia/en/c/c4/Various_Bored_Ape.jpg"} connect={connect} />
      )}
    </>
  );
};

export default App;