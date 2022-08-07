import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        // const { abi } = artifact;
        let address = [];
        let contract = [];
        try {
          artifact.forEach((item) => {
            const newAddress = item.networks[networkID].address;
            address.push(newAddress);
            contract.push(new web3.eth.Contract(item.abi, newAddress));
          })
          // address = artifact.networks[networkID].address;
          // contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = [
          require("../../contracts/FAM.json"),
          require("../../contracts/DAI.json"),
          require("../../contracts/DAIStake.json"),
          require("../../contracts/ETHStake.json"),
          require("../../contracts/DataFeedETHUSD.json"),
          require("../../contracts/DataFeedDAIUSD.json"),
          require("../../contracts/FAMStake.json"),
          // ...
          // Others contracts here
          // ...
        ];
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
