// == Import
import { Header as SemanticHeader, Icon, List, Button } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
// import PropTypesLib from 'prop-types';
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
            <Link
              className="menu-link"
              to="/stake/test"
            >
              Staking
            </Link>
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
      
      <Button color='purple' size='large'>Connect Wallet</Button>
    </header>
  );
}

// == Export
export default Header;
