import React from 'react';
import '../styles/Services.css';

const services = [
    { icon: '../assets/icon.png', title: 'Solar Energy', description: 'Harness the power of the sun.' },
    { icon: '../assets/icon.png', title: 'Wind Energy', description: 'Utilize wind to generate power.' },
    { icon: '../assets/icon.png', title: 'Recycling', description: 'Reduce, reuse, and recycle.' },
];

const Services = () => {
    return (
        <section className="services">
            <h2>Our Services</h2>
            <div className="services-container">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <img src={service.icon} alt={service.title} />
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
