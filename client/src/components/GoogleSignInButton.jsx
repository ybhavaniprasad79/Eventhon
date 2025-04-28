  import React from 'react'
  
  function GoogleSignInButton() {
    const handleGoogleSignIn = () => {
        window.location.href = "https://eventhon.onrender.com/api/auth/google";
      };
    return (
        <button onClick={handleGoogleSignIn} className="bg-red-500 text-white px-4 py-2 rounded">
        Continue with Google
      </button>
    )
  }
  
  export default GoogleSignInButton
  