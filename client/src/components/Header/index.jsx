// == Import
import { Icon, List, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import Web3 from 'web3';
import { useEth } from "../../contexts/EthContext";
import Account from '../Account';
import './header.scss';

// == Composant
function Header() {
  return (
    <header className="landing-header">
      <div className="landing-header-left">

        <div className="landing-header-logo">
          <Icon name='ethereum' size='big' />
          <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/"
            >
              <h1>Family Staking</h1>
            </NavLink>
        </div>

        <List horizontal relaxed='very'>
          <List.Item>
            <a
              className="menu-link"
              href="/#stacking-list-anchor"
            >
              Staking
            </a>
          </List.Item>
          <List.Item disabled>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/earn"
            >
              Earn
            </NavLink>
          </List.Item>
          <List.Item>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/rewards"
            >
              Rewards
            </NavLink>
          </List.Item>
        </List>

      </div>
      
      <Button
        color='purple'
        size='large'
      >
        Connect Wallet
      </Button>

    </header>
  );
}

// == Export
export default Header;
