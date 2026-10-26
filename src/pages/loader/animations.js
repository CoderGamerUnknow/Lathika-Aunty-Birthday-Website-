import { gsap } from "gsap";

export const animateTitleIn = (loaderRef) => {
  const select = gsap.utils.selector(loaderRef);
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.fromTo(
    select("[data-loader-orbit]"),
    { autoAlpha: 0, scale: 0.92 },
    { autoAlpha: 1, scale: 1, duration: 1.9, ease: "power2.out" },
    0
  )
    .fromTo(
      select("[data-loader-ring]"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 2.7, ease: "power2.inOut" },
      0.25
    )
    .fromTo(
      select("[data-loader-sweep]"),
      { strokeDashoffset: 1, autoAlpha: 0 },
      {
        strokeDashoffset: 0,
        autoAlpha: 1,
        duration: 2.9,
        ease: "power1.inOut",
      },
      0.7
    )
    .fromTo(
      select("[data-loader-eyebrow]"),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.75 },
      0.5
    )
    .fromTo(
      select("[data-loader-word]"),
      { autoAlpha: 0, yPercent: 115, rotate: 2 },
      {
        autoAlpha: 1,
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        stagger: 0.14,
        ease: "power4.out",
      },
      0.8
    )
    .fromTo(
      select("[data-loader-subtitle]"),
      { autoAlpha: 0, y: 10, letterSpacing: "0.62em" },
      {
        autoAlpha: 1,
        y: 0,
        letterSpacing: "0.34em",
        duration: 1.05,
      },
      1.75
    )
    .fromTo(
      select("[data-loader-equation]"),
      { autoAlpha: 0, y: 12, scale: 0.94 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      },
      1.5
    )
    .to(
      select("[data-loader-glow]"),
      { opacity: 1, duration: 1.4, ease: "sine.inOut" },
      2.1
    )
    .to(
      select("[data-loader-content]"),
      { y: -10, duration: 1.2, ease: "power2.inOut" },
      3.9
    )
    .to(
      select("[data-loader-equation]"),
      { autoAlpha: 0.34, duration: 0.9, ease: "power2.inOut" },
      3.95
    );

  return tl;
};

export const progressAnimation = (progressRef, progressNumberRef) => {
  const counter = { value: 0 };
  const tl = gsap.timeline();

  tl.to(
    progressRef.current,
    {
      scaleX: 1,
      duration: 4.8,
      ease: "power2.inOut",
    },
    0
  ).to(
    counter,
    {
      value: 100,
      duration: 4.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (progressNumberRef.current) {
          progressNumberRef.current.textContent = Math.round(counter.value);
        }
      },
    },
    0
  );

  return tl;
};

export const animateLoaderOut = (loaderRef) => {
  const select = gsap.utils.selector(loaderRef);
  const tl = gsap.timeline();

  tl.to(select("[data-loader-ui]"), {
    autoAlpha: 0,
    y: -18,
    duration: 0.5,
    stagger: 0.04,
    ease: "power2.in",
  })
    .to(
      select("[data-loader-orbit]"),
      {
        scale: 1.07,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0
    )
    .fromTo(
      select("[data-loader-flash]"),
      { autoAlpha: 0 },
      { autoAlpha: 0.88, duration: 0.18, ease: "power1.out" },
      0.22
    )
    .to(
      select("[data-loader-flash]"),
      { autoAlpha: 0, duration: 0.5, ease: "power2.out" },
      0.42
    )
    .to(
      loaderRef.current,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.95,
        ease: "power4.inOut",
      },
      0.42
    );

  return tl;
};
