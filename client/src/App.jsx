import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HostEvent from './pages/HostEvent';
import EventList from './pages/EventList';
import MyEvents from './pages/myEvents';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host-event" element={<HostEvent />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/my-events" element={<MyEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
