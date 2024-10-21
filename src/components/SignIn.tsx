import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
      <button 
        onClick={signInWithGoogle} 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
