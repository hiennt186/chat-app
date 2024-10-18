import React from 'react';
import './App.css';
import SignIn from './components/SignIn';
import ChatRoom from './components/ChatRoom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Notifications from './components/Notifications';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Notifications />
      <header>
        <h1>React Firebase Chat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
