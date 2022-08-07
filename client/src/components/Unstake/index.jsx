// == Import
import Web3 from 'web3';
import { Header, Card, Button, Form } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import findContract from '../../selectors/findContract';
import { useEth } from '../../contexts/EthContext';
import './unstake.scss';

// == Composant
function Staking() {
  const dispatch = useDispatch();
  const { token } = useParams();
  const tokens = useSelector((state) => state.tokens);
  const inputValue = useSelector((state) => state.unstakeInputValue);
  const tokenToDisplay = tokens.find((item) => item.symbol === token);
  const { state: { accounts, artifact, contract, networkID } } = useEth();

  const handleChange = (evt) => {
    dispatch({ type: 'CHANGE_UNSTAKING_VALUE', value: evt.target.value });
  };

  const handleUnstake = async () => {
    let TokenContract;
    let TokenStakingContract;

    // On recup les instances des contracts à utiliser
    if (token === "DAI") {
      TokenContract = findContract(artifact, contract, networkID, "DAI");
      TokenStakingContract = findContract(artifact, contract, networkID, "DAIStake");
    } else if (token === "ETH") {
      TokenStakingContract = findContract(artifact, contract, networkID, "ETHStake");
    } else if (token === "FAM") {
      TokenContract = findContract(artifact, contract, networkID, "FAM");
      TokenStakingContract = findContract(artifact, contract, networkID, "FAMStake");
    }
    
    
    // On conversion en WEI
    const value = Web3.utils.toWei(inputValue, 'ether');

    // On unstake
    const receipt = await TokenStakingContract.methods.withdraw(value).send({ from: accounts[0] });

    // On recup l'event
    const returnedValues = receipt.events.WithdrawRegistered.returnValues;
    // On le clean
    const cleanedWithdrawEvent = {
        userAddress: returnedValues.userAddress,
        amount: returnedValues.amount,
    }
    // Et on le mémorise dans le store
    dispatch({ type: 'WITHDRAW_EVENT', event: cleanedWithdrawEvent });
    // dispatch({ type: 'UNSTAKE', token: token });

    // Un p'tit message pour notifier l'utilisateur
    alert(`Vous avez bien retiré ${inputValue} ${token}`);


    // On refresh pour recup les bonnes infos depuis le SM
    // La recup se fait dans le composant Header
    window.location.replace("https://remitekky.github.io/Family-staking/");
    return false;
  };

  return (
    <section className="unstake">
      <Header as='h1' className="unstake-title">
        Unstake your <strong>{tokenToDisplay.symbol}</strong>
        <Header.Subheader className="hero-subtitle">
          Récupérez vos tokens. Attention, tous les dépots sont bloqués pendant une période de 2 jours.
        </Header.Subheader>
      </Header>

      <Card className="unstake-item" raised centered>
        <Card.Content textAlign="center">

        <Form onSubmit={handleUnstake}>
          <Form.Field>
            <input placeholder='Amount' value={inputValue} onChange={handleChange} />
          </Form.Field>
          <Card.Description>
            <div className="unstake-datas">
              <div className="unstake-datas-total-stake">
                <p>Total staked</p>
                <p>{Web3.utils.fromWei(Web3.utils.toBN(tokenToDisplay.stakedBalance), 'ether')} {tokenToDisplay.symbol}</p>
              </div>
              <div className="unstake-datas-price">
                <p>Exchange rate</p>
                <p>1 {tokenToDisplay.symbol} = {tokenToDisplay.price} $</p>
              </div>
              <div className="unstake-datas-apr">
                <p>Annual percentage rate</p>
                <p>{tokenToDisplay.apr * 100}%</p>
              </div>
              {
                // <div className="unstake-datas-estimated-rewards">
                //   <p>Estimated rewards</p>
                //   <p>{Web3.utils.fromWei(Web3.utils.toBN(tokenToDisplay.estimatedFAMRewards), 'ether')}FAM</p>
                // </div>
              }
            </div>
          </Card.Description>
          <Button fluid color='purple' type="submit" className="unstake-item-button">
            Unstake Now
          </Button>
        </Form>

        </Card.Content>
      </Card>
    </section>
  );
}

// == Export
export default Staking;
