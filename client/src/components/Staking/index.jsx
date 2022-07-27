// == Import
import { Header, Card, Button, Form } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './staking.scss';

// == Composant
function Staking() {
  const dispatch = useDispatch();
  const { token } = useParams();
  const tokens = useSelector((state) => state.tokens);
  const inputValue = useSelector((state) => state.stakeInputValue);
  const tokenToDisplay = tokens.find((item) => item.symbol === token);
  // const FAMToken = tokens.find((item) => item.symbol === "FAM");

  // // Calcul des estimated rewards en FAM
  // const estimatedRewardsFAM = (tokenToDisplay.price * tokenToDisplay.totalStaked * tokenToDisplay.apr) / FAMToken.price;

  const handleChange = (evt) => {
    dispatch({ type: 'CHANGE_STAKING_VALUE', value: evt.target.value });
  };

  const handleStake = () => {
    dispatch({ type: 'STAKE', token: token });
  };

  return (
    <section className="staking">
      <Header as='h1' className="staking-title">
        Stake your <strong>{tokenToDisplay.symbol}</strong>
        <Header.Subheader className="hero-subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
        </Header.Subheader>
      </Header>

      <Card className="staking-item" raised centered>
        <Card.Content textAlign="center">

        <Form onSubmit={handleStake}>
          <Form.Field>
            <input placeholder='Amount' value={inputValue} onChange={handleChange} />
          </Form.Field>
          <Card.Description>
            <div className="staking-datas">
              <div className="staking-datas-total-stake">
                <p>Total staked</p>
                <p>{tokenToDisplay.totalStaked} {tokenToDisplay.symbol}</p>
              </div>
              <div className="staking-datas-price">
                <p>Exchange rate</p>
                <p>1 {tokenToDisplay.symbol} = {tokenToDisplay.price} $</p>
              </div>
              <div className="staking-datas-apr">
                <p>Annual percentage rate</p>
                <p>{tokenToDisplay.apr * 100}%</p>
              </div>
              <div className="staking-datas-estimated-rewards">
                <p>Estimated rewards</p>
                <p>{tokenToDisplay.FAMRewards.toFixed(3)}FAM</p>
              </div>
            </div>
          </Card.Description>
          <Button fluid color='purple' type="submit" className="staking-item-button">
            Stake Now
          </Button>
        </Form>

        </Card.Content>
      </Card>
    </section>
  );
}

// == Export
export default Staking;
