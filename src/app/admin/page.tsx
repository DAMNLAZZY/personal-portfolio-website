'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('content');
  const [data, setData] = useState<any>({
    content: null,
    skills: [],
    projects: [],
    certifications: [],
    experience: [],
    blog: []
  });
  
  // State for tracking which skill is currently being edited
  const [editSkillId, setEditSkillId] = useState<number | null>(null);

  // States for file uploads and controlled URL inputs
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [newProjectImage, setNewProjectImage] = useState('');
  const [newCertImage, setNewCertImage] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchData = async () => {
    const [contentRes, skillsRes, projectsRes, certsRes, expRes, blogRes] = await Promise.all([
      fetch('/api/content').then(res => res.json()),
      fetch('/api/skills').then(res => res.json()),
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/certifications').then(res => res.json()),
      fetch('/api/experience').then(res => res.json()),
      fetch('/api/blog').then(res => res.json())
    ]);

    setData({
      content: contentRes.data,
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      certifications: certsRes.data || [],
      experience: expRes.data || [],
      blog: blogRes.data || []
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.content) {
      setImageUrl(data.content.image_url || '');
      setResumeUrl(data.content.resume_url || '');
    }
  }, [data.content]);

  const handleFileUpload = async (e: any, setUrl: (url: string) => void, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldKey);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setUrl(result.url);
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(null);
    }
  };

  const fetchSpecific = async (tabKey: string, endpoint: string) => {
    const res = await fetch(endpoint).then(r => r.json());
    setData((prev: any) => ({ ...prev, [tabKey]: res.data || [] }));
  };

  const handleContentSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      title: formData.get('title'),
      about: formData.get('about'),
      image_url: formData.get('image_url'),
      resume_url: formData.get('resume_url')
    };
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Content saved!');
    const contentRes = await fetch('/api/content').then(res => res.json());
    setData((prev: any) => ({ ...prev, content: contentRes.data }));
  };

  const handleAdd = async (e: any, endpoint: string, tabKey: string) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    e.target.reset();
    fetchSpecific(tabKey, endpoint);
  };

  const handleDelete = async (id: number, endpoint: string, tabKey: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
    fetchSpecific(tabKey, endpoint);
  };

  const handleEditSkill = async (e: any, id: number) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      id,
      name: formData.get('name'),
      level: formData.get('level'),
      category: formData.get('category')
    };
    
    await fetch('/api/skills', {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    setEditSkillId(null);
    fetchSpecific('skills', '/api/skills');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div className="admin-nav">
          <button className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>General Content</button>
          <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>Skills</button>
          <button className={activeTab === 'experience' ? 'active' : ''} onClick={() => setActiveTab('experience')}>Experience</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects</button>
          <button className={activeTab === 'certifications' ? 'active' : ''} onClick={() => setActiveTab('certifications')}>Certifications</button>
          <button className={activeTab === 'blog' ? 'active' : ''} onClick={() => setActiveTab('blog')}>Daily Blog</button>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <a href="/" className="btn btn-primary" style={{ width: '100%' }}>View Site</a>
        </div>
      </div>
      
      <div className="admin-content">
        
        {/* Content Tab */}
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
                <div className="form-group">
                  <label>Profile Image URL</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input name="image_url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
                    <label className="btn" style={{ border: '1px solid var(--border-color)', margin: 0, whiteSpace: 'nowrap', cursor: 'pointer', backgroundColor: 'var(--card-bg)' }}>
                      {uploading === 'image_url' ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setImageUrl, 'image_url')} />
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Resume URL</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input name="resume_url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="/uploads/resume.pdf" />
                    <label className="btn" style={{ border: '1px solid var(--border-color)', margin: 0, whiteSpace: 'nowrap', cursor: 'pointer', backgroundColor: 'var(--card-bg)' }}>
                      {uploading === 'resume_url' ? 'Uploading...' : 'Upload Resume'}
                      <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setResumeUrl, 'resume_url')} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : <p>Loading...</p>}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Skill</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/skills', 'skills')}>
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
              <div key={skill.id} className="list-item" style={{ display: 'block' }}>
                {editSkillId === skill.id ? (
                  <form onSubmit={(e) => handleEditSkill(e, skill.id)} style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                    <input name="name" defaultValue={skill.name} required style={{ flex: 1 }} />
                    <input name="level" type="number" defaultValue={skill.level} min="0" max="100" required style={{ width: '80px' }} />
                    <input name="category" defaultValue={skill.category} placeholder="Category" style={{ flex: 1 }} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
                    <button type="button" onClick={() => setEditSkillId(null)} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <strong>{skill.name}</strong> - {skill.level}% <br/>
                      <small style={{color: 'var(--text-muted)'}}>{skill.category}</small>
                    </div>
                    <div className="list-item-actions">
                      <button onClick={() => setEditSkillId(skill.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Edit</button>
                      <button onClick={() => handleDelete(skill.id, '/api/skills', 'skills')} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add Experience</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/experience', 'experience')}>
                <div className="form-group">
                  <label>Company / Organization</label>
                  <input name="company" required />
                </div>
                <div className="form-group">
                  <label>Role / Position</label>
                  <input name="role" required />
                </div>
                <div className="form-group">
                  <label>Duration (e.g., Jan 2023 - Present)</label>
                  <input name="duration" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows={3} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Experience</button>
              </form>
            </div>

            <h3>Existing Experience</h3>
            <br/>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="list-item">
                <div>
                  <strong>{exp.role}</strong> at {exp.company}<br/>
                  <small style={{color: 'var(--text-muted)'}}>{exp.duration}</small>
                </div>
                <button onClick={() => handleDelete(exp.id, '/api/experience', 'experience')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Project</h3>
              <br/>
              <form onSubmit={async (e) => {
                await handleAdd(e, '/api/projects', 'projects');
                setNewProjectImage('');
              }}>
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
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input name="image" value={newProjectImage} onChange={(e) => setNewProjectImage(e.target.value)} placeholder="https://..." />
                    <label className="btn" style={{ border: '1px solid var(--border-color)', margin: 0, whiteSpace: 'nowrap', cursor: 'pointer', backgroundColor: 'var(--card-bg)' }}>
                      {uploading === 'project_image' ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setNewProjectImage, 'project_image')} />
                    </label>
                  </div>
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
                <button onClick={() => handleDelete(proj.id, '/api/projects', 'projects')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Certification</h3>
              <br/>
              <form onSubmit={async (e) => {
                await handleAdd(e, '/api/certifications', 'certifications');
                setNewCertImage('');
              }}>
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
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input name="badge_image_url" value={newCertImage} onChange={(e) => setNewCertImage(e.target.value)} placeholder="https://..." />
                    <label className="btn" style={{ border: '1px solid var(--border-color)', margin: 0, whiteSpace: 'nowrap', cursor: 'pointer', backgroundColor: 'var(--card-bg)' }}>
                      {uploading === 'cert_image' ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setNewCertImage, 'cert_image')} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Certification</button>
              </form>
            </div>

            <h3>Existing Certifications</h3>
            <br/>
            {data.certifications?.map((cert: any) => (
              <div key={cert.id} className="list-item">
                <div>
                  <strong>{cert.title}</strong> by {cert.issuer}
                </div>
                <button onClick={() => handleDelete(cert.id, '/api/certifications', 'certifications')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add Daily Blog Update</h3>
              <br/>
              <form onSubmit={(e) => handleAdd(e, '/api/blog', 'blog')}>
                <div className="form-group">
                  <label>Update Title</label>
                  <input name="title" required placeholder="e.g. Deep Diving into React Compiler" />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea name="content" rows={4} required placeholder="What are you focusing on right now?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Post Update</button>
              </form>
            </div>

            <h3>Past Updates</h3>
            <br/>
            {data.blog.map((post: any) => (
              <div key={post.id} className="list-item">
                <div>
                  <strong>{post.title}</strong><br/>
                  <small style={{color: 'var(--text-muted)'}}>{post.date}</small>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{post.content.substring(0, 100)}...</p>
                </div>
                <button onClick={() => handleDelete(post.id, '/api/blog', 'blog')} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
