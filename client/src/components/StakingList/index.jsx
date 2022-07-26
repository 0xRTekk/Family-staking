// == Import
import { Header, Card, Image, Button } from 'semantic-ui-react';
// import PropTypesLib from 'prop-types';
import StakingItem from './StakingItem';
import './stacking-list.scss';

// == Composant
function StakingList() {
  return (
    <div className="stacking-list" id="stacking-list-anchor">
      <Header as='h2' className="stacking-list-title" textAlign='center'>
        Supported tokens
      <Header.Subheader className="stacking-list-subtitle">
        Family Staking vous permet de faire travailler vos tokens. <br />
        Commencez à gagner des revenus passifs dès maintenant !
      </Header.Subheader>
      </Header>

    <Card.Group className="staking-items" centered itemsPerRow={3}>

      <StakingItem />
      <StakingItem />
      <StakingItem />
      <StakingItem />
      <StakingItem />
      <StakingItem />
      
    </Card.Group>

    </div>
  );
}

// == Export
export default StakingList;
