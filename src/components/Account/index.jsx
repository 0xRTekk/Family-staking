/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function Account() {
  const {
    state: { accounts },
  } = useEth();
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function getAccount() {
      if (accounts) {
        setAccount(accounts[0]);
      }
    };

    getAccount();
  }, [accounts]);

  return (
    <Message
      icon='user circle'
      header='You are connected with this address'
      content={account}
    />
  );
}

export default Account;
