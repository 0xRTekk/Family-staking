export const initialState = {
  logged: false,
  account: null,
  stakeInputValue: '',
  unstakeInputValue: '',
  tokens: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      apr: 0.039,
      price: 1602,
      totalStaked: 0,
      stakedBalance: 0,
      estimatedFAMRewards: 0,
      initialStakingDate: null,
      earnedFAM: 0,
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      apr: 0.027,
      price: 1,
      totalStaked: 0,
      stakedBalance: 0,
      estimatedFAMRewards: 0,
      initialStakingDate: null,
      earnedFAM: 0,
    },
    {
      name: 'Family token',
      symbol: 'FAM',
      apr: 0.1,
      price: 17,
      totalStaked: 0,
      stakedBalance: 0,
      estimatedFAMRewards: 0,
      initialStakingDate: null,
      earnedFAM: 0,
    },
  ],
  depositEvents: [],
  withdrawEvents: [],
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'CHANGE_STAKING_VALUE':
      return {
        ...state,
        stakeInputValue: action.value,
      }
    case 'CHANGE_UNSTAKING_VALUE':
      return {
        ...state,
        unstakeInputValue: action.value,
      }
    case 'STAKE': {
      // On recup le token FAM
      const FAMToken = state.tokens.find((token) => token.symbol === "FAM");
      // On recup le token a stake
      const tokenToStake = state.tokens.find((token) => token.symbol === action.token);
      // On rajoute le montant a stake
      tokenToStake.totalStaked += parseInt(state.stakeInputValue);
      // Calcul des estimated rewards en FAM
      tokenToStake.estimatedFAMRewards = (tokenToStake.price * tokenToStake.totalStaked * tokenToStake.apr) / FAMToken.price;
      // Nouvelle version du state.tokens sans le token à rajouter
      const newStateTokens = state.tokens.filter((token) => token.symbol !== action.token);
      newStateTokens.push(tokenToStake);
      
      return {
        ...state,
        stakeInputValue: '',
        tokens: [
          ...newStateTokens
        ]
      }
    }
    case 'UNSTAKE': {
      const tokenToUnstake = state.tokens.find((token) => token.symbol === action.token);
      tokenToUnstake.totalStaked = tokenToUnstake.totalStaked - Number(state.unstakeInputValue);
      tokenToUnstake.estimatedFAMRewards = 0;
      // TODO: Fonction calcul rewards 
      tokenToUnstake.earnedFAM += 0.04712;
      // Nouvelle version du state.tokens sans le token à rajouter
      const newStateTokens = state.tokens.filter((token) => token.symbol !== action.token);
      newStateTokens.push(tokenToUnstake);
      return {
        ...state,
        unstakeInputValue: '',
        tokens: [
          ...newStateTokens
        ]
      }
    }
    case 'DEPOSIT_EVENT': {
      return {
        ...state,
        depositEvents: [
          ...state.depositEvents,
          action.event,
        ]
      }
    }
    case 'GET_PAST_DEPOSIT_EVENTS': {
      return {
        ...state,
        depositEvents: action.events,
      }
    }
    case 'UPDATE_STAKED_AMOUNTS': {
      // On recup le token a update
      const tokenToUpdate = state.tokens.find((token) => token.symbol === action.token.symbol);
      // On rajoute le montant a stake
      tokenToUpdate.totalStaked += parseInt(action.token.totalStaked);
      tokenToUpdate.stakedBalance = parseInt(action.token.stakedBalance);
      // Nouvelle version du state.tokens sans le token à rajouter
      const newStateTokens = state.tokens.filter((token) => token.symbol !== action.token.symbol);
      newStateTokens.push(tokenToUpdate);
      return {
        ...state,
        tokens: [
          ...newStateTokens,
        ],
      }
    }
    case 'UPDATE_RATES': {
      // On recup le token a update
      const tokenToUpdate = state.tokens.find((token) => token.symbol === action.token.symbol);
      // On rajoute le montant a stake
      tokenToUpdate.price = parseFloat(parseFloat(action.token.price / 10**18).toFixed(2));
      // Nouvelle version du state.tokens sans le token à rajouter
      const newStateTokens = state.tokens.filter((token) => token.symbol !== action.token.symbol);
      newStateTokens.push(tokenToUpdate);
      return {
        ...state,
        tokens: [
          ...newStateTokens,
        ],
      }
    }
    case 'GET_PAST_WITHDRAW_EVENTS': {
      return {
        ...state,
        withdrawEvents: action.events,
      }
    }
    default:
      return state;
  }
};

export default reducer;