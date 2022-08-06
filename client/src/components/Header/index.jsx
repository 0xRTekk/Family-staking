// == Import
import { Icon, List, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useEth } from "../../contexts/EthContext";
import './header.scss';

// == Composant
function Header() {
  const { state: { accounts }} = useEth();

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
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link menu-link--disabled')}
              to="/liquidity"
            >
              Liquidity pools <span className="menu-link--coming-soon">soon</span>
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
      
      {accounts && 
        <Button basic color='purple' size='small'>
          <Icon name='user' />
          <p>{accounts[0]}</p>
        </Button>
      }
    </header>
  );
}

// == Export
export default Header;
