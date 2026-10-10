import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type EventItem = { slug: string; name: string; category: string; format: string; description: string };
type Festival = {
  slug: string; name: string; subtitle: string; kind: string; description: string; intro: string; image: string; events: EventItem[];
};

const images = {
  castle: "https://images.unsplash.com/photo-1709586733081-af013389dea2?auto=format&fit=crop&w=2200&q=90",
  citadel: "https://images.unsplash.com/photo-1709973272944-dd021616ec14?auto=format&fit=crop&w=2200&q=88",
  theatre: "https://images.unsplash.com/photo-1783184792122-c200c6df8eb1?auto=format&fit=crop&w=2200&q=88",
  celestial: "https://images.unsplash.com/photo-1770838517378-743578d39658?auto=format&fit=crop&w=2200&q=88",
};

const festivals: Festival[] = [
  { slug: "prayaag", name: "PRAYAAG", subtitle: "THE REALM OF INNOVATION", kind: "Technical Festival", image: images.citadel,
    description: "A gathering of curious minds, bold ideas, and technological excellence.",
    intro: "Enter a monumental proving ground where systems, machines, and ideas are forged into tomorrow.",
    events: [
      { slug: "hackathon", name: "Hackathon", category: "Coding", format: "Team", description: "Build an original solution to a revealed challenge." },
      { slug: "code-clash", name: "Code Clash", category: "Coding", format: "Individual", description: "A fast-paced test of algorithms and precision." },
      { slug: "robotics-challenge", name: "Robotics Challenge", category: "Robotics", format: "Team", description: "Design, assemble, and command a capable machine." },
    ] },
  { slug: "yavanika", name: "YAVANIKA", subtitle: "THE REALM OF EXPRESSION", kind: "Cultural Festival", image: images.theatre,
    description: "A celebration of art, culture, creativity, and unforgettable performances.",
    intro: "Beyond the velvet curtain, every voice, movement, and frame finds its grandest stage.",
    events: [
      { slug: "dance-battle", name: "Dance Battle", category: "Dance", format: "Team", description: "A high-energy showcase of rhythm and storytelling." },
      { slug: "battle-of-bands", name: "Battle of Bands", category: "Music", format: "Team", description: "Original sound meets the electricity of a live stage." },
      { slug: "theatre", name: "Theatre", category: "Performance", format: "Team", description: "Bring a compelling story to life before an audience." },
    ] },
  { slug: "yagnadruva", name: "YAGNADRUVA", subtitle: "WHERE WORLDS CONVERGE", kind: "Technical & Cultural Festival", image: images.celestial,
    description: "Where technology meets culture, innovation meets imagination, and diverse talents come together.",
    intro: "At the meeting point of disciplines, unexpected collaborations rise and new worlds take shape.",
    events: [
      { slug: "innovation-challenge", name: "Innovation Challenge", category: "Innovation", format: "Team", description: "Shape a thoughtful response to a complex challenge." },
      { slug: "creative-tech-showcase", name: "Creative Tech Showcase", category: "Creative Tech", format: "Individual / Team", description: "Present work where technology becomes a creative medium." },
      { slug: "interdisciplinary-challenge", name: "Interdisciplinary Challenge", category: "Open", format: "Team", description: "Combine distinct skills to solve one shared brief." },
    ] },
];

