// == Import
import { Header as SemanticHeader, Icon, List } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
// import PropTypesLib from 'prop-types';
import './header.scss';

// == Composant
function Header() {
  return (
    <header className="landing-header">
      <div className="landing-left">
        <div className="landing-logo">
          <Icon name='ethereum' size='big' />
          <SemanticHeader
            as={NavLink}
            to="/"
          >
            Family Staking
          </SemanticHeader>
        </div>

        <List horizontal relaxed='very'>
          <List.Item>
            <Link to="/stake/test">Staking</Link>
          </List.Item>
          <List.Item disabled>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : '')}
              to="/earn"
            >
              Earn
            </NavLink>
          </List.Item>
          <List.Item>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : '')}
              to="/rewards"
            >
              Rewards
            </NavLink>
          </List.Item>
      </List>

      </div>
      
      <div>Connect Wallet</div>
    </header>
  );
}

// == Export
export default Header;
