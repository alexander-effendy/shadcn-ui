import * as React from 'react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from "firebase/auth";
import { auth } from '@/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useNavigate, useLocation } from 'react-router-dom';

const classNameInput = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed border-slate-200 border-opacity-20 focus:border-white";

const loadingOverlayStyle = {
  color: '#fff', 
  zIndex: (theme: any) => theme.zIndex.drawer + 1
};

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const SignUp: React.FC = () => {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();
  const location = useLocation();3
  const {search} = location;

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');

  const [infoMsg, setInfoMsg] = React.useState('');

  const [initialLoading, setInitialLoading] = React.useState(false);
  const [initialError, setInitialError] = React.useState('');

  React.useEffect( () => {
    if (user) {
      console.log(user);
      // user is already signed in
      navigate('/');
    } else {
      // user is not signed in but the link is valid
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // now in case user clicks the email link on a different device, we will ask for email confirmation
        let email = localStorage.getItem('email');
        if (!email) {
          email = window.prompt('Please provide your email'); 
        }
        // after that we will complete the sign in process
        setInitialLoading(true);
        signInWithEmailLink(auth, localStorage.getItem('email'), window.location.href)
          .then((result) => {
            // we can get the user from the result
            console.log(result.user);
            localStorage.removeItem('email');
            setInitialError('');
          }).catch(err => {
            setInitialLoading(false);
            setInitialError(err.message);
            navigate('/');
          })
      } else {

      }
    }
  }, [user, search, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoginLoading(true);
    // AUTHENTICATION USING FIREBASE
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
        setLoginLoading(false);
        navigate('/');
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setLoginLoading(false);
        if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
          setLoginError('Email is already in used');
        } else if (errorMessage === 'Firebase: Error (auth/missing-email).') {
          setLoginError('Please fill in the email')
        }
        
        // ..
      });
  }
  const handleEmailLink = (e: any) => {
    e.preventDefault();
    console.log(`email inserted is ${email}`)
    setLoginLoading(true);
    sendSignInLinkToEmail(auth, email, {
      // link to go to after user click the link on mailbox
      url: 'http://localhost:5173/signin',
      handleCodeInApp: true,
    }).then(() => {
      localStorage.setItem('email', email);
      setLoginLoading(false);
      setLoginError('');
      setInfoMsg('We have sent you an email with a link');
    }).catch(err => {
      setLoginLoading(false);
      setLoginError(err.message);
    })
  }

  return (
    <div className="h-screen bg-black grid place-items-center">
      
        <>
        <Backdrop sx={loadingOverlayStyle} open={initialLoading}><CircularProgress color="inherit" /></Backdrop>
        <Backdrop sx={loadingOverlayStyle} open={loginLoading}><CircularProgress color="inherit" /></Backdrop>
        
          {initialError !== '' ? (
            <div className='error-msg'>{initialError}</div>
          ) : (
            <>
              {user ? (
                <div>Please wait...</div>
              ) : (
                <form className="mx-auto w-96 p-5 text-white flex flex-col gap-4 border border-white border-opacity-20 rounded-lg">
                  <div className="text-xl grid place-items-center">Welcome to ZenTask</div>
                  <div className="flex flex-col gap-2">

                  <div>Email</div>
                    <input type="text" className={cn(classNameInput)} onChange={handleEmailChange}/>
                  </div>

                  <div className="flex flex-col gap-2">
                  <div>Password</div>
                    <input type="password" className={cn(classNameInput)} onChange={handlePasswordChange}/>
                  </div>

                  
                  {infoMsg !== '' && (
                    <div className='text-green-600 info-msg'>{infoMsg}</div>
                  )}
                  {loginError !== '' && (
                    <div className='text-red-500 error-msg'>{loginError}</div>
                  )}

                  <HoverCard>
                  <HoverCardTrigger>

                    

                  <Button 
                    className="w-full grid" 
                    variant="secondary" 
                    onClick={handleSubmit}
                  >
                    Sign In
                  </Button>
                  </HoverCardTrigger>

                  <HoverCardContent>
                    Are you ready to submit?
                  </HoverCardContent>
                   </HoverCard>                
                  <Button 
                    variant="destructive" 
                    onClick={handleEmailLink}
                  >
                    Sign in with email
                  </Button>
                  <div className="flex gap-1 w-full justify-center">
                    Don't have an account? <div className='cursor-pointer underline' onClick={() => navigate('/signup')}>Sign Up</div>
                  </div>
                </form>    
              )}
            </>
          )}
        </>
      

      
    </div>
  )
}

export default SignUp;