function go(path: string) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Link({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className} onClick={(e) => {
    if (!href.startsWith("/")) return;
    e.preventDefault();
    const [nextPath, hash] = href.split("#");
    if (nextPath === location.pathname && hash) {
      history.pushState({}, "", href);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else go(href);
  }}>{children}</a>;
}

function Mark() {
  return <span className="mark" aria-hidden="true"><i /><b>✦</b><i /></span>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  return <header className="nav">
    <Link href="/" className="brand"><Mark /><span><small>LBSITW</small>THE GRAND FEST</span></Link>
    <button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
      <Link href="/">Home</Link><Link href="/#realms">Explore Festivals</Link><Link href="/about">About</Link><Link href="/gallery">Gallery</Link><Link href="/contact">Contact</Link>
      <Link href="/registrations" className="minor-link">My registrations</Link>
      <Link href="/register" className="button compact">Register now</Link>
    </nav>
  </header>;
}

function Footer() {
  return <footer><div><Mark /><strong>THE GRAND FEST</strong><p>An original festival experience by LBS Institute of Technology for Women.</p></div>
    <div><span>EXPLORE</span><Link href="/about">About</Link><Link href="/gallery">Gallery</Link><Link href="/contact">Contact</Link></div>
    <div><span>REALMS</span>{festivals.map(f => <Link key={f.slug} href={`/festivals/${f.slug}`}>{f.name}</Link>)}</div>
    <p className="fine">Prototype experience · Official details to be announced</p></footer>;
}

function ExperienceLayer() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
        const progress = scrollY / max;
        document.documentElement.style.setProperty("--journey", String(progress));
        document.documentElement.style.setProperty("--hero-scroll", String(Math.min(scrollY / innerHeight, 1)));
      });
    };
    const move = (event: PointerEvent) => {
      if (!cursor.current || reduced) return;
      cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    };
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    }), { threshold: .16 });
    document.querySelectorAll(".scroll-reveal").forEach(node => observer.observe(node));
    addEventListener("scroll", updateScroll, { passive: true });
    addEventListener("pointermove", move, { passive: true });
    updateScroll();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", updateScroll); removeEventListener("pointermove", move); };
  }, []);
  return <><div className="journey-progress" aria-hidden="true"><i /></div><div ref={cursor} className="fantasy-cursor" aria-hidden="true"><i /></div></>;
}

function Shell({ children }: { children: React.ReactNode }) { return <><Nav /><ExperienceLayer /><main className="route-enter">{children}</main><Footer /></>; }

function Hero() {
  return <section className="hero" style={{ "--bg": `url(${images.castle})` } as React.CSSProperties}>
    <div className="hero-layer sky-layer" /><div className="hero-layer mountain-layer" /><div className="hero-layer castle-layer" />
    <div className="clouds cloud-one" /><div className="clouds cloud-two" />
    <div className="ruins ruins-left"><i /><i /><i /></div><div className="ruins ruins-right"><i /><i /></div>
    <div className="mist m1" /><div className="mist m2" /><div className="particles" /><div className="gold-motes">{Array.from({length:9},(_,i)=><i key={i} />)}</div>
    <div className="hero-content"><p className="eyebrow hero-college">LBS INSTITUTE OF TECHNOLOGY FOR WOMEN</p><div className="ornament hero-ornament"><i /><span>✦</span><i /></div>
      <h1 className="hero-title">THE GRAND<br /><em>FEST</em></h1><p className="subtitle hero-subtitle">THREE REALMS. ONE UNFORGETTABLE EXPERIENCE.</p>
      <Link href="/#realms" className="scroll">SCROLL TO EXPLORE <span>↓</span></Link>
    </div>
    <div className="hero-credit">THIRUVANANTHAPURAM · KERALA</div>
  </section>;
}

