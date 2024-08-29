import React from 'react';
import '../styles/Projects.css';

const projects = [
    { image: '../assets/project1.png', title: 'Solar Farm', location: 'California', achievements: 'Reduced CO2 emissions by 30%' },
    { image: '../assets/project2.png', title: 'Wind Turbines', location: 'Texas', achievements: 'Powered 10,000 homes' },
];

const Projects = () => {
    return (
        <section className="projects">
            <h2>Our Projects</h2>
            <div className="projects-slider">
                {projects.map((project, index) => (
                    <div className="project-card" key={index}>
                        <img src={project.image} alt={project.title} />
                        <h3>{project.title}</h3>
                        <p>{project.location}</p>
                        <p>{project.achievements}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
