// == Import
import { Header, Card, Button, Form } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
// import PropTypesLib from 'prop-types';
import './staking.scss';

// == Composant
function Staking() {
  const { token } = useParams();
  return (
    <section className="staking">
      <Header as='h1' className="staking-title">
        Stake your <strong>{token}</strong>
        <Header.Subheader className="hero-subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
        </Header.Subheader>
      </Header>

      <Card className="staking-item" raised centered>
        <Card.Content textAlign="center">

        <Form>
          <Form.Field>
            <input placeholder='Amount' />
          </Form.Field>
          <Card.Description>
            <div className="staking-datas">
              <div className="staking-datas-rewards">
                <p>You will receive</p>
                <p>0 FAM</p>
              </div>
              <div className="staking-datas-rate">
                <p>Exchange rate</p>
                <p>1 {token} = 1 FAM</p>
              </div>
              <div className="staking-datas-fee">
                <p>Reward fee</p>
                <p>10%</p>
              </div>
              <div className="staking-datas-apr">
                <p>Annual percentage rate</p>
                <p>3.9%</p>
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
