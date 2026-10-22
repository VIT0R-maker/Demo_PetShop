import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { business, services } from './config/business';
import { ContactForm } from './components/ContactForm';
import { Icon } from './components/Icon';

const asset = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;
const nav = [{ href: '#servicos', label: 'Serviços' }, { href: '#sobre', label: 'Sobre' }, { href: '#espaco', label: 'Nosso espaço' }, { href: '#contato', label: 'Contato' }];
const gallery = [
  { image: 'gallery-welcome.webp', alt: 'Tutora ao lado de um cão caramelo e branco na recepção.', caption: 'Bons encontros começam com acolhimento.', label: 'Um lugar para chegar bem' },
  { image: 'gallery-cat.webp', alt: 'Gato de pelagem longa descansando em um banco acolchoado.', caption: 'Conforto nos pequenos detalhes.', label: 'Cada pet tem seu jeito' },
  { image: 'gallery-space.webp', alt: 'Recepção iluminada com banco, almofadas e detalhes em madeira clara.', caption: 'Luz natural, madeira e um convite para ficar.', label: 'Pensado para acolher' },
];

function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const focusable = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) { event.preventDefault(); return; }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  const [firstWord, ...rest] = business.name.split(' ');
  return <a className={`brand${inverse ? ' brand--inverse' : ''}`} href="#inicio" aria-label={`${business.name} — início`}><span className="brand-mark"><Icon name="home" size={29}/></span><span>{firstWord.toLocaleLowerCase('pt-BR')}<span className="brand-pet">{rest.join(' ').toLocaleLowerCase('pt-BR')}</span><small>BANHO · TOSA · CUIDADO</small></span></a>;
}

