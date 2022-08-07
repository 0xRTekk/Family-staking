// == Import
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';

// == Composant
function StakingItem({ name, symbol, apr }) {
  return (
    <Card className="staking-item" raised>
      <Card.Content textAlign="center">
        <Card.Header className="staking-item-title">{name}</Card.Header>
        <Card.Meta className="staking-item-meta">Stake any amount of {symbol} and earn daily staking rewards.</Card.Meta>
        <Card.Description>
          APR <span className="staking-item-apr-info">estimated for 1 year</span> <br/> <strong className="staking-item-apr">{apr * 100}%</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button fluid color='purple' className="staking-item-button" as={Link} to={`/Family-staking/stake/${symbol}`}>
          Stake Now
        </Button>
      </Card.Content>
    </Card>
  );
}

// == Export
export default StakingItem;
