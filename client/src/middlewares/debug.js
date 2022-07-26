const debugMiddleWare = (store) => (next) => (action) => {
  switch (action.type) {
    default:
      console.log('DEBUG MIDDLEWARE : ' + action.type);
      next(action);
      break;
  }
};

export default debugMiddleWare;