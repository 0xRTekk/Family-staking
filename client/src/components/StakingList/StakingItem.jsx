// == Import
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
// import PropTypesLib from 'prop-types';

// == Composant
function StakingItem() {
  return (
    <Card className="staking-item" raised>
        <Card.Content textAlign="center">
          <Card.Header className="staking-item-title">Ethereum</Card.Header>
          <Card.Meta className="staking-item-meta">Stake any amount of ETH and earn daily staking rewards.</Card.Meta>
          <Card.Description>
            APR <br/> <strong className="staking-item-apr">3.9%</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button fluid color='purple' className="staking-item-button" as={Link} to="/stake/ethereum">
            Stake Now
          </Button>
        </Card.Content>
      </Card>
  );
}

// == Export
export default StakingItem;
