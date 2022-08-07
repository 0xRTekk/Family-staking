// == Import
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import { Header, Table } from 'semantic-ui-react';
import './stakeHistory.scss';

// == Composant
function StakeHistory() {
  const depositEvents = useSelector((state) => state.depositEvents);
  const withdrawEvents = useSelector((state) => state.withdrawEvents);

  return (
    <section className="staking-history">
      <Header as='h1' className="staking-history__title">
        Protocol's history
        <Header.Subheader className="staking-history__subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
        </Header.Subheader>
      </Header>

      <Header as='h2' className="staking-history__title" textAlign='center'>Stake</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User address</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {depositEvents.map((item) => (
            <Table.Row>
              <Table.Cell>{item.userAddress}</Table.Cell>
              <Table.Cell>{Web3.utils.fromWei(Web3.utils.toBN(item.amount), 'ether')} {item.symbol}</Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Header as='h2' className="staking-history__title" textAlign='center'>Unstake</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User address</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {withdrawEvents.map((item) => (
            <Table.Row>
              <Table.Cell>{item.userAddress}</Table.Cell>
              <Table.Cell>{Web3.utils.fromWei(Web3.utils.toBN(item.amount), 'ether')} {item.symbol}</Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>

      

    </section>
  );
}

// == Export
export default StakeHistory;
