// == Import
import { Image, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// import PropTypesLib from 'prop-types';
import logoEth from './logo-eth.png';
import './hero.scss';

// == Composant
function Hero() {
  return (
    <div className="hero">
      <Header as='h2' className="hero-title">
        Bienvenue chez <strong>Family Staking</strong>
        <Header.Subheader className="hero-subtitle">
          Venez construire un avenir financier confortable pour vous et votre famille
        </Header.Subheader>
        <Button color='purple' size='massive' className="hero-button" as="a" href="/Family-staking/#stacking-list-anchor">
          Stake Now
        </Button>
      </Header>
      <Image src={logoEth} size='large' />
    </div>
  );
}

// == Export
export default Hero;
