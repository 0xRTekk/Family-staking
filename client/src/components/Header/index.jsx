// == Import
import { Icon, List, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './header.scss';

// == Composant
function Header() {
  const dispacth = useDispatch();

  const handleConnect = () => {
    console.log('Connect');
    dispacth({ type: 'CONNECT' });
  };

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
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    </header>
  );
}

// == Export
export default Header;
