// == Import
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, List, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useEth } from "../../contexts/EthContext";
import findContract from '../../selectors/findContract';
import './header.scss';

// == Composant
function Header() {
  const dispatch = useDispatch();
  const { state: { accounts, artifact, contract, networkID } } = useEth();

  useEffect(() => {
    async function loadDepositEvents() {
      if (contract) {
        const DAIStakeContract = findContract(artifact, contract, networkID, "DAIStake");
        const depositEvents = await DAIStakeContract.getPastEvents('DepositRegistered', {fromBlock: 0, toBlock: "latest"});
        console.log(depositEvents);
        const cleanedDepositEvents = depositEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            lastDeposit: event.returnValues.lockedUntil,
          }
        })
        dispatch({ type: 'GET_PAST_DEPOSIT_EVENTS', events: cleanedDepositEvents });
      }
    };

    loadDepositEvents();
  }, [contract]);

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
          <List.Item>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/history"
            >
              History
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
