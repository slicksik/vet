import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import VetProfile from './pages/VetProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import VetDashboard from './pages/VetDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import SubscriptionPage from './pages/Subscription';
import ForVets from './pages/ForVets';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/vet/:id" element={<VetProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<VetDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/for-vets" element={<ForVets />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
