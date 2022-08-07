// == Import
import Web3 from 'web3';
import { Header, Card, Button, Form } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './unstake.scss';

// == Composant
function Staking() {
  const dispatch = useDispatch();
  const { token } = useParams();
  const tokens = useSelector((state) => state.tokens);
  const inputValue = useSelector((state) => state.unstakeInputValue);
  const tokenToDisplay = tokens.find((item) => item.symbol === token);

  const handleChange = (evt) => {
    dispatch({ type: 'CHANGE_UNSTAKING_VALUE', value: evt.target.value });
  };

  const handleUnstake = () => {
    // todo : branchement fonction withdrax. Ne pas oublier la conversion de l'inputValue (ether) en WEI
    dispatch({ type: 'UNSTAKE', token: token });
  };

  return (
    <section className="unstake">
      <Header as='h1' className="unstake-title">
        Unstake your <strong>{tokenToDisplay.symbol}</strong>
        <Header.Subheader className="hero-subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
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
              <div className="unstake-datas-estimated-rewards">
                <p>Estimated rewards</p>
                <p>{Web3.utils.fromWei(Web3.utils.toBN(tokenToDisplay.estimatedFAMRewards), 'ether')}FAM</p>
              </div>
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
