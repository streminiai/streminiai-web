// pages/team.jsx
// Drop this into your existing Stremini Next.js project

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ── COLORS ──
const COLORS = {
  blue:   'linear-gradient(135deg,#0071e3,#34aadc)',
  purple: 'linear-gradient(135deg,#bf5af2,#9b59b6)',
  orange: 'linear-gradient(135deg,#ff9f0a,#ff6b35)',
  green:  'linear-gradient(135deg,#34c759,#30a14e)',
  red:    'linear-gradient(135deg,#ff3b30,#c0392b)',
  teal:   'linear-gradient(135deg,#5ac8fa,#0097a7)',
};

// ── SVG ICONS ──
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLI = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10V9h4v1.765C14.396 9.54 15.248 9 16 9zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconWeb = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ── AVATAR ──
function Avatar({ member, size = 88, fontSize = 34 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: member.avatar ? '#f5f5f7' : member.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, fontWeight: 700, color: '#fff',
        overflow: 'hidden', flexShrink: 0, position: 'relative',
        boxShadow: size > 70 ? '0 8px 32px rgba(0,113,227,.18)' : 'none',
      }}
    >
      {member.avatar
        ? <img src={member.avatar} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        : member.name[0]}
    </div>
  );
}

// ── SOCIAL BTN ──
function SocialBtn({ href, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      width:34, height:34, borderRadius:'50%',
      border:'1px solid #d2d2d7', background:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#6e6e73', textDecoration:'none', transition:'all .2s',
      cursor:'pointer',
    }}
    onMouseEnter={e=>{e.currentTarget.style.background='#1d1d1f';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='#1d1d1f'}}
    onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6e6e73';e.currentTarget.style.borderColor='#d2d2d7'}}
    >
      {children}
    </a>
  );
}

