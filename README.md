# Family Staking Dapp

DAPP de staking permettant de gagner des rewards en FAM

Tous les contrats ont été déployé sur Kovan

Deux oracles Chainlink disponibles :
- ETH/USD
- DAI/USD

Ces deux oracles fallbacks vers des valeurs par defaut si utilisation sur Ganache.

3 contrats de Staking :
- ETH
- DAI
- FAM

1 Token de reward :
- FAM - valeur fixée à 7,5€

## Comment utiliser le protocol

1. Connectez votre wallet
2. Assurez vous d'être sur le réseau **Kovan**
3. Choisissez le token que vous souhaitez staker
4. Pour le DAI (Fake DAI) & FAM (token du protocol), vous pouvez utiliser le faucet mit à disposition. Vous pouvez staker [du kETH](https://faucets.chain.link/)
5. Entez le nombre de token à staker. ça va déclencher 2 fonctions : 
    1. Une pour autoriser le protocol à déplacer le nombre de tokens souhaité
    2. Une seconde pour les déplacer
6. Vous pouvez regarder l'historique des stakes et unstake sur l'onglet "History"
7. Vous pouvez consulter vos stakes dans l'onglet "Rewards"
8. Vous pouvez unstake vos tokens à partir de cette page. Notez cependant qu'il vous faudra attendre un minimum de 2 jours avant de pouvoir retirer vos tokens
9. Lorsque vous retirez vos tokens, les rewards (en token FAM) seront envoyés sur votre wallet !
10. Enjoy and make millions of (fake) dollars 🚀

## Lien Github Page
https://remitekky.github.io/Family-staking/

## Vidéo
https://www.loom.com/share/80ec017024204d5890ffc99ee78ec151

## Equipe :
- Maud Hutchinson - FAM token, FAM Staking
- Remi Sulpice - Front, DAI token, DAI Staking
- Yohann Youssouf - ETH Staking, Chainlink Datafeeds, Front
