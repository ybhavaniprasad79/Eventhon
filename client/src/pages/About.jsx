import { useState } from "react";
import emailjs from "emailjs-com";
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

  // Function to send the email
  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      email: email,
      message: `User has entered this email: ${email}`, 
    };

    // Send email via EmailJS
    emailjs
      .send(
        "service_1hyssl3",  // Your EmailJS service ID
        "template_r590vqc",  // Your EmailJS template ID
        templateParams,      // Template parameters (email and message)
        "ZZjHuzZxGL3AwZON3"    // Your EmailJS public key
      )
      .then(
        (result) => {
          alert("Query sent successfully! We'll get in touch soon.");
          setEmail(""); // Clear input field after submission
        },
        (error) => {
          alert("Failed to send query. Please try again.");
        }
      );
  };

  return (
    <div className="contact-container">
      <section className="contact-section">
        <h2>📩 How to Contact Eventhon</h2>
        <p>
          Explore all our tech events, hackathons, and networking opportunities on our official portal.
        </p>
        <p>
          For queries, reach out via our support system. Please note, we don’t offer telephone support.
        </p>

        <h3>🛠️ Support</h3>
        <p>Click the ‘support’ button on our event pages for any assistance.</p>
        <p>
          Or, submit a request directly. Make sure to check our FAQ first.
        </p>
        <p>
          Follow our social channels to stay informed on latest events.
        </p>
        <p>Questions? Review our support guidelines before reaching out.</p>

        <h3>🤝 Host an Event</h3>
        <p>Partner with Eventhon to organize hackathons and tech events.</p>
        <p>Fill out our form to start collaborating with us.</p>

        <h3>🏢 Corporate Engagement</h3>
        <p>
          Host skill-building events to engage with top tech talent in the industry.
        </p>
        <p>Contact us to explore business opportunities with Eventhon.</p>

        <h3>📣 Share Your Story</h3>
        <p>We'd love to showcase your Eventhon journey. Submit your story today!</p>
        <p>Follow us on X, LinkedIn, Telegram, YouTube and more!</p>
      </section>

      <section className="brand-block">
        <h1>Eventhon</h1>
        <p>Bringing tech enthusiasts together, worldwide.</p>
      </section>

      <section className="contact-info">
        <h2>📬 Stay Connected</h2>
        <p>
          <strong>Event Inquiries:</strong> contact@eventhon.com
        </p>
        <p>📞 +91-9311777388 (Mon to Fri, 9 AM – 6 PM)</p>
        <p>
          <strong>Support:</strong> support@eventhon.com
        </p>
      </section>

      <section className="social-icons" aria-label="Social Media Links">
        <FaInstagram title="Instagram" />
        <FaLinkedin title="LinkedIn" />
        <FaXTwitter title="X (Twitter)" />
        <FaTelegram title="Telegram" />
        <FaDiscord title="Discord" />
        <FaYoutube title="YouTube" />
      </section>

      <section className="newsletter-section">
        <h2>📨 Stay Updated</h2>
        <p>Subscribe for updates on tech events and hackathons.</p>
        <form className="newsletter-input" onSubmit={sendEmail}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Enter your email"
            required
          />
          <button type="submit">➤</button>
        </form>
      </section>
    </div>
  );
}
