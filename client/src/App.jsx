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
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host-event" element={<HostEvent />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/host-Scholarship" element={<HostScholarship />} />
        <Route path="/Scholarship" element={<ListScholarship />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/otp-verfy" element={<OtpVerifyPage />} />
        <Route path="/my-Scholarship" element={<MyScholarship />} />
        <Route path="/registered-events" element={<RegisteredEvents />} />
        <Route path="/update-event/:eventId" element={<HostEvent />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
