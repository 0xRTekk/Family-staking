import { useEffect } from 'react';
import { Image, Header, Button, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
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
        Bienvenue sur la plateforme <strong>Family Staking</strong> 👨‍👩‍👧‍👦
        <Header.Subheader className="hero-subtitle">
          Le <a href="<a href='https://sepolia.etherscan.io/address/0x99FdAf84F3aD77D041A99a80a6FEA895f3F6E15c' target='_blank'>">FMLY token</a> est un ERC20 crée pour cette Dapp. Ce token n'a aucune valeur hormis didactique.<br />
          Vous pouvez en recupérer grâce au faucet mit à votre disposition.<br />
          Une fois en votre possession, vous pouvez les staker dans le smart contract afin de générer des récompenses ! 🤑
        </Header.Subheader>
        <Divider />
        <Header.Subheader className="hero-subtitle">
          <ol>
            <li>Connectez votre wallet</li>
            <li>Assurez vous d'être sur le réseau <strong>Sepolia</strong></li>
            <li>Assurez vous d'avoir quelques fake ETH du réseau : <a href='https://sepoliafaucet.com/' target='_blank'>Sepolia Faucet ETH</a></li>
            <li>Recupérez quelques FMLY gâce au faucet mit à votre disposition</li>
            <li>Rendez-vous sur la page de staking</li>
            <li>Approuver le smart contract de staking à bloquer la quantité désirée de vos FMLY</li>
            <li>Staker les</li>
            <li>Attendez un peu</li>
            <li>Recupérer vos FMLY stake et vos rewards en plus 🚀</li>
          </ol>
        </Header.Subheader>

        <div className="hero-actions">
        {isConnected ? (
          <>
            <Button color='purple' size='massive' className="hero-button" onClick={callFaucet}>
              Faucet FMLY
            </Button>
            <Button color='purple' size='massive' className="hero-button">
              <Link to="/Family-staking/stake">
                Stake Now
              </Link>  
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
