/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleIcon from "../../assets/googleIcon.svg";
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
} from "../../firebaseConfig";
import "./ButtonGoogle.css";

function GoogleLoginButton({ onSuccess, onError }: any) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login com o Google (componente GoogleLoginButton):",
        error
      );
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="button-google">
      <img src={GoogleIcon} alt="" />
      <span>Entre com sua conta Google</span>
    </button>
  );
}

export default GoogleLoginButton;
