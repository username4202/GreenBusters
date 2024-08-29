import React from 'react';
import '../styles/Hero.css'; // Hero 섹션의 스타일을 여기에 추가하세요.

const Hero = () => {
    return (
        <section className="hero">
            <video className="hero-video" autoPlay muted loop>
                <source src="/assets/hero-bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-content">
                <h1>Powering a Greener Future</h1>
                <p>Join the revolution to save our planet.</p>
                <button className="cta-button">Learn More</button>
            </div>
        </section>
    );
};

export default Hero;
