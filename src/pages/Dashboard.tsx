import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '@/Firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogOut = (e: any) => {

    signOut(auth).then(() => {
      navigate('/signin');
    }).catch(err => {
      console.log('cannot sign outerHeight', err);
    })
    e.preventDefault();
    navigate('./signin');
  }

  return (
    <div className="w-full h-screen bg-black text-white grid place-items-center text-6xl">
      This is Dashboard
      <button onClick={handleLogOut}>log out</button>
      
    </div>
  )
}

export default Dashboard;