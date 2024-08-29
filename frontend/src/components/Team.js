import React from 'react';
import '../styles/Team.css';

const teamMembers = [
    { name: 'Alice Green', role: 'CEO', avatar: '/assets/avatar1.png' },
    { name: 'Bob Blue', role: 'CTO', avatar: '/assets/avatar2.png' },
];

const Team = () => {
    return (
        <section className="team">
            <h2>Meet the Team</h2>
            <div className="team-container">
                {teamMembers.map((member, index) => (
                    <div className="team-member" key={index}>
                        <img src={member.avatar} alt={member.name} />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
