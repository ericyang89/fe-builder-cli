import React from 'react';
import { render } from 'react-dom';
import HotComponent from './HotComponent';

const App = () => {
  return (
    <div>
      this is a test;
      <HotComponent />
    </div>
  );
};

render(<App />, document.getElementById('app'));