function Home() {
  useEffect(() => { if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" }), 50); }, []);
  return <Shell><Hero />
    <section className="gate-scene">
      <div className="gate gate-left" /><div className="gate gate-right" /><div className="gate-light" />
      <div className="gate-copy scroll-reveal"><p className="eyebrow">APPROACH THE GATES</p><h2>A world is stirring<br /><em>beyond the stone.</em></h2></div>
    </section>
    <section className="intro section">
      <p className="eyebrow scroll-reveal">AN INVITATION TO WONDER</p><h2 className="scroll-reveal">Beyond the gates,<br /><em>three worlds await.</em></h2>
      <div className="intro-grid scroll-reveal"><p className="lead">For a fleeting moment, our campus becomes a world of invention, expression, and uncommon possibility.</p>
        <div><p>LBS Institute of Technology for Women welcomes students and creators to an immersive celebration across three distinct festival realms. Official college and festival copy can be placed here.</p>
          <dl><div><dt>DATES</dt><dd>To be announced</dd></div><div><dt>VENUE</dt><dd>LBSITW, Thiruvananthapuram</dd></div><div><dt>PARTICIPATION</dt><dd>Invited colleges · Details TBA</dd></div></dl></div></div>
    </section>
    <div id="realms">
      {festivals.map((f, i) => <section className={`realm realm-${i + 1}`} key={f.slug} style={{ "--bg": `url(${f.image})` } as React.CSSProperties}>
        <div className="realm-atmosphere"><i /><i /><i /></div><div className="realm-shade" /><div className="realm-number">0{i + 1}</div>
        <div className="realm-copy scroll-reveal"><p className="eyebrow">{f.kind} · Realm 0{i + 1}</p><h2>{f.name}</h2><h3>{f.subtitle}</h3><p className="realm-desc">{f.description}</p><p>{f.intro}</p>
          <div className="realm-meta"><span><b>03</b> SAMPLE EVENTS</span><span>REGISTRATION · PROTOTYPE</span></div>
          <div className="actions"><Link className="button" href={`/festivals/${f.slug}`}>Enter realm</Link><Link className="text-link" href={`/festivals/${f.slug}`}>Explore events →</Link></div>
          <div className="realm-stepper"><a aria-label={i ? `Previous realm: ${festivals[i-1].name}` : "Go to realm selector"} href={i ? `#${festivals[i-1].slug}` : "#realm-map"}>←</a><span>0{i+1} / 03</span><a aria-label={i < 2 ? `Next realm: ${festivals[i+1].name}` : "Go to realm selector"} href={i < 2 ? `#${festivals[i+1].slug}` : "#realm-map"}>→</a></div>
        </div>
      </section>).map((node,i) => <div id={festivals[i].slug} key={festivals[i].slug}>{node}</div>)}
    </div>
    <RealmSelector />
    <section className="finale section"><p className="eyebrow scroll-reveal">THE GATES ARE OPEN</p><h2 className="scroll-reveal">Choose your realm.<br /><em>Begin your story.</em></h2><Link className="button" href="/register">Register now</Link></section>
  </Shell>;
}

function RealmSelector() {
  const [active, setActive] = useState(0);
  const festival = festivals[active];
  return <section className="realm-map section" id="realm-map" style={{ "--map-bg": `url(${festival.image})` } as React.CSSProperties}>
    <div className="map-background" /><div className="map-lines" aria-hidden="true" />
    <div className="map-heading scroll-reveal"><p className="eyebrow">THE CARTOGRAPHER'S TABLE</p><h2>Select a <em>realm</em></h2><p>Three paths cross this world. Focus a marker to reveal its story.</p></div>
    <div className="map-stage">
      {festivals.map((item, i) => <button key={item.slug} className={`map-marker marker-${i+1} ${active === i ? "active" : ""}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-label={`Select ${item.name}`}>
        <span><i />0{i+1}</span><strong>{item.name}</strong>
      </button>)}
      <div className="map-dossier" aria-live="polite"><p className="eyebrow">{festival.kind}</p><h3>{festival.name}</h3><p>{festival.description}</p><Link className="button compact" href={`/festivals/${festival.slug}`}>View events</Link></div>
    </div>
  </section>;
}

function FestivalPage({ festival }: { festival: Festival }) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All"); const [sort, setSort] = useState("Featured");
  const categories = ["All", ...new Set(festival.events.map(e => e.category))];
  const shown = useMemo(() => festival.events.filter(e => (category === "All" || e.category === category) && e.name.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === "A–Z" ? a.name.localeCompare(b.name) : 0), [query, category, sort, festival]);
  return <Shell><section className="page-hero" style={{ "--bg": `url(${festival.image})` } as React.CSSProperties}><div><p className="eyebrow">{festival.kind}</p><h1>{festival.name}</h1><p>{festival.subtitle}</p></div></section>
    <section className="events section"><div className="section-head"><div><p className="eyebrow">SAMPLE PROGRAMME</p><h2>Discover the <em>challenges</em></h2></div><p>{festival.description} All details below are editable prototype content.</p></div>
      <div className="tools"><label className="search"><span>⌕</span><input aria-label="Search events" placeholder="Search events…" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <div className="filters" aria-label="Category filters">{categories.map(c => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <label className="sort">SORT <select value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>A–Z</option></select></label></div>
      <p className="count">{String(shown.length).padStart(2,"0")} EVENTS FOUND</p>
      <div className="quest-rule"><span>QUEST JOURNAL</span><i /><span>{festival.name} ARCHIVE</span></div>
      <div className="event-grid">{shown.map((event, i) => <article className="event-card quest-entry scroll-reveal" key={event.slug}><div className="quest-sigil"><span>✦</span></div><span className="index">0{i + 1}</span><p className="eyebrow">{event.category} · SAMPLE QUEST</p><h3>{event.name}</h3><p>{event.description}</p>
        <div className="event-facts"><span>Date & time · TBA</span><span>{event.format}</span><span>Fee · TBA</span></div>
        <div className="quest-more">Official requirements and complete rules will appear in the event dossier.</div>
        <div className="actions"><Link className="text-link" href={`/events/${festival.slug}/${event.slug}`}>View quest →</Link><Link className="button compact" href={`/register?festival=${festival.slug}&event=${event.slug}`}>Register</Link></div></article>)}</div>
    </section></Shell>;
}

function EventPage({ festival, event }: { festival: Festival; event: EventItem }) {
  return <Shell><section className="detail-hero" style={{ "--bg": `url(${festival.image})` } as React.CSSProperties}><div><Link className="back" href={`/festivals/${festival.slug}`}>← Back to {festival.name}</Link><p className="eyebrow">{event.category} · SAMPLE EVENT</p><h1>{event.name}</h1><p>{event.description}</p><Link className="button" href={`/register?festival=${festival.slug}&event=${event.slug}`}>Register for this event</Link></div></section>
    <section className="detail section"><article><p className="eyebrow">THE BRIEF</p><h2>About the <em>event</em></h2><p className="lead">This sample event description is ready to be replaced with official information. Participants will respond to a focused brief and present their work to the event panel.</p>
      <h3>Rules & regulations</h3><ol><li>Participants must carry a valid college identity card.</li><li>Official rules and judging criteria will be announced.</li><li>Submitted work must follow the final event brief.</li></ol>
      <h3>Frequently asked questions</h3><details><summary>Who can participate?</summary><p>Eligibility requirements are currently placeholders and will be confirmed.</p></details><details><summary>What should I bring?</summary><p>A valid student ID; event-specific requirements will be shared later.</p></details></article>
      <aside><p className="eyebrow">EVENT DOSSIER</p>{[["FORMAT",event.format],["MAXIMUM TEAM SIZE","To be announced"],["DATE & TIME","To be announced"],["VENUE","To be announced"],["DEADLINE","To be announced"],["FEE & PRIZE","To be announced"]].map(x => <div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}<Link className="button" href={`/register?festival=${festival.slug}&event=${event.slug}`}>Register for this event</Link></aside>
    </section></Shell>;
}

function Registration() {
  const params = new URLSearchParams(location.search); const [step, setStep] = useState(1); const [done, setDone] = useState(false);
  const [data, setData] = useState({ name: "", email: "", phone: "", college: "", studentId: "", festival: params.get("festival") || "prayaag", event: params.get("event") || "hackathon", type: "Individual", team: "" });
  const update = (key: string, value: string) => setData({ ...data, [key]: value });
  const currentFest = festivals.find(f => f.slug === data.festival)!;
  const submit = (e: FormEvent) => { e.preventDefault(); if (step < 3) setStep(step + 1); else setDone(true); };
  return <Shell><section className="form-page section"><p className="eyebrow">PROTOTYPE REGISTRATION</p><h1>{done ? "Your journey begins." : "Enter the realm."}</h1>
    {done ? <div className="success"><Mark /><h2>Registration prepared</h2><p>This is a prototype confirmation. No information has been saved or transmitted.</p><p className="reference">REFERENCE · DEMO–{Math.floor(1000 + Math.random()*8999)}</p><Link className="button" href="/registrations">View my registrations</Link></div> :
    <><div className="steps">{["Student details","Event information","Review"].map((s,i) => <div className={step >= i+1 ? "active" : ""} key={s}><span>0{i+1}</span>{s}</div>)}</div>
    <form onSubmit={submit}>{step === 1 && <div className="form-grid"><Field label="Full name" value={data.name} set={v=>update("name",v)} required /><Field label="Email address" type="email" value={data.email} set={v=>update("email",v)} required /><Field label="Phone number" type="tel" value={data.phone} set={v=>update("phone",v)} required /><Field label="College name" value={data.college} set={v=>update("college",v)} required /><Field label="Student ID (if required)" value={data.studentId} set={v=>update("studentId",v)} /></div>}
      {step === 2 && <div className="form-grid"><label>Selected festival<select value={data.festival} onChange={e=>update("festival",e.target.value)}>{festivals.map(f=><option value={f.slug}>{f.name}</option>)}</select></label><label>Selected event<select value={data.event} onChange={e=>update("event",e.target.value)}>{currentFest.events.map(ev=><option value={ev.slug}>{ev.name}</option>)}</select></label><label>Participation type<select value={data.type} onChange={e=>update("type",e.target.value)}><option>Individual</option><option>Team</option></select></label>{data.type === "Team" && <Field label="Team name" value={data.team} set={v=>update("team",v)} required />}</div>}
      {step === 3 && <div className="review">{Object.entries(data).filter(x=>x[1]).map(([k,v])=><div><span>{k.replace(/([A-Z])/g," $1")}</span><strong>{v}</strong></div>)}<p>This prototype does not submit or store data.</p></div>}
      <div className="form-actions">{step > 1 && <button type="button" className="text-button" onClick={()=>setStep(step-1)}>← Back</button>}<button className="button" type="submit">{step === 3 ? "Confirm prototype registration" : "Continue →"}</button></div></form></>}
  </section></Shell>;
}

function Field({label,value,set,type="text",required=false}:{label:string;value:string;set:(v:string)=>void;type?:string;required?:boolean}) {
  return <label>{label}<input type={type} value={value} onChange={e=>set(e.target.value)} required={required} /></label>;
}

function Registrations() {
  return <Shell><section className="dashboard section"><p className="eyebrow">STUDENT DASHBOARD · SAMPLE DATA</p><h1>My registrations</h1><div className="registration-row"><div><span className="status">PROTOTYPE</span><p className="eyebrow">PRAYAAG</p><h2>Hackathon</h2></div><div><span>SCHEDULE</span><strong>To be announced</strong></div><div><span>REFERENCE</span><strong>DEMO–0042</strong></div><Link className="text-link" href="/events/prayaag/hackathon">View event →</Link></div><p className="note">This dashboard uses sample data. No real registration has been recorded.</p></section></Shell>;
}

const galleryImages = [images.castle, images.theatre, images.citadel, images.celestial];
function ContentPage({ type }: { type: "about"|"gallery"|"contact" }) {
  if (type === "gallery") return <Shell><section className="content-head section"><p className="eyebrow">ARCHIVE · PLACEHOLDER IMAGERY</p><h1>Glimpses from <em>another world.</em></h1></section><section className="gallery">{galleryImages.map((im,i)=><figure className={`g${i+1}`}><img src={im} alt={["Misty castle landscape","Ornate theatre interior","Mountain architecture","Stone arch in mist"][i]} /><figcaption>CHAPTER 0{i+1} · ATMOSPHERE STUDY</figcaption></figure>)}</section></Shell>;
  if (type === "contact") return <Shell><section className="content-head section"><p className="eyebrow">OPEN A CHANNEL</p><h1>Contact the <em>organisers.</em></h1><p className="lead">Official contact details and social links will be published here.</p></section><section className="contact section"><div><span>COLLEGE ADDRESS</span><h2>Address placeholder</h2><p>LBS Institute of Technology for Women<br />Thiruvananthapuram, Kerala</p></div><div><span>ORGANISING TEAM</span><h2>Contact placeholder</h2><p>Email · To be announced<br />Phone · To be announced<br />Social media · To be announced</p></div></section></Shell>;
  return <Shell><section className="content-head about-head section"><p className="eyebrow">OUR STORY</p><h1>A gathering shaped by<br /><em>curiosity and courage.</em></h1></section><section className="about section"><div><p className="eyebrow">THE INSTITUTE</p><h2>Ideas find their voice here.</h2></div><p className="lead">LBS Institute of Technology for Women is the home of this original festival experience. Official institutional introduction and approved profile copy can be added here.</p><div><p className="eyebrow">THE VISION</p><p>To create a shared world where technical inquiry, cultural expression, and collaboration are celebrated with equal conviction.</p></div><div><p className="eyebrow">PEOPLE & PARTNERS</p><p>Organising team, sponsors, and partner acknowledgements are intentionally presented as placeholders pending official information.</p></div></section></Shell>;
}

export default function App() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => { const handler = () => setPath(location.pathname); addEventListener("popstate", handler); return () => removeEventListener("popstate", handler); }, []);
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return <Home />;
  if (parts[0] === "festivals") { const f = festivals.find(x=>x.slug===parts[1]); if (f) return <FestivalPage festival={f} />; }
  if (parts[0] === "events") { const f=festivals.find(x=>x.slug===parts[1]); const e=f?.events.find(x=>x.slug===parts[2]); if(f&&e) return <EventPage festival={f} event={e}/>; }
  if (path === "/register") return <Registration />;
  if (path === "/registrations") return <Registrations />;
  if (["/about","/gallery","/contact"].includes(path)) return <ContentPage type={path.slice(1) as "about"|"gallery"|"contact"} />;
  return <Home />;
}
