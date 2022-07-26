import { combineReducers } from 'redux';

import erc20Reducer from './erc20';
import userReducer from './user';

const rootReducer = combineReducers({
  erc20: erc20Reducer,
  user: userReducer,
});

export default rootReducer;