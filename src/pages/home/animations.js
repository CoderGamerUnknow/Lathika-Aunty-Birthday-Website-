import { gsap } from "gsap";

export const animateHomeIn = (page) => {
  const select = gsap.utils.selector(page);
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.fromTo(
    select("[data-hero-eyebrow]"),
    { autoAlpha: 0, y: 12 },
    { autoAlpha: 1, y: 0, duration: 0.7 },
    0.08
  )
    .fromTo(
      select("[data-hero-line]"),
      { autoAlpha: 0, yPercent: 112 },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1.06,
        stagger: 0.12,
        ease: "power4.out",
      },
      0.16
    )
    .fromTo(
      select("[data-hero-lead]"),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.88 },
      0.58
    )
    .fromTo(
      select("[data-hero-chip]"),
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.08,
      },
      0.78
    )
    .fromTo(
      select("[data-hero-scroll]"),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.72 },
      0.98
    )
    .fromTo(
      select("[data-hero-lab]"),
      { autoAlpha: 0, y: 28, scale: 0.986 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.08,
        ease: "power3.out",
      },
      0.22
    );

  return tl;
};
