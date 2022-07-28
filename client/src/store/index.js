import { createStore, applyMiddleware, compose } from 'redux';

import reducer from '../reducers';

// import debugMiddleWare from '../middlewares/debug';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  // On branche nos middlewares au store
  // applyMiddleware(debugMiddleWare),
);

const store = createStore(reducer, enhancers);

export default store;