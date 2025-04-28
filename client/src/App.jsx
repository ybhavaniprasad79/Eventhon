import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HostEvent from './pages/HostEvent';
import EventList from './pages/EventList';
import MyEvents from './pages/myEvents';
import Navbar from './components/Navbar';
import HostScholarship from './pages/Scholarship'
import ListScholarship from './pages/ListScholarship';
import Contact from './pages/About';
import OtpVerifyPage from './pages/OtpVerifyPage';
import Home from './pages/Home';
import MyScholarship from './pages/MyScholarship';
import RegisteredEvents from './pages/RegisteredEvents';
import Competition from './pages/competition';
import GoogleSuccess from './components/GoogleSuccess';
function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<><Navbar/><Home /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host-event" element={<><Navbar/><HostEvent /></>} />
        <Route path="/events" element={<><Navbar/><Competition/></>} />
        <Route path="/my-events" element={<><Navbar/><MyEvents /></>} />
        <Route path="/host-Scholarship" element={<><Navbar/><HostScholarship /></>} />
        <Route path="/Scholarship" element={<><Navbar/><ListScholarship /></>} />
        <Route path="/Contact" element={<><Navbar/><Contact /></>} />
        <Route path="/otp-verfy" element={<><Navbar/><OtpVerifyPage /></>} />
        <Route path="/my-Scholarship" element={<><Navbar/><MyScholarship /></>} />
        <Route path="/registered-events" element={<><Navbar/><RegisteredEvents /></>} />
        <Route path="/update-event/:eventId" element={<><Navbar/><HostEvent /></>} /> 
        <Route path="/google-success" element={<><Navbar/><GoogleSuccess /></>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
