export const initialState = {
  'eth': {
    'value': {
      'dollar': 120,
    }
  },
  'dai': {
    'value': {
      'dollar': 50,
    }
  },
  'fam': {
    'value': {
      'dollar': 100,
    }
  },
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;