import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Studio",
    links: [
      { label: "About", to: "/about-us" },
      { label: "Work", to: "/work" },
      { label: "Services", to: "/services" },
      { label: "Journal", to: "/journal" },
    ],
  },
  {
    title: "Engage",
    links: [
      { label: "Start Project", to: "/start-project" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact-us" },
      { label: "Apply", to: "/application" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "X / Twitter", href: "https://twitter.com/vtrc_tech" },
  { label: "GitHub", href: "https://github.com/vtrc-tech" },
  { label: "Email", href: "mailto:hello@vtrc.tech" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-black text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 md:px-16 md:py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/20 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div className="flex flex-col items-start">
            <div className="mb-8 flex items-center gap-4">
              <div>
                <img
                  src="/VTRCLogo.png"
                  alt="VTRC Technologies"
                  className="h-10 w-auto object-contain scale-120 invert-100"
                />
              </div>
              <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.32em] text-white/60">
                VTRC Technologies
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-b border-white/20 py-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div>
            <p className="m-0 max-w-[420px] font-['Geist'] text-[17px] leading-[1.7] text-white/70">
              Designing and developing custom websites, web apps, and digital
              platforms for businesses that want a sharper online presence.
            </p>
            <a
              href="mailto:hello@vtrc.tech"
              className="mt-6 inline-flex items-center gap-2 font-['Syne'] text-[22px] font-bold text-white no-underline transition-opacity duration-200 hover:opacity-70"
            >
              hello@vtrc.tech
              <span className="material-symbols-outlined text-[20px]">
                north_east
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {footerSections.map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <span className="mb-4 block font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                  {section.title}
                </span>
                <div className="flex flex-col items-start gap-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="font-['Geist'] text-[15px] font-medium text-white/75 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}

            <nav aria-label="Network">
              <span className="mb-4 block font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                Network
              </span>
              <div className="flex flex-col items-start gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="font-['Geist'] text-[15px] font-medium text-white/75 no-underline transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="m-0 font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
            Copyright {currentYear} VTRC Technologies. All rights reserved.
          </p>
          <p className="m-0 font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
            Websites, interfaces, and digital products.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
