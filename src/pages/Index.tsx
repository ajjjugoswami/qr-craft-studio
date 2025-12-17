import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard (auth will be handled separately)
  return <Navigate to="/dashboard" replace />;
};

export default Index;