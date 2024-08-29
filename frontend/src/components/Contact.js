import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <section className="contact">
            <h2>Contact Us</h2>
            <form className="contact-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit">Send Message</button>
            </form>
        </section>
    );
};

export default Contact;
