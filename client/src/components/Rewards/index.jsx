// == Import
import { Header, Segment, Card, Button } from 'semantic-ui-react';
import './rewards.scss';

// == Composant
function Rewards() {
  return (
    <section className="rewards">
      <Header as='h1' className="rewards-title">
        Your Rewards
        <Header.Subheader className="rewards-subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, fuga.
        </Header.Subheader>
      </Header>

      <Segment className="rewards-datas-wrapper" raised>
        <Card.Group centered itemsPerRow={1}>
          <Card color='purple'>
            <Card.Content className="rewards-datas-inner">
              <div className="rewards-datas">
                <div className="rewards-token">
                  <p><strong>ETH</strong></p>
                </div>
                <div className="rewards-total-staked">
                  <p><strong>Total Staked</strong></p>
                  <p>0.3 ETH</p>
                  <p>152 $</p>
                </div>
                <div className="rewards-FAM-earned">
                  <p><strong>FAM earned</strong></p>
                  <p>0.5 FAM</p>
                  <p>50 $</p>
                </div>
                <div className="rewards-FAM-price">
                  <p><strong>FAM prices</strong></p>
                  <p>100 $</p>
                  <p>130 ETH</p>
                </div>
              </div>
              <Button color='purple' className="rewards-button" floated='right'>
                Unstake
              </Button>
            </Card.Content>
          </Card>
          <Card color='purple'>
            <Card.Content className="rewards-datas-inner">
              <div className="rewards-datas">
                <div className="rewards-token">
                  <p><strong>FAM</strong></p>
                </div>
                <div className="rewards-total-staked">
                  <p><strong>Total Staked</strong></p>
                  <p>13 FAM</p>
                  <p>335 $</p>
                </div>
                <div className="rewards-FAM-earned">
                  <p><strong>FAM earned</strong></p>
                  <p>13 FAM</p>
                  <p>230 $</p>
                </div>
                <div className="rewards-FAM-price">
                  <p><strong>FAM prices</strong></p>
                  <p>100 $</p>
                  <p>130 ETH</p>
                </div>
              </div>
              <Button color='purple' className="rewards-button" floated='right'>
                Unstake
              </Button>
            </Card.Content>
          </Card>
          <Card color='purple'>
            <Card.Content className="rewards-datas-inner">
              <div className="rewards-datas">
                <div className="rewards-token">
                  <p><strong>DAI</strong></p>
                </div>
                <div className="rewards-total-staked">
                  <p><strong>Total Staked</strong></p>
                  <p>2 DAI</p>
                  <p>25 $</p>
                </div>
                <div className="rewards-FAM-earned">
                  <p><strong>FAM earned</strong></p>
                  <p>13 FAM</p>
                  <p>230 $</p>
                </div>
                <div className="rewards-FAM-price">
                  <p><strong>FAM prices</strong></p>
                  <p>100 $</p>
                  <p>130 ETH</p>
                </div>
              </div>
              <Button color='purple' className="rewards-button" floated='right'>
                Unstake
              </Button>
            </Card.Content>
          </Card>
        </Card.Group>
      </Segment>
      
    </section>
  );
}

// == Export
export default Rewards;
