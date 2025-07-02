import React from 'react';
import CreateUserForm from './components/CreateUserForm';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Real Estate App</h1>
      <CreateUserForm />
    </div>
  );
};

export default App;