import React from 'react';
import '../styles/CoreValues.css';

const values = [
    { title: 'Sustainability', description: 'We prioritize long-term environmental health.' },
    { title: 'Innovation', description: 'We push the boundaries of green technology.' },
    { title: 'Community', description: 'We build better futures together.' },
];

const CoreValues = () => {
    return (
        <section className="core-values">
            <h2>Our Core Values</h2>
            <div className="values-container">
                {values.map((value, index) => (
                    <div className="value-card" key={index}>
                        <h3>{value.title}</h3>
                        <p>{value.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CoreValues;
