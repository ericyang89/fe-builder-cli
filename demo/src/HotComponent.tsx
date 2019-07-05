import { hot } from 'react-hot-loader/root'; // the hot should be import before react
import React from 'react';

const Index = () => {
  return (
    <div>
      this is hot component, you can do the ou can do the ou can do the ou can
      do the the to other 11112244443332{' '}
    </div>
  );
};

// need hot function to wrappe it , hot reload
export default hot(Index);
