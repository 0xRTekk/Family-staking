import { Icon, List } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
              to="/Family-staking/"
            >
              <h1>Family Staking</h1>
            </NavLink>
        </div>
      </div>

      <ConnectButton />
    </header>
  );
}

// == Export
export default Header;
