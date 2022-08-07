// == Import
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Segment, Card, Button } from 'semantic-ui-react';
import './rewards.scss';

// == Composant
function Rewards() {
  const dispatch = useDispatch();
  const tokens = useSelector((state) => state.tokens);
  const FAM = tokens.find((token) => token.symbol === "FAM");

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
          {tokens.map((token) => {
            return (
              <Card color='purple' key={token.symbol}>
                <Card.Content className="rewards-datas-inner">
                  <div className="rewards-datas">
                    <div className="rewards-token">
                      <p><strong>{token.symbol}</strong></p>
                    </div>
                    <div className="rewards-total-staked">
                      <p><strong>Total Staked</strong></p>
                      <p>{Web3.utils.fromWei(Web3.utils.toBN(token.totalStaked), 'ether')} ETH</p>
                      <p>{Web3.utils.fromWei(Web3.utils.toBN(token.totalStaked), 'ether') * token.price} $</p>
                    </div>
                    {
                      // <div className="rewards-FAM-earned">
                      //   <p><strong>Estimated FAM to earn</strong></p>
                      //   <p>{Web3.utils.fromWei(Web3.utils.toBN(token.earnedFAM), 'ether')} FAM</p>
                      //   <p>{Web3.utils.fromWei(Web3.utils.toBN(token.earnedFAM), 'ether') * FAM.price} $</p>
                      // </div>
                  }
                    <div className="rewards-FAM-price">
                      <p><strong>FAM price</strong></p>
                      <p>{FAM.price} $</p>
                    </div>
                  </div>
                  <Button
                    color='purple'
                    className="rewards-button"
                    floated='right'
                    as={Link}
                    to={`/Family-staking/unstake/${token.symbol}`}
                    >
                    Unstake
                  </Button>
                </Card.Content>
              </Card>
            )
          })}
        </Card.Group>
      </Segment>
      
    </section>
  );
}

// == Export
export default Rewards;