// ── FOUNDER CARD ──
function FounderCard({ member }) {
  return (
    <div style={{
      background:'#f5f5f7', borderRadius:20, overflow:'hidden',
      display:'grid', gridTemplateColumns:'1fr 1fr',
      marginBottom:6,
    }}
    className="founder-grid"
    >
      <div style={{ padding:'52px 48px', background:'#fff', borderRight:'1px solid rgba(0,0,0,.05)' }}>
        <div style={{ position:'relative', width:88, marginBottom:24 }}>
          <Avatar member={member} size={88} fontSize={34}/>
          <div style={{
            position:'absolute', bottom:4, right:4,
            width:14, height:14, borderRadius:'50%',
            background:'#34c759', border:'2.5px solid #fff',
            boxShadow:'0 0 6px rgba(52,199,89,.5)',
          }}/>
        </div>
        <div style={{ fontSize:11, fontWeight:600, color:'#0071e3', background:'rgba(0,113,227,.08)', display:'inline-block', padding:'4px 12px', borderRadius:20, marginBottom:12 }}>
          {member.role}
        </div>
        <h3 style={{ fontSize:36, fontWeight:700, letterSpacing:'-1.2px', marginBottom:12 }}>{member.name}</h3>
        <p style={{ fontSize:14, fontWeight:300, color:'#6e6e73', lineHeight:1.7, maxWidth:320, marginBottom:28 }}>{member.bio}</p>
        <div style={{ display:'flex', gap:8 }}>
          <SocialBtn href={member.twitter ? `https://twitter.com/${member.twitter}` : null}><IconX/></SocialBtn>
          <SocialBtn href={member.linkedin || null}><IconLI/></SocialBtn>
          <SocialBtn href={member.website || null}><IconWeb/></SocialBtn>
        </div>
      </div>
      <div style={{ padding:'52px 48px', display:'flex', flexDirection:'column', justifyContent:'center', gap:0 }}>
        {[
          { label:'Role', val: member.role, sub:'Full-time · Since 2026' },
          { label:'Focus', val: null, sub: member.skills.join(' · ') },
          member.location ? { label:'Location', val: null, sub: member.location } : null,
          { label:'Status', val:'status' },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ padding:'20px 0', borderBottom: i < 2 ? '1px solid rgba(0,0,0,.07)' : 'none' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#6e6e73', letterSpacing:'.3px', textTransform:'uppercase', marginBottom:5 }}>{item.label}</div>
            {item.val === 'status' ? (
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#34c759', boxShadow:'0 0 5px rgba(52,199,89,.5)', flexShrink:0, display:'inline-block' }}/>
                <span style={{ fontSize:14, fontWeight:500, color:'#1d1d1f' }}>Open to collaboration</span>
              </div>
            ) : (
              <>
                {item.val && <div style={{ fontSize:16, fontWeight:500, color:'#1d1d1f', lineHeight:1.5 }}>{item.val}</div>}
                {item.sub && <div style={{ fontSize:14, fontWeight:400, color:'#6e6e73', lineHeight:1.7 }}>{item.sub}</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TEAM CARD ──
function TeamCard({ member }) {
  return (
    <div style={{ background:'#fff', padding:'40px 36px', display:'flex', flexDirection:'column' }}>
      <Avatar member={member} size={64} fontSize={24}/>
      <div style={{ fontSize:11, fontWeight:600, color:'#0071e3', marginBottom:5, marginTop:20 }}>{member.role}</div>
      <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-.7px', marginBottom:10, color:'#1d1d1f' }}>{member.name}</div>
      <p style={{ fontSize:13, fontWeight:300, color:'#6e6e73', lineHeight:1.65, flex:1, marginBottom:16 }}>{member.bio}</p>
      <div style={{ marginBottom:18 }}>
        {member.skills.map((s, i) => (
          <span key={i} style={{ display:'inline-block', fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:20, background:'rgba(0,0,0,.04)', color:'#6e6e73', marginRight:4, marginBottom:4 }}>{s}</span>
        ))}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <SocialBtn href={member.twitter ? `https://twitter.com/${member.twitter}` : null}><IconX/></SocialBtn>
        <SocialBtn href={member.linkedin || null}><IconLI/></SocialBtn>
        <SocialBtn href={member.website || null}><IconWeb/></SocialBtn>
      </div>
    </div>
  );
}

// ── LOGIN MODAL ──
function LoginModal({ onClose, onSuccess }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (!user || !pass) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) { setError('Incorrect username or password.'); setLoading(false); return; }
      onSuccess(data, pass); // pass plaintext pw for subsequent API calls
    } catch {
      setError('Network error. Try again.');
    }
    setLoading(false);
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:440, boxShadow:'0 32px 80px rgba(0,0,0,.2)', animation:'modalIn .3s ease', overflow:'hidden' }}>
        <div style={{ padding:'24px 28px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:18, fontWeight:700, letterSpacing:'-.5px' }}>Staff Login</span>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:'50%', border:'none', background:'#f5f5f7', cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', color:'#6e6e73' }}>✕</button>
        </div>
        <div style={{ padding:'20px 28px 28px' }}>
          <p style={{ fontSize:13, color:'#6e6e73', marginBottom:20, lineHeight:1.6 }}>Sign in to edit your team profile.</p>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#6e6e73', letterSpacing:'.3px', textTransform:'uppercase', marginBottom:6, display:'block' }}>Username</label>
            <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="e.g. cipher" style={{ width:'100%', padding:'11px 14px', border:'1px solid #d2d2d7', borderRadius:10, fontFamily:'inherit', fontSize:15, outline:'none' }}/>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#6e6e73', letterSpacing:'.3px', textTransform:'uppercase', marginBottom:6, display:'block' }}>Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="••••••••" style={{ width:'100%', padding:'11px 14px', border:'1px solid #d2d2d7', borderRadius:10, fontFamily:'inherit', fontSize:15, outline:'none' }}/>
            {error && <div style={{ fontSize:12, color:'#ff3b30', marginTop:6 }}>{error}</div>}
          </div>
          <button onClick={doLogin} disabled={loading} style={{ width:'100%', padding:13, background: loading ? '#d2d2d7' : '#0071e3', color:'#fff', border:'none', borderRadius:10, fontFamily:'inherit', fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT PANEL ──
function EditPanel({ member, authPassword, onClose, onSaved }) {
  const [name, setName]         = useState(member.name);
  const [role, setRole]         = useState(member.role);
  const [bio, setBio]           = useState(member.bio);
  const [location, setLocation] = useState(member.location || '');
  const [twitter, setTwitter]   = useState(member.twitter || '');
  const [linkedin, setLinkedin] = useState(member.linkedin || '');
  const [website, setWebsite]   = useState(member.website || '');
  const [skills, setSkills]     = useState([...member.skills]);
  const [colorKey, setColorKey] = useState(member.colorKey || 'blue');
  const [avatar, setAvatar]     = useState(member.avatar || '');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const fileRef = useRef();

  function handleAvatarUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !skills.includes(t)) setSkills([...skills, t]);
    setTagInput('');
  }

  function removeTag(i) { setSkills(skills.filter((_,j)=>j!==i)); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: member.username,
          password: authPassword,
          updates: { name, role, bio, location, twitter: twitter.replace('@',''), linkedin, website, skills, colorKey, color: COLORS[colorKey], avatar },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setToast('Error: ' + data.error); setSaving(false); return; }
      onSaved(data);
      setToast('Profile saved ✓');
      setTimeout(() => setToast(''), 3000);
    } catch { setToast('Network error.'); }
    setSaving(false);
  }

  const previewMember = { name, role, color: COLORS[colorKey], avatar };

  return (
    <div style={{ position:'fixed', inset:0, background:'#f5f5f7', zIndex:3000, overflowY:'auto' }}>
      {/* Nav */}
      <div style={{ height:52, background:'rgba(255,255,255,.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:10 }}>
        <span style={{ fontSize:15, fontWeight:600, letterSpacing:'-.3px' }}>Edit Your Profile</span>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ padding:'7px 20px', background:'#0071e3', color:'#fff', border:'none', borderRadius:100, fontFamily:'inherit', fontSize:13, fontWeight:600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1 }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} style={{ padding:'7px 18px', background:'#1d1d1f', color:'#fff', border:'none', borderRadius:100, fontFamily:'inherit', fontSize:13, fontWeight:500, cursor:'pointer' }}>Done</button>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:'0 auto', padding:'40px 22px 80px' }}>

        {/* Profile header */}
        <div style={{ background:'#fff', borderRadius:20, padding:36, marginBottom:16, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          <div style={{ position:'relative', cursor:'pointer' }} onClick={()=>fileRef.current.click()}>
            <Avatar member={previewMember} size={80} fontSize={28}/>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'.2s', fontSize:11, fontWeight:600, color:'#fff', textAlign:'center', lineHeight:1.3 }}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=0}
            >Change<br/>Photo</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarUpload}/>
          <div>
            <h3 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.5px', marginBottom:4 }}>{name || 'Your Name'}</h3>
            <p style={{ fontSize:13, color:'#6e6e73', marginBottom:12 }}>{role || 'Role'}</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(COLORS).map(([k,v])=>(
                <button key={k} onClick={()=>{setColorKey(k);setAvatar('');}}
                  style={{ padding:'5px 12px', border: k===colorKey ? '1.5px solid #0071e3' : '1px solid #d2d2d7', borderRadius:100, fontSize:12, fontWeight:500, color: k===colorKey ? '#0071e3' : '#6e6e73', background: k===colorKey ? 'rgba(0,113,227,.06)' : '#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:v, display:'inline-block' }}/>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic info */}
        <Section title="Basic Info">
          <Grid2>
            <Field label="Display Name"><input className="ep-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></Field>
            <Field label="Role / Title"><input className="ep-input" value={role} onChange={e=>setRole(e.target.value)} placeholder="Co-Founder · Dev"/></Field>
          </Grid2>
          <Field label="Bio"><textarea className="ep-input" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Short bio..." style={{ minHeight:90, resize:'vertical' }}/></Field>
          <Field label="Location"><input className="ep-input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Sialkot, Pakistan"/></Field>
        </Section>

        {/* Skills */}
        <Section title="Skills & Tags">
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
            {skills.map((t,i)=>(
              <div key={i} style={{ padding:'5px 12px', background:'#f5f5f7', borderRadius:100, fontSize:12, fontWeight:500, color:'#6e6e73', display:'flex', alignItems:'center', gap:6 }}>
                {t}
                <button onClick={()=>removeTag(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6e6e73', fontSize:15, padding:0, lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTag()} placeholder="Add a skill..." style={{ flex:1, padding:'8px 12px', border:'1px solid #d2d2d7', borderRadius:8, fontFamily:'inherit', fontSize:13, outline:'none' }}/>
            <button onClick={addTag} style={{ padding:'8px 16px', background:'#0071e3', color:'#fff', border:'none', borderRadius:8, fontFamily:'inherit', fontSize:13, fontWeight:500, cursor:'pointer' }}>Add</button>
          </div>
        </Section>

        {/* Social */}
        <Section title="Social Links">
          <Field label="Twitter / X username"><input className="ep-input" value={twitter} onChange={e=>setTwitter(e.target.value)} placeholder="username (without @)"/></Field>
          <Field label="LinkedIn URL"><input className="ep-input" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..."/></Field>
          <Field label="Website URL"><input className="ep-input" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yoursite.com"/></Field>
        </Section>

        <button onClick={save} disabled={saving} style={{ width:'100%', padding:14, background: saving ? '#d2d2d7' : '#0071e3', color:'#fff', border:'none', borderRadius:12, fontFamily:'inherit', fontSize:15, fontWeight:600, cursor: saving ? 'not-allowed' : 'pointer', marginTop:8 }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)', background:'#1d1d1f', color:'#fff', padding:'12px 24px', borderRadius:100, fontSize:14, fontWeight:500, zIndex:9999, whiteSpace:'nowrap', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── HELPER COMPONENTS ──
function Section({ title, children }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, padding:28, marginBottom:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:'#6e6e73', letterSpacing:'.3px', textTransform:'uppercase', marginBottom:20, paddingBottom:12, borderBottom:'1px solid #f5f5f7' }}>{title}</div>
      {children}
    </div>
  );
}
function Grid2({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>{children}</div>;
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'#6e6e73', letterSpacing:'.3px', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
      {children}
    </div>
  );
}

// ── MAIN PAGE ──
export default function TeamPage() {
  const [team, setTeam]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showLogin, setShowLogin]   = useState(false);
  const [authMember, setAuthMember] = useState(null);
  const [authPw, setAuthPw]         = useState('');
  const [showEdit, setShowEdit]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => { setTeam(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleLoginSuccess(member, pw) {
    setAuthMember(member);
    setAuthPw(pw);
    setShowLogin(false);
    setShowEdit(true);
  }

  function handleSaved(updated) {
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
    setAuthMember(updated);
  }

  const founder = team.find(m => m.isFounder);
  const members = team.filter(m => !m.isFounder);

  return (
    <>
      <Head>
        <title>Team — Stremini</title>
        <meta name="description" content="Meet the people behind Stremini"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#fff;color:#1d1d1f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        @keyframes modalIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
        .ep-input{width:100%;padding:11px 14px;border:1px solid #d2d2d7;border-radius:10px;font-family:inherit;font-size:15px;font-weight:400;color:#1d1d1f;outline:none;background:#fff;transition:border .2s,box-shadow .2s}
        .ep-input:focus{border-color:#0071e3;box-shadow:0 0 0 3px rgba(0,113,227,.12)}
        .founder-grid{display:grid;grid-template-columns:1fr 1fr}
        @media(max-width:860px){.founder-grid{grid-template-columns:1fr!important}.team-cols{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:580px){.nav-desktop{display:none!important}.nav-hamburger{display:flex!important}.team-cols{grid-template-columns:1fr!important}.fc-pad{padding:36px 24px!important}.hero-h1{letter-spacing:-1.5px!important;font-size:clamp(36px,10vw,60px)!important}}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:999, height:52, background:'rgba(255,255,255,.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:1024, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontSize:19, fontWeight:600, color:'#1d1d1f', textDecoration:'none', letterSpacing:'-.3px' }}>Stremini</Link>

          <ul className="nav-desktop" style={{ display:'flex', alignItems:'center', listStyle:'none', gap:0 }}>
            {['Home','Features','Gallery','Blog','About'].map(item=>(
              <li key={item}><Link href={item==='Home'?'/':'/'+item.toLowerCase()} style={{ display:'block', padding:'0 12px', fontSize:12, fontWeight:400, color:'#6e6e73', textDecoration:'none' }}>{item}</Link></li>
            ))}
            <li><span style={{ display:'block', padding:'0 12px', fontSize:12, fontWeight:400, color:'#1d1d1f' }}>Team</span></li>
            <li><Link href="#" style={{ fontSize:12, fontWeight:400, color:'#0071e3', padding:'0 12px', textDecoration:'none' }}>Download ↗</Link></li>
          </ul>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            style={{ display:'none', flexDirection:'column', justifyContent:'center', alignItems:'center', width:36, height:36, background:'none', border:'none', cursor:'pointer', padding:0, borderRadius:'50%', gap:0, position:'relative' }}
            onClick={()=>setMobileOpen(!mobileOpen)}
          >
            <span style={{ display:'block', width:18, height:1.5, background:'#1d1d1f', borderRadius:2, position:'absolute', transform: mobileOpen ? 'rotate(45deg)' : 'translateY(-5px)', transition:'transform .35s cubic-bezier(.77,0,.18,1)' }}/>
            <span style={{ display:'block', width:18, height:1.5, background:'#1d1d1f', borderRadius:2, position:'absolute', opacity: mobileOpen ? 0 : 1, transition:'opacity .25s' }}/>
            <span style={{ display:'block', width:18, height:1.5, background:'#1d1d1f', borderRadius:2, position:'absolute', transform: mobileOpen ? 'rotate(-45deg)' : 'translateY(5px)', transition:'transform .35s cubic-bezier(.77,0,.18,1)' }}/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{ position:'fixed', top:52, left:0, right:0, bottom:0, background:'rgba(255,255,255,.97)', backdropFilter:'blur(20px)', zIndex:998, overflowY:'auto' }}>
          <div style={{ padding:'12px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f7', borderRadius:10, padding:'9px 14px', marginBottom:8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ fontSize:16, color:'#6e6e73' }}>Search stremini.site</span>
            </div>
          </div>
          <ul style={{ listStyle:'none' }}>
            {['Home','Features','Gallery','Blog','Team','About','Careers'].map(item=>(
              <li key={item} style={{ borderBottom:'1px solid rgba(0,0,0,.06)' }}>
                <Link href={item==='Home'?'/':'/'+item.toLowerCase()} onClick={()=>setMobileOpen(false)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', fontSize:17, color:'#1d1d1f', textDecoration:'none' }}>
                  {item} <span style={{ color:'#d2d2d7', fontSize:20 }}>›</span>
                </Link>
              </li>
            ))}
            <li style={{ borderBottom:'1px solid rgba(0,0,0,.06)' }}>
              <a href="#" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', fontSize:17, color:'#0071e3', textDecoration:'none' }}>
                Download App <span style={{ color:'#d2d2d7', fontSize:20 }}>›</span>
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* HERO */}
      <div style={{ padding:'130px 22px 80px', textAlign:'center', background:'linear-gradient(180deg,#fbfbfd 0%,#fff 100%)' }}>
        <p style={{ fontSize:12, fontWeight:600, color:'#0071e3', letterSpacing:'.5px', marginBottom:10 }}>Our Team</p>
        <h1 className="hero-h1" style={{ fontSize:'clamp(40px,7vw,80px)', fontWeight:700, letterSpacing:'-2.5px', lineHeight:1.05, marginBottom:20 }}>
          Meet the people<br/>behind <em style={{ fontStyle:'normal', color:'#0071e3' }}>Stremini</em>
        </h1>
        <p style={{ fontSize:'clamp(16px,2.5vw,21px)', fontWeight:300, color:'#6e6e73', maxWidth:500, margin:'0 auto 56px', lineHeight:1.6 }}>
          Talented individuals working together to build the future of AI assistance.
        </p>
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { dot:true, text:'Actively building' },
            { text: loading ? '— members' : `${team.length} members` },
            { text:'Global team' },
          ].map((p,i)=>(
            <div key={i} style={{ padding:'8px 20px', background:'rgba(0,0,0,.04)', border:'1px solid #d2d2d7', borderRadius:100, fontSize:13, fontWeight:500, color:'#6e6e73', display:'flex', alignItems:'center', gap:6 }}>
              {p.dot && <span style={{ width:6, height:6, borderRadius:'50%', background:'#34c759', boxShadow:'0 0 4px rgba(52,199,89,.6)' }}/>}
              {p.text}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:980, margin:'0 auto', padding:'0 22px' }}>

        {/* Founder */}
        <div style={{ padding:'80px 0 48px' }}>
          <p style={{ fontSize:12, fontWeight:600, color:'#0071e3', marginBottom:8 }}>Leadership</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-1.5px', marginBottom:12, lineHeight:1.08 }}>Founder</h2>
          <p style={{ fontSize:17, fontWeight:300, color:'#6e6e73', maxWidth:440, lineHeight:1.6, marginBottom:48 }}>The visionary who started it all.</p>
          {loading ? <div style={{ height:300, background:'#f5f5f7', borderRadius:20 }}/> : founder && <FounderCard member={founder}/>}
        </div>

        <div style={{ height:1, background:'#d2d2d7', marginBottom:0 }}/>

        {/* Team */}
        <div style={{ padding:'80px 0 48px' }}>
          <p style={{ fontSize:12, fontWeight:600, color:'#0071e3', marginBottom:8 }}>Co-Founders & Team</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-1.5px', marginBottom:12, lineHeight:1.08 }}>Building together</h2>
          <p style={{ fontSize:17, fontWeight:300, color:'#6e6e73', maxWidth:440, lineHeight:1.6, marginBottom:48 }}>The core team behind Stremini's product, design, and growth.</p>
          <div className="team-cols" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, background:'#d2d2d7', borderRadius:20, overflow:'hidden' }}>
            {loading
              ? [1,2,3].map(i=><div key={i} style={{ height:300, background:'#fff' }}/>)
              : members.map(m=><TeamCard key={m.id} member={m}/>)
            }
          </div>
        </div>

        {/* CTA */}
        <div style={{ margin:'20px 0 100px' }}>
          <div style={{ background:'#f5f5f7', borderRadius:20, padding:'80px 40px', textAlign:'center' }}>
            <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-1.5px', marginBottom:14 }}>Join our growing team</h2>
            <p style={{ fontSize:17, fontWeight:300, color:'#6e6e73', maxWidth:420, margin:'0 auto 36px', lineHeight:1.6 }}>We're always looking for talented individuals to help build the future of AI assistance.</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/waitlist" style={{ padding:'13px 28px', background:'#0071e3', color:'#fff', border:'none', borderRadius:100, fontSize:15, fontWeight:500, textDecoration:'none' }}>Get in Touch</Link>
              <Link href="/careers" style={{ padding:'13px 28px', background:'transparent', color:'#0071e3', border:'1px solid #0071e3', borderRadius:100, fontSize:15, fontWeight:500, textDecoration:'none' }}>View Careers</Link>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid #d2d2d7', padding:'20px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <span style={{ fontSize:12, color:'#6e6e73' }}>Copyright © 2026 Stremini. All rights reserved.</span>
        <div style={{ display:'flex', gap:16 }}>
          <Link href="#" style={{ fontSize:12, color:'#6e6e73', textDecoration:'none' }}>Privacy</Link>
          <Link href="/features" style={{ fontSize:12, color:'#6e6e73', textDecoration:'none' }}>Features</Link>
          <Link href="#" style={{ fontSize:12, color:'#6e6e73', textDecoration:'none' }}>Contact</Link>
          <button onClick={()=>setShowLogin(true)} style={{ fontSize:12, color:'#0071e3', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', padding:0 }}>Staff Login</button>
        </div>
      </footer>

      {/* MODALS */}
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} onSuccess={handleLoginSuccess}/>}
      {showEdit && authMember && (
        <EditPanel
          member={authMember}
          authPassword={authPw}
          onClose={()=>setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
