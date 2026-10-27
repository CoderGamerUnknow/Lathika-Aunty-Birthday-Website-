import { useEffect, useState } from "react";
import { useScrollContext } from "./ScrollContext";
import styles from "./NavBar.module.scss";

const SECTIONS = [
  { id: "celebration", label: "Celebration" },
  { id: "tribute", label: "Tribute" },
  { id: "memories", label: "Memories" },
  { id: "surprise", label: "Surprise" },
  { id: "wishes", label: "Wishes" },
  { id: "quiz", label: "Quiz" },
  { id: "guestbook", label: "Guestbook" },
];

export function NavBar() {
  const { lenis } = useScrollContext();
  const [activeSection, setActiveSection] = useState("celebration");

  useEffect(() => {
    if (!lenis) return undefined;

    const updateActiveSection = ({ scroll = 0 }) => {
      const threshold = window.innerHeight * 0.42;
      let current = SECTIONS[0].id;

      SECTIONS.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop - threshold <= scroll) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    lenis.on("scroll", updateActiveSection);
    updateActiveSection({ scroll: 0 });

    return () => lenis.off("scroll", updateActiveSection);
  }, [lenis]);

  const scrollToSection = (id) => (event) => {
    event.preventDefault();
    const section = document.getElementById(id);

    if (!section) return;

    setActiveSection(id);

    if (lenis) {
      lenis.scrollTo(section, { offset: -88, duration: 1.25 });
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = (event) => {
    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.25 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Birthday tribute navigation">
        <a href="#celebration" className={styles.brand} onClick={scrollToTop}>
          <span className={styles.brandMark} aria-hidden="true">
            L
          </span>
          <span className={styles.brandCopy}>
            <span className={styles.brandName}>For Lathika Aunty</span>
            <span className={styles.brandNote}>A mathematical birthday</span>
          </span>
        </a>

        <div className={styles.links}>
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${styles.link} ${
                activeSection === id ? styles.linkActive : ""
              }`}
              onClick={scrollToSection(id)}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </div>

        <span className={styles.aside}>
          <span className={styles.asideDot} aria-hidden="true" />
          Grade 10 · Mathematics
        </span>
      </nav>
    </header>
  );
}
