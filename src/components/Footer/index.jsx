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
          <a className="footer-link" target="_blank" href="https://github.com/0xRTekk/Family-staking" rel="noreferrer">GitHub</a>
        </List.Item>
        <List.Item>
          <a className="footer-link" target="_blank" href="https://sepolia.etherscan.io/address/0x99FdAf84F3aD77D041A99a80a6FEA895f3F6E15c" rel="noreferrer">Token Smart Contract</a>
        </List.Item>
        <List.Item>
          <a className="footer-link" target="_blank" href="https://sepolia.etherscan.io/address/0x0A28900A37Cb28bb88A509bb73687D491298D31e" rel="noreferrer">Staking Smart Contract</a>
        </List.Item>
        <List.Item>
          <a className="footer-link" target="_blank" href="https://github.com/0xRTekk/" rel="noreferrer">Author</a>
        </List.Item>
        <List.Item>
          <a className="footer-link" target="_blank" href="mailto:rtekk.eth@proton.me" rel="noreferrer">Contact</a>
        </List.Item>
      </List>

    </footer>
  );
}

// == Export
export default Footer;
