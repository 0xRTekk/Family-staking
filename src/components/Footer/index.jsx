// == Import
import { List, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// import PropTypesLib from 'prop-types';
import './footer.scss';

// == Composant
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <Icon name='ethereum' size='large' />
        <Link to="/" className="footer-link">Family Staking</Link>
      </div>

      <List horizontal relaxed='very'>
        <List.Item>
          <a className="footer-link" target="_blank" href="https://github.com/Remitekky/Family-staking" rel="noreferrer">GitHub</a>
        </List.Item>
        <List.Item>
          <Link className="footer-link" to="/Family-staking/#">Team</Link>
        </List.Item>
        <List.Item>
          <Link className="footer-link" to="/Family-staking/#">Term of Use</Link>
        </List.Item>
        <List.Item>
          <Link className="footer-link" to="/Family-staking/#">Privacy</Link>
        </List.Item>
      </List>

    </footer>
  );
}

// == Export
export default Footer;
