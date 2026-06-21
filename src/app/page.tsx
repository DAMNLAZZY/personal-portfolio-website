import { initDb } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0; // Disable caching so edits show up immediately

export default function Portfolio() {
  const db = initDb();
  
  // Fetch all data
  const content = db.prepare('SELECT * FROM general_info LIMIT 1').get() as any;
  const skills = db.prepare('SELECT * FROM skills ORDER BY level DESC').all() as any[];
  const projects = db.prepare('SELECT * FROM projects').all() as any[];
  const certs = db.prepare('SELECT * FROM certifications').all() as any[];
  const experience = db.prepare('SELECT * FROM experience ORDER BY id DESC').all() as any[];
  const blog = db.prepare('SELECT * FROM blog ORDER BY id DESC').all() as any[];

  return (
    <div>
      {/* Navigation */}
      <nav style={{ padding: '2rem 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '1.2rem', fontFamily: 'Outfit' }}>
            {content?.name || 'Portfolio'}
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#about" style={{ fontWeight: 500 }}>About</a>
            <a href="#skills" style={{ fontWeight: 500 }}>Skills</a>
            <a href="#experience" style={{ fontWeight: 500 }}>Experience</a>
            <a href="#projects" style={{ fontWeight: 500 }}>Projects</a>
            <a href="#blog" style={{ fontWeight: 500 }}>Blog</a>
            <Link href="/admin" style={{ color: 'var(--text-muted)' }}>Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero / About Section */}
      <section id="about" className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Hi, I'm {content?.name?.split(' ')[0] || 'There'}
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem', fontWeight: 400 }}>
              {content?.title || 'Welcome to my portfolio'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {content?.about || 'I am passionate about creating amazing experiences.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#skills" className="btn" style={{ border: '1px solid var(--border-color)' }}>My Skills</a>
              {content?.resume_url && (
                <a href={content.resume_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ border: '1px solid var(--accent)', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  📄 View Resume
                </a>
              )}
            </div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            {/* Placeholder Photo */}
            <div style={{
              width: '350px',
              height: '450px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: `url("${content?.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.9,
                filter: 'grayscale(30%) sepia(20%)'
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Technical Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 500 }}>{skill.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{skill.level}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${skill.level}%`, 
                    backgroundColor: 'var(--accent)',
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
                {skill.category && <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>{skill.category}</small>}
              </div>
            ))}
            {skills.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>No skills added yet.</p>}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Experience</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {experience.map(exp => (
              <div key={exp.id} style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ width: '150px', flexShrink: 0, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {exp.duration}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{exp.role}</h3>
                  <div style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: '1rem' }}>{exp.company}</div>
                  <p style={{ color: 'var(--text-muted)' }}>{exp.description}</p>
                </div>
              </div>
            ))}
            {experience.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>No experience added yet.</p>}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Featured Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {projects.map(proj => (
              <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {proj.image && (
                  <div style={{ height: '200px', margin: '-2rem -2rem 2rem -2rem', borderBottom: '1px solid var(--border-color)', backgroundImage: `url(${proj.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px 12px 0 0' }}></div>
                )}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{proj.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>{proj.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {proj.tags && proj.tags.split(',').map((tag: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 500 }}>View &rarr;</a>
                  )}
                </div>
              </div>
            ))}
            {projects.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>No projects added yet.</p>}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Certifications & Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {certs.map(cert => (
              <div key={cert.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {cert.badge_image_url ? (
                  <img src={cert.badge_image_url} alt={cert.title} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    🏅
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{cert.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</p>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500 }}>Verify Credential</a>
                  )}
                </div>
              </div>
            ))}
            {certs.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>No certifications added yet.</p>}
          </div>
        </div>
      </section>

      {/* Daily Blog Section */}
      <section id="blog" className="section" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Daily Focus</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Updates on what I am currently learning and building.</p>
          
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {blog.map(post => (
              <div key={post.id} style={{ paddingLeft: '2rem', borderLeft: '3px solid var(--accent)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-9px', top: '0', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{post.date}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{post.content}</p>
              </div>
            ))}
            {blog.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No updates posted yet.</p>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} {content?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
