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
        // Instances des contracts
        const DAIStakeContract = findContract(artifact, contract, networkID, "DAIStake");
        const FAMStakeContract = findContract(artifact, contract, networkID, "FAMStake");
        const ETHStakeContract = findContract(artifact, contract, networkID, "ETHStake");

        // Recup des events passés
        const daiDepositEvents = await DAIStakeContract.getPastEvents('DepositRegistered', {fromBlock: 0, toBlock: "latest"});
        const famDepositEvents = await FAMStakeContract.getPastEvents('DepositRegistered', {fromBlock: 0, toBlock: "latest"});
        const ethDepositEvents = await ETHStakeContract.getPastEvents('DepositRegistered', {fromBlock: 0, toBlock: "latest"});

        // Mise en forme des données dans un tableau plus facilement exploitable
        let depositEvents = [];
        const cleanedDaiDepositEvents = daiDepositEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "DAI"
          }
        });
        const cleanedFamDepositEvents = famDepositEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "FAM"
          }
        });
        const cleanedEthDepositEvents = ethDepositEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "ETH"
          }
        });

        // On crée un tableau contenant tous les events (tous tokens confondus)
        depositEvents.push(
          ...cleanedDaiDepositEvents,
          ...cleanedFamDepositEvents ,
          ...cleanedEthDepositEvents
        );
        // console.log(depositEvents);
      
        // On mémorise ce tableau dans le store
        dispatch({ type: 'GET_PAST_DEPOSIT_EVENTS', events: depositEvents });
      }
    };
    
    async function updateDAIRate(){
      if(contract){
        const DAIStakeContract = findContract(artifact, contract, networkID, "DataFeedDAIUSD");
        const DAIRate = await DAIStakeContract.methods.getLatestPrice().call({from: accounts[0]});
        const token = {
          symbol: "DAI",
          price: DAIRate
        }
        dispatch({type: 'UPDATE_RATES', token: token});
      }
    };

    async function updateETHRate(){
      if(contract){
        const ETHStakeContract = findContract(artifact, contract, networkID, "DataFeedETHUSD");
        const ETHRate = await ETHStakeContract.methods.getLatestPrice().call({from: accounts[0]});
        const token = {
          symbol: "ETH",
          price: ETHRate
        }
        dispatch({type: 'UPDATE_RATES', token: token});
      }
    };

    async function loadWithdrawEvents() {
      if (contract) {
        // Instances des contracts
        const DAIStakeContract = findContract(artifact, contract, networkID, "DAIStake");
        const FAMStakeContract = findContract(artifact, contract, networkID, "FAMStake");
        const ETHStakeContract = findContract(artifact, contract, networkID, "ETHStake");

        // Recup des events passés
        const daiWithdrawEvents = await DAIStakeContract.getPastEvents('WithdrawRegistered', {fromBlock: 0, toBlock: "latest"});
        const famWithdrawEvents = await FAMStakeContract.getPastEvents('WithdrawRegistered', {fromBlock: 0, toBlock: "latest"});
        const ethWithdrawEvents = await ETHStakeContract.getPastEvents('WithdrawRegistered', {fromBlock: 0, toBlock: "latest"});

        // Mise en forme des données dans un tableau plus facilement exploitable
        let withdrawEvents = [];
        const cleanedDaiWithdrawEvents = daiWithdrawEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "DAI"
          }
        });
        const cleanedFamWithdrawEvents = famWithdrawEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "FAM"
          }
        });
        const cleanedEthWithdrawEvents = ethWithdrawEvents.map((event) => {
          return {
            userAddress: event.returnValues.userAddress,
            amount: event.returnValues.amount,
            symbol: "ETH"
          }
        });

        // On crée un tableau contenant tous les events (tous tokens confondus)
        withdrawEvents.push(
          ...cleanedDaiWithdrawEvents,
          ...cleanedFamWithdrawEvents ,
          ...cleanedEthWithdrawEvents
        );
        console.log(withdrawEvents);
      
        // On mémorise ce tableau dans le store
        dispatch({ type: 'GET_PAST_WITHDRAW_EVENTS', events: withdrawEvents });
      }
    };
    
    async function loadDAIStats() {
      if (contract) {
        const DAIStakeContract = findContract(artifact, contract, networkID, "DAIStake");
        const totalStaked = await DAIStakeContract.methods.getTotalStaked().call({ from: accounts[0] });
        const stakedBalance = await DAIStakeContract.methods.getStakedBalance(accounts[0]).call({ from: accounts[0] });
        const token = {
          symbol: "DAI",
          totalStaked: totalStaked,
          stakedBalance: stakedBalance
        };
        dispatch({ type: 'UPDATE_STAKED_AMOUNTS', token: token });
      }
    };

    async function loadFAMStats() {
      if (contract) {
        const FAMStakeContract = findContract(artifact, contract, networkID, "FAMStake");
        const totalStaked = await FAMStakeContract.methods.getTotalStaked().call({ from: accounts[0] });
        const stakedBalance = await FAMStakeContract.methods.getBalance(accounts[0]).call({ from: accounts[0] });
        const token = {
          symbol: "FAM",
          totalStaked: totalStaked,
          stakedBalance: stakedBalance
        };
        dispatch({ type: 'UPDATE_STAKED_AMOUNTS', token: token });
      }
    };

    async function loadETHStats() {
      if (contract) {
        const ETHStakeContract = findContract(artifact, contract, networkID, "ETHStake");
        const totalStaked = await ETHStakeContract.methods.getTotalStaked().call({ from: accounts[0] });
        const stakedBalance = await ETHStakeContract.methods.getBalance(accounts[0]).call({ from: accounts[0] });
        const token = {
          symbol: "ETH",
          totalStaked: totalStaked,
          stakedBalance: stakedBalance
        };
        dispatch({ type: 'UPDATE_STAKED_AMOUNTS', token: token });
      }
    };

    loadDepositEvents();
    loadWithdrawEvents();
    loadDAIStats();
    loadFAMStats();
    loadETHStats();
    updateDAIRate();
    updateETHRate();
  }, [contract]);

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

        <List horizontal relaxed='very'>
          <List.Item>
            <a
              className="menu-link"
              href="/Family-staking/#stacking-list-anchor"
            >
              Staking
            </a>
          </List.Item>
          <List.Item disabled>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link menu-link--disabled')}
              to="/Family-staking/liquidity"
            >
              Liquidity pools <span className="menu-link--coming-soon">soon</span>
            </NavLink>
          </List.Item>
          <List.Item>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/Family-staking/rewards"
            >
              Rewards
            </NavLink>
          </List.Item>
          <List.Item>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-link--active' : 'menu-link')}
              to="/Family-staking/history"
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
