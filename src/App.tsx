import React from 'react';
import CreateUserForm from './components/CreateUserForm';
import CreatePropertyForm from './components/CreatePropertyForm';
import CreateUnitForm from './components/CreateUnitForm';
import CreateLeaseForm from './components/CreateLeaseForm';
import CreatePaymentForm from './components/CreatePaymentForm';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏢 Real Estate Management</h1>

      <section>
        <h2>Create User</h2>
        <CreateUserForm />
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Create Property</h2>
        <CreatePropertyForm />
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Create Unit</h2>
        <CreateUnitForm />
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Create Lease</h2>
        <CreateLeaseForm />
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Log Rent Payment</h2>
        <CreatePaymentForm />
      </section>
    </div>
  );
};

export default App;