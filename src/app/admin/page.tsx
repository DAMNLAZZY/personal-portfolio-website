'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('content');
  const [data, setData] = useState<any>({
    content: null,
    skills: [],
    projects: [],
    certifications: []
  });

  const fetchData = async () => {
    const [contentRes, skillsRes, projectsRes, certsRes] = await Promise.all([
      fetch('/api/content').then(res => res.json()),
      fetch('/api/skills').then(res => res.json()),
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/certifications').then(res => res.json())
    ]);

    setData({
      content: contentRes.data,
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      certifications: certsRes.data || []
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Content
  const handleContentSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      title: formData.get('title'),
      about: formData.get('about')
    };
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Content saved!');
    fetchData();
  };

  // Handlers for Add/Delete
  const handleAdd = async (e: any, endpoint: string) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    e.target.reset();
    fetchData();
  };

  const handleDelete = async (id: number, endpoint: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div className="admin-nav">
          <button className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>General Content</button>
          <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>Skills</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects</button>
          <button className={activeTab === 'certifications' ? 'active' : ''} onClick={() => setActiveTab('certifications')}>Certifications</button>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <a href="/" className="btn btn-primary" style={{ width: '100%' }}>View Site</a>
        </div>
      </div>
      
      <div className="admin-content">
        
        {activeTab === 'content' && (
          <div className="card">
            <h3>Edit General Content</h3>
            <br/>
            {data.content ? (
              <form onSubmit={handleContentSave}>
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" defaultValue={data.content.name || ''} required />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" defaultValue={data.content.title || ''} required />
                </div>
                <div className="form-group">
                  <label>About Me</label>
                  <textarea name="about" rows={6} defaultValue={data.content.about || ''} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : <p>Loading...</p>}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Skill</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/skills')}>
                <div className="form-group">
                  <label>Skill Name</label>
                  <input name="name" required placeholder="e.g. React.js" />
                </div>
                <div className="form-group">
                  <label>Proficiency Level (%)</label>
                  <input name="level" type="number" min="0" max="100" required placeholder="80" />
                </div>
                <div className="form-group">
                  <label>Category (optional)</label>
                  <input name="category" placeholder="Frontend, Backend, etc." />
                </div>
                <button type="submit" className="btn btn-primary">Add Skill</button>
              </form>
            </div>

            <h3>Existing Skills</h3>
            <br/>
            {data.skills.map((skill: any) => (
              <div key={skill.id} className="list-item">
                <div>
                  <strong>{skill.name}</strong> - {skill.level}% <br/>
                  <small style={{color: 'var(--text-muted)'}}>{skill.category}</small>
                </div>
                <button onClick={() => handleDelete(skill.id, '/api/skills')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Project</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/projects')}>
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows={3} required></textarea>
                </div>
                <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input name="image" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Project Link (optional)</label>
                  <input name="link" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input name="tags" placeholder="React, Node, etc." />
                </div>
                <button type="submit" className="btn btn-primary">Add Project</button>
              </form>
            </div>

            <h3>Existing Projects</h3>
            <br/>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="list-item">
                <div>
                  <strong>{proj.title}</strong><br/>
                  <small style={{color: 'var(--text-muted)'}}>{proj.description.substring(0, 60)}...</small>
                </div>
                <button onClick={() => handleDelete(proj.id, '/api/projects')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Certification</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/certifications')}>
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" required />
                </div>
                <div className="form-group">
                  <label>Issuer (e.g. Coursera, Credly)</label>
                  <input name="issuer" required />
                </div>
                <div className="form-group">
                  <label>Date / Year</label>
                  <input name="date" />
                </div>
                <div className="form-group">
                  <label>Credential URL</label>
                  <input name="url" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Badge Image URL (optional)</label>
                  <input name="badge_image_url" placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-primary">Add Certification</button>
              </form>
            </div>

            <h3>Existing Certifications</h3>
            <br/>
            {data.certs?.map((cert: any) => (
              <div key={cert.id} className="list-item">
                <div>
                  <strong>{cert.title}</strong> by {cert.issuer}
                </div>
                <button onClick={() => handleDelete(cert.id, '/api/certifications')} className="btn btn-danger">Delete</button>
              </div>
            ))}
            {/* The mapping below fixes a typo `certs` -> `certifications` */}
            {data.certifications?.map((cert: any) => (
              <div key={cert.id} className="list-item">
                <div>
                  <strong>{cert.title}</strong> by {cert.issuer}
                </div>
                <button onClick={() => handleDelete(cert.id, '/api/certifications')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
