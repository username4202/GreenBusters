import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 GreenBusters. All rights reserved.</p>
            <div className="social-icons">
                <a href="#facebook"><img src="/assets/facebook-icon.png" alt="Facebook" /></a>
                <a href="#twitter"><img src="/assets/twitter-icon.png" alt="Twitter" /></a>
                <a href="#instagram"><img src="/assets/instagram-icon.png" alt="Instagram" /></a>
            </div>
        </footer>
    );
};

export default Footer;
