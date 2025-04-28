import { homeImage, homefooter } from '../assets/image/index';
import { useNavigate } from 'react-router-dom';
// import './home.css';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRole = '';


    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        } catch (err) {
            console.error("Invalid token");
        }
    }

    return (
        <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f4f8fc', minHeight: '100vh' }}>
            <div style={{
                padding: '60px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '80px'
            }}>
                <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: "center" }}>
                    <h1 style={{ fontSize: '48px', color: '#333', fontWeight: '700' }}>
                        Unlock Your Talent
                    </h1>
                    <p style={{ fontSize: '18px', color: '#666', width: "400px" }}>
                        Discover and participate in exciting events. Showcase your skills or host one yourself.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: "center" }}>
                        {userRole && userRole.includes('Organizer') && (
                            <button
                                onClick={() => navigate('/host-event')}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#00b4d8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0077b6'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00b4d8'}
                            >
                                Host an Event
                            </button>
                        )}
                        {userRole && userRole.includes('Organizer') && (
                            <button
                                onClick={() => navigate('/host-scholarship')}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#00b4d8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0077b6'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00b4d8'}
                            >
                                Host an Scholarship
                            </button>
                        )}


                        <button
                            onClick={() => navigate('/events')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#00b4d8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0077b6'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00b4d8'}
                        >
                            Get Started
                        </button>
                        {/* <button
                            onClick={() => navigate('/host')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#caf0f8',
                                color: '#333',
                                border: '1px solid #0077b6',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ade8f4'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#caf0f8'}
                        >
                            Host an Event
                        </button> */}
                    </div>
                </div>

                <div style={{
                    backgroundImage: `url(${homeImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    width: '600px',
                    height: '350px',
                }} />
            </div>

            

            {/* <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <img
                    src={homefooter}
                    alt="Footer"
                    style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }}
                />
            </div> */}
            <footer className="bg-gradient-to-r from-blue-200 to-purple-200 text-black px-8 py-12">
                <div className="max-w-7xl mx-auto">

                    {/* Top section */}
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-bold">Eventhon</h1>
                        <div className="flex items-center gap-8 text-lg font-semibold">
                            <a href="#about">About</a>
                            <a href="#organizer">Organizer</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-black mb-8" />

                    {/* Parts of Eventhon */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">Parts of Eventhon</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-xl font-bold">Blog</h3>
                                <p className="text-sm mt-1">Blog.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Tech Events Online</h3>
                                <p className="text-sm mt-1">Tech Events Online.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Scholarship</h3>
                                <p className="text-sm mt-1">Scholarship.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Fest Events</h3>
                                <p className="text-sm mt-1">Fest Event.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Non-Tech Events Online</h3>
                                <p className="text-sm mt-1">Non-Tech Events.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Competitior</h3>
                                <p className="text-sm mt-1">Competitior.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-black mb-8" />

                    {/* Bottom section */}
                    <div className="flex flex-col md:flex-row justify-between text-sm text-center">
                        <p>2025 Eventhon. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#privacy">Privacy Policy</a>
                            <a href="#terms">Terms & Conditions</a>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
