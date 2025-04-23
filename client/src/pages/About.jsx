import { useState } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaTelegram,
  FaDiscord,
  FaYoutube,
} from "react-icons/fa6";
import "./About.css";

export default function Contact() {
  const [email, setEmail] = useState("");

  return (
    <div className="contact-container">
      <div className="contact-section">
        <h2>📩 How to Contact Eventhon</h2>
        <p>
          Find all details about our tech events, hackathons, and networking
          opportunities on our official portal.
        </p>
        <p>
          For any queries, reach out to us through our support system. Please
          note that we do not provide telephone support.
        </p>

        <h3>🛠️ Support</h3>
        <p>
          For any assistance regarding Eventhon, click the ‘support’ button on
          our event pages.
        </p>
        <p>
          Alternatively, submit a request directly. Please check our FAQ before
          reaching out.
        </p>
        <p>
          Stay updated with our latest event announcements by following our
          social media channels.
        </p>
        <p>If you have any concerns, check our support guidelines.</p>

        <h3>🤝 Want to Host an Event?</h3>
        <p>
          Partner with Eventhon to organize impactful hackathons and technical
          events.
        </p>
        <p>
          Fill out our partnership form and collaborate with us to create
          amazing experiences.
        </p>

        <h3>🏢 Corporate Engagement</h3>
        <p>
          Upskill your workforce by hosting tech events with Eventhon. We help
          companies engage with top talent in the industry.
        </p>
        <p>Contact us today to explore opportunities with Eventhon.</p>

        <h3>📣 Share Your Eventhon Experience</h3>
        <p>
          We would love to feature your story on our platform. Share your
          experiences by filling out our success story form.
        </p>
        <p>
          Follow us on X, LinkedIn, Telegram, and YouTube to stay updated.
        </p>
      </div>

      <div className="brand-block">
        <h1>Eventhon</h1>
        <p>Bringing tech enthusiasts together, worldwide.</p>
      </div>

      <div className="contact-info">
        <h2>📬 Stay Connected</h2>
        <p>
          <strong>Event Inquiries:</strong> contact@eventhon.com
        </p>
        <p>📞 +91-9311777388 (Mon to Fri, 9 AM to 6 PM)</p>
        <p>
          <strong>Support:</strong> support@eventhon.com
        </p>
      </div>

      <div className="social-icons">
        <FaInstagram />
        <FaLinkedin />
        <FaXTwitter />
        <FaTelegram />
        <FaDiscord />
        <FaYoutube />
      </div>

      <div className="newsletter-section">
        <h2>📨 Stay Updated</h2>
        <p>Subscribe for updates on upcoming tech events and hackathons.</p>
        <div className="newsletter-input">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button>➤</button>
        </div>
      </div>
    </div>
  );
}
