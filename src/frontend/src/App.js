import React from 'react';
import './App.css';

function App() {
  const [message, setMessage] = React.useState('Loading...');

  React.useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(`App is running! Server status: ${data.status}`))
      .catch(err => setMessage('Error connecting to server'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Auto-Generated App</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
