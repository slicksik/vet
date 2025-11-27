import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
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
    <Router>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/vet/:id" element={<VetProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/vet-dashboard" element={<VetDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/for-vets" element={<ForVets />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
