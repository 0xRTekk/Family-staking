import { useEffect, useState } from 'react';
import { Header, Card, Button, Form, Input, Divider } from 'semantic-ui-react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';
import { formatEther } from 'viem';

import { FMLYTokenAbi, FMLYTokenAddress, stakeFMLYAbi, stakeFMLYAddress } from '../../constants';
import './staking.scss';

// TODO: Add a loading state when the user click on the stake/withdraw button
// TODO: Fix the rewards display

function Stake() {

  const { address, isConnected } = useAccount();
  const [currentlyStaked, setCurrentlyStaked] = useState(0);
  const [calculatedrewards, setCalculatedRewards] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [stakers, setStakers] = useState(0);
  const [amountToStake, setAmountToStake] = useState(0);

  const balance = useBalance({
    address: address,
    token: FMLYTokenAddress,
    formatUnits: 'ether',
    suspense: true,
  });
  // console.log(balance.data.formatted);
  // console.log(balance.data.symbol);

  useEffect(() => {
    async function getCurrentlyStaked() {
      const contract = await readContract({
        address: stakeFMLYAddress,
        abi: stakeFMLYAbi,
        functionName: "stakingInfos",
        args: [address]
      });
      setCurrentlyStaked(contract[1]); // => contract[1] is the amount of FMLY staked
    };
    async function getCalculatedRewards() {
      const contract = await readContract({
          address: stakeFMLYAddress,
          abi: stakeFMLYAbi,
          functionName: "getRewards"
        });
        setCalculatedRewards(contract);
    };
    async function getTotalStaked() {
      const contract = await readContract({
        address: stakeFMLYAddress,
        abi: stakeFMLYAbi,
        functionName: "totalStaked"
      });
      setTotalStaked(contract);
    };
    async function getStakers() {
      const contract = await readContract({
        address: stakeFMLYAddress,
        abi: stakeFMLYAbi,
        functionName: "totalStaker"
      });
      setStakers(contract);
    };

    getCurrentlyStaked();
    getCalculatedRewards();
    getTotalStaked();
    getStakers();
  }, []);

  const getCalculatedRewards = async () => {
    const contract = await readContract({
      address: stakeFMLYAddress,
      abi: stakeFMLYAbi,
      functionName: "getRewards"
    });
    console.log(contract);
    setCalculatedRewards(contract);
  };

  const stakeFMLY = async () => {
    // 0. Check if the user have already approved the staking contract to spend his FMLY
    const allowance = await readContract({
      address: FMLYTokenAddress,
      abi: FMLYTokenAbi,
      functionName: "allowance",
      args: [address, stakeFMLYAddress]
    });
    console.log(allowance);

    if (allowance < BigInt(amountToStake * 10**18)) {
      // 1. Approve the staking contract to spend the user's FMLY
      const approved = await prepareWriteContract({
        address: FMLYTokenAddress,
        abi: FMLYTokenAbi,
        functionName: "approve",
        args: [stakeFMLYAddress, BigInt(amountToStake * 10**18)] 
      });
      const { approvedHash } = await writeContract(approved);
    }

    // 2. Stake FMLY
    const stake = await prepareWriteContract({
      address: stakeFMLYAddress,
      abi: stakeFMLYAbi,
      functionName: "stake",
      args: [BigInt(amountToStake * 10**18)]
    });
    const { stakeHash } = await writeContract(stake);
  };

  const withdraw = async () => {
    // 1. Withdraw FMLY
    const withdraw = await prepareWriteContract({
      address: stakeFMLYAddress,
      abi: stakeFMLYAbi,
      functionName: "withdraw"
    });
    const { withdrawHash } = await writeContract(withdraw);

  };

  return (
    <section className="stake">

      {isConnected ? (
        <>
          <Header as='h1' className="stake-title">
            Stake FMLY
            <Header.Subheader className="stake-subtitle">
              Stake FMLY token and receive FMLY rewards in return
            </Header.Subheader>
          </Header>
          <Card className="stake-card">
            <Card.Content textAlign="center">

              <Form onSubmit={stakeFMLY}>
                <Form.Field>
                  <Input
                    label={`Your balance : ${balance.data.formatted} ${balance.data.symbol}`}
                    labelPosition='right'
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => setAmountToStake(e.target.value)}
                    value={amountToStake}
                  />
                </Form.Field>

                <Button fluid color='purple' type="submit">
                  Stake Now
                </Button>
              </Form>

              <Divider />

              <Card.Description>
                <div className="stake-datas">
                  <div className='row'>
                    <p>Your FMLY currently stakes</p>
                    <p>{formatEther(currentlyStaked)} FMLY</p>
                  </div>
                  <div className="row">
                    <p>Annual percentage rate (fixed)</p>
                    <p>32 %</p>
                  </div>
                  {
                    currentlyStaked > 0 ? (
                      <div className="row">
                        <Button
                          basic
                          color='purple'
                          onClick={getCalculatedRewards}
                        >
                        Calcul your rewards</Button>
                        <p>{formatEther(calculatedrewards)} FMLY</p>
                      </div>
                    ) : ""
                  }
                  <Divider />
                  <div className="row">
                    <p>Total FMLY staked</p>
                    <p>{formatEther(totalStaked)} FMLY</p>
                  </div>
                  <div className="row">
                    <p>Stakers</p>
                    <p>{Number(stakers)}</p>
                  </div>

                  {
                    currentlyStaked > 0 ? (
                      <Button
                        basic
                        fluid
                        color='purple'
                        onClick={withdraw}
                      >
                        Withdraw
                      </Button>
                    ) : ""
                  }
                </div>
              </Card.Description>

            </Card.Content>
          </Card>
        </>
      ) : (
        <ConnectButton />
      )}
    </section>
  );
}

export default Stake;
