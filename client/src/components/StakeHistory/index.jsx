// == Import
import { useSelector } from 'react-redux';
import { Header, Table } from 'semantic-ui-react';
import './stakeHistory.scss';

// == Composant
function StakeHistory() {
  const depositEvents = useSelector((state) => state.depositEvents);

  return (
    <section className="staking-history">
      <Header as='h1' className="staking-history__title">
        Staking history
        <Header.Subheader className="staking-history__subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
        </Header.Subheader>
      </Header>

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
          <Table.Cell>{item.amount}</Table.Cell>
      </Table.Row>
      ))}
    </Table.Body>
  </Table>

    </section>
  );
}

// == Export
export default StakeHistory;