export default function App() {
  const [selectedService, setSelectedService] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const galleryTrigger = useRef<HTMLButtonElement | null>(null);
  const heroAction = useRef<HTMLAnchorElement>(null);
  const formSection = useRef<HTMLDivElement>(null);
  const pageTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === heroAction.current) setHeroVisible(entry.isIntersecting);
      if (entry.target === formSection.current) setFormVisible(entry.isIntersecting);
      if (entry.target === pageTop.current) setScrolled(!entry.isIntersecting);
    }), { threshold: 0 });
    [heroAction.current, formSection.current, pageTop.current].forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    elements.forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
    const onMotionChange = () => { if (motion.matches) elements.forEach(el => el.classList.remove('will-reveal')); };
    motion.addEventListener('change', onMotionChange);
    return () => { observer.disconnect(); elements.forEach(el => el.classList.remove('will-reveal')); motion.removeEventListener('change', onMotionChange); };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen || lightbox !== null) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen, lightbox]);

  useEffect(() => {
    if (menuOpen) menuRef.current?.showModal();
    else menuRef.current?.close();
  }, [menuOpen]);
  useEffect(() => {
    if (lightbox !== null) lightboxRef.current?.showModal();
    else lightboxRef.current?.close();
  }, [lightbox]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const closeMenu = () => { setMenuOpen(false); menuTrigger.current?.focus(); };
  const closeLightbox = () => { setLightbox(null); galleryTrigger.current?.focus(); };
  const chooseService = (id: string) => {
    setSelectedService(id);
    requestAnimationFrame(() => document.querySelector<HTMLSelectElement>('select[name="interest"]')?.focus({ preventScroll: true }));
  };
  const validUrl = (value: string | null) => { try { return !!value && new URL(value).protocol === 'https:'; } catch { return false; } };

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div ref={pageTop} className="top-sentinel" id="inicio" />
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">{nav.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <a href="#contato" className="button button--primary header-cta">Agendar atendimento<Icon name="arrow" size={17}/></a>
        <button ref={menuTrigger} className="icon-button menu-toggle" aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}><Icon name="menu" size={25}/></button>
      </div>
    </header>

    <main id="conteudo">
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero-photo"><source media="(max-width: 800px)" srcSet={asset('hero-mobile.webp')} width={787} height={735} /><img src={asset('hero.webp')} alt="Cão caramelo e branco e gato de pelagem longa em uma recepção clara e acolhedora." width="1487" height="880" fetchPriority="high" /></picture>
        <div className="container hero-container"><div className="hero-copy">
          <p className="eyebrow hero-enter"><span className="small-line"/>BANHO, TOSA E CUIDADO</p>
          <h1 id="hero-title" className="hero-enter">Carinho em cada cuidado.<br/><span>Bem-estar em cada visita.</span></h1>
          <p className="hero-description hero-enter">Banho, tosa e cuidados para cães e gatos em um ambiente acolhedor, pensado para o conforto do seu melhor amigo.</p>
          <div className="hero-actions hero-enter"><a ref={heroAction} href="#contato" className="button button--primary">Agendar banho e tosa<Icon name="arrow"/></a><a href="#servicos" className="text-link">Conhecer os serviços<Icon name="chevron" size={15}/></a></div>
          <p className="hero-support hero-enter"><Icon name="heart" size={19}/><span>Converse com a equipe e encontre<br className="desktop-break"/> o cuidado ideal para o seu pet.</span></p>
        </div></div>
        <div className="hero-footnote"><span>Cuidado que acolhe.</span><span>Conforto que se sente.</span></div>
      </section>

      <section className="section services-section" id="servicos" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading" data-reveal><div><p className="eyebrow">UM CARINHO PARA CADA NECESSIDADE</p><h2 id="services-title">Cuidados que fazem parte<br className="desktop-break"/> de uma vida feliz.</h2></div><p>Conheça nossas opções e converse com a equipe sobre as necessidades do seu pet.</p></div>
          <div className="services-grid">{services.map((service, index) => <article className="service-card" key={service.id} data-reveal style={{ '--reveal-delay': `${index % 3 * 65}ms` } as React.CSSProperties}>
            <div className="service-photo"><img src={asset(service.image)} alt={service.alt} loading="lazy" width="426" height="132" /></div>
            <div className="service-content"><h3>{service.title}</h3><p>{service.description}</p><a href="#contato" className="service-link" onClick={() => chooseService(service.id)}>{service.cta}<Icon name="arrow" size={18}/></a></div>
          </article>)}</div>
        </div>
      </section>

      <section className="section about-section" id="sobre" aria-labelledby="about-title"><div className="container about-grid">
        <div className="about-photo" data-reveal><img src={asset('about.webp')} alt="Profissional escovando com cuidado a pelagem de um cão caramelo e branco." loading="lazy" width="650" height="301"/><div className="photo-note"><Icon name="heart" size={21}/><span>O carinho mora nos detalhes.</span></div></div>
        <div className="about-copy" data-reveal><p className="eyebrow">NOSSO JEITO DE CUIDAR</p><h2 id="about-title">Cuidado próximo, do primeiro contato à hora de voltar para casa.</h2><p>Cada pet tem seu jeito. Nossa proposta é acolher cães, gatos e seus tutores com atenção, em um espaço organizado e confortável.</p><ul className="care-list"><li><Icon name="check"/>Atenção às necessidades de cada pet.</li><li><Icon name="check"/>Ambiente acolhedor e organizado.</li><li><Icon name="check"/>Conversa clara com o tutor.</li></ul><a href="#espaco" className="text-link">Conhecer nosso espaço<Icon name="arrow" size={18}/></a></div>
      </div></section>

      <section className="section gallery-section" id="espaco" aria-labelledby="gallery-title"><div className="container">
        <div className="section-heading section-heading--center" data-reveal><p className="eyebrow">BEM-VINDO À {business.name.toLocaleUpperCase('pt-BR')}</p><h2 id="gallery-title">Um espaço para se sentir bem.</h2><p>Luz natural, conforto e pequenos detalhes que tornam a visita<br className="desktop-break"/> mais acolhedora para pets e tutores.</p></div>
        <div className="gallery-grid">{gallery.map((photo, index) => <button key={photo.image} className={`gallery-item gallery-item--${index}`} aria-label={`Ampliar imagem: ${photo.label}`} onClick={event => { galleryTrigger.current = event.currentTarget; setLightbox(index); }} data-reveal>
          <img src={asset(photo.image)} alt={photo.alt} loading="lazy" width={index === 0 ? 820 : 538} height={index === 0 ? 600 : 280}/><span className="gallery-caption">{photo.label}</span><span className="gallery-expand"><Icon name="expand" size={17}/></span>
        </button>)}</div>
        <div className="gallery-invitation" data-reveal><Icon name="leaf" size={29}/><p>Seu pet merece atenção.<br/><strong>Você merece tranquilidade.</strong></p><a href="#contato" className="button button--outline">Quero conhecer a {business.name}<Icon name="arrow" size={18}/></a></div>
      </div></section>

      <section className="conversion" aria-labelledby="conversion-title">
        <img className="conversion-photo" src={asset('facade.webp')} alt="Fachada de um pet shop ao entardecer, com iluminação acolhedora e portas de vidro." loading="lazy" width="867" height="473"/>
        <div className="container conversion-inner"><div className="conversion-copy" data-reveal><p className="eyebrow">O PRÓXIMO CUIDADO COMEÇA AQUI</p><h2 id="conversion-title">Vamos cuidar do seu melhor amigo?</h2><p>Conte um pouco sobre o seu pet e consulte os serviços e horários com a nossa equipe.</p><a href="#contato" className="button button--primary"><Icon name="message"/>Agendar pelo WhatsApp<Icon name="arrow" size={18}/></a></div></div>
      </section>

      <section className="section contact-section" id="contato" aria-labelledby="contact-title"><div className="container">
        <div className="section-heading" data-reveal><div><p className="eyebrow">VAMOS CONVERSAR</p><h2 id="contact-title">Um primeiro olá.<br/>Muitos bons cuidados.</h2></div><p>Estamos preparando cada detalhe<br className="desktop-break"/> para receber você e seu pet.</p></div>
        <div className="contact-grid"><div className="location-column" data-reveal>
          {business.address && validUrl(business.mapEmbedUrl) ? <iframe className="map-frame" title={`Localização da ${business.name}`} src={business.mapEmbedUrl!} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/> : <div className="map-placeholder"><div className="map-lines" aria-hidden="true"/><span className="map-pin"><Icon name="pin" size={30}/></span><h3>Localização em breve</h3><p>Um espaço para acolher.<br/>Em breve, os detalhes para sua visita.</p></div>}
          <div className="location-details"><div><Icon name="pin" size={21}/><div><h3>Onde nos encontrar</h3><p>{business.address || 'Nosso endereço será divulgado em breve.'}</p>{business.address && validUrl(business.directionsUrl) && <a className="text-link" href={business.directionsUrl!} target="_blank" rel="noreferrer">Como chegar<Icon name="arrow" size={16}/></a>}</div></div><div><Icon name="clock" size={21}/><div><h3>Horário de atendimento</h3><p>{business.hours || 'Horários de atendimento em breve.'}</p></div></div></div>
        </div><div ref={formSection} className="contact-form-panel" data-reveal><h3>Conte sobre seu melhor amigo</h3><p className="form-intro">O cuidado começa conhecendo um pouquinho de vocês.</p><ContactForm selectedService={selectedService} onServiceChange={setSelectedService}/></div></div>
      </div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-top"><div><Brand/><p>{business.description}</p>{business.address && <p>{business.address}</p>}{business.hours && <p>{business.hours}</p>}</div><nav aria-label="Navegação do rodapé">{nav.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav><div className="footer-message"><Icon name="heart" size={23}/><p>Um lugar de cuidado.<br/>Um jeitinho de casa.</p>{validUrl(business.instagram) && <a href={business.instagram!} target="_blank" rel="noreferrer">Instagram<Icon name="arrow" size={16}/></a>}</div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} {business.name}. Todos os direitos reservados.</small><small>Feito para quem faz parte da família.</small></div></div></footer>

    {!heroVisible && !formVisible && !menuOpen && lightbox === null && <div className="mobile-booking"><a className="button button--primary" href="#contato">Agendar atendimento<Icon name="arrow"/></a></div>}
    <dialog id="mobile-menu" ref={menuRef} className="mobile-menu" aria-label="Menu principal" onKeyDown={containDialogFocus} onCancel={event => { event.preventDefault(); closeMenu(); }} onClose={() => setMenuOpen(false)} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}><div className="mobile-menu-inner"><div className="mobile-menu-heading"><span>Seu pet em casa.</span><button autoFocus className="icon-button" aria-label="Fechar menu" onClick={closeMenu}><Icon name="close"/></button></div><nav aria-label="Navegação mobile">{nav.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}<Icon name="arrow"/></a>)}</nav><a className="button button--primary" href="#contato" onClick={closeMenu}>Agendar atendimento<Icon name="arrow"/></a></div></dialog>
    <dialog ref={lightboxRef} className="lightbox" aria-label="Fotografia do nosso espaço" onKeyDown={containDialogFocus} onCancel={event => { event.preventDefault(); closeLightbox(); }} onClose={() => setLightbox(null)} onClick={event => { if (event.target === event.currentTarget) closeLightbox(); }}>{lightbox !== null && <div className="lightbox-inner"><button autoFocus className="icon-button lightbox-close" aria-label="Fechar imagem" onClick={closeLightbox}><Icon name="close" size={24}/></button><img src={asset(gallery[lightbox].image)} alt={gallery[lightbox].alt}/><p>{gallery[lightbox].caption}</p></div>}</dialog>
  </>;
}
