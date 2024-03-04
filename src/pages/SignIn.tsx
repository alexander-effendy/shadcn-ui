import * as React from 'react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from "firebase/auth";
import { auth } from '@/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { useNavigate, useLocation } from 'react-router-dom';

const classNameInput = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed border-slate-200 border-opacity-20 focus:border-white";

const SignIn: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const {search} = location;
  const [email, setEmail] = React.useState<string>('');

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');

  const [infoMsg, setInfoMsg] = React.useState('');

  const [initialLoading, setInitialLoading] = React.useState(false);
  const [initialError, setInitialError] = React.useState('');
  React.useEffect( () => {
    if (user) {
      // user is already signed in
      navigate('/signin');
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleEmailLink = (e: any) => {
    e.preventDefault();
    console.log(`email inserted is ${email}`)
    setLoginLoading(true);
    sendSignInLinkToEmail(auth, email, {
      // link to go to after user click the link on mailbox
      url: 'http://localhost:5174/signin',
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
      {initialLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {initialError !== '' ? (
            <div className='error-msg'>{initialError}</div>
          ) : (
            <>
              {user ? (
                <div>Please wait...</div>
              ) : (
                <form className="mx-auto w-96 p-5 text-white flex flex-col gap-4 border border-white border-opacity-20 rounded-lg">
                  <div className="text-xl grid place-items-center">Create an account</div>
                  <div className="flex flex-col gap-2">
                  <div>Email</div>
                    <input type="text" className={cn(classNameInput)} onChange={handleEmailChange}/>
                  </div>
                
                  <Button 
                    variant="secondary" 
                    onClick={handleEmailLink}
                  >
                    Sign in with email
                  </Button>
                  {loginLoading ? (
                    <span>Logging you in</span>
                  ) : (
                    <span>Login</span>
                  )}
                  {loginError !== '' && (
                    <div className='error-msg'>{loginError}</div>
                  )}
                  {infoMsg !== '' && (
                    <div className='info-msg'>{infoMsg}</div>
                  )}
                </form>    
              )}
            </>
          )}
        </>
      )}

      
    </div>
  )
}

export default SignIn;

