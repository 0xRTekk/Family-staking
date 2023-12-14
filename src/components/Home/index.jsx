import { useEffect } from 'react';
import { Image, Header, Button } from 'semantic-ui-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';

import { FMLYTokenAbi, FMLYTokenAddress } from '../../constants';
import logoEth from './logo-eth.png';
import './home.scss';


// == Composant
function Home() {

  const { address, isConnected } = useAccount();

  const callFaucet = async () => {
    console.log(address);


    const contract = await prepareWriteContract({
      address: FMLYTokenAddress,
      abi: FMLYTokenAbi,
      functionName: "faucet"
    });
    const { hash } = await writeContract(contract);
  };

  useEffect(() => {

    async function fmlyToken() {
      const contract = await readContract({
        address: FMLYTokenAddress,
        abi: FMLYTokenAbi,
        functionName: "owner"
      });
    };

    fmlyToken();
  }, []);

  return (
    <div className="hero">
      <Header as='h2' className="hero-title">
        Bienvenue sur la plateforme <strong>Family Staking</strong> 🫶
        <Header.Subheader className="hero-subtitle">
          Cette plateforme vous permet de staker des tokens <strong>FMLY</strong> pour en gagner d'avantage<br />
          🚧 Notez que cette plateforme n'existe que pour l'apprentissage du développement Blockchain.🚧<br />
          🚧Le token FMLY n'a aucune valeur et n'existe uniquement à des fins d'éducations.🚧<br />
          Adresse du token : {FMLYTokenAddress}
          </Header.Subheader>

        <div className="hero-actions">
        {isConnected ? (
          <>
            <Button color='purple' size='massive' className="hero-button" onClick={callFaucet}>
              Faucet FMLY
            </Button>
            <Button color='purple' size='massive' className="hero-button" as="a" href="/Family-staking/stake">
              Stake Now
            </Button>
          </>
        ) : (
          <ConnectButton />
        )}
        </div>

      </Header>
      <Image src={logoEth} size='large' />
    </div>
  );
}

// == Export
export default Home;
