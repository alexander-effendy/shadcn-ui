import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-black text-white grid place-items-center text-6xl">
      This is Dashboard
      <button onClick={() => navigate('./SignIn')}>Sign In</button>
    </div>
  )
}

export default Dashboard;