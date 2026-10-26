import PropTypes from "prop-types";

export function DemoIcon({ id }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.35",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (id === "trigonometry") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 12l5.1-5.1" />
        <path d="M4.4 12H3M12 4.4V3" opacity="0.5" />
        <circle cx="17.1" cy="6.9" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (id === "parabola") {
    return (
      <svg {...common}>
        <path d="M3.5 19.5Q12 2.8 20.5 19.5" />
        <path d="M3.5 20.5h17" opacity="0.45" />
        <circle cx="12" cy="14.7" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (id === "coordinates") {
    return (
      <svg {...common}>
        <path d="M4 20V4.4M4 20h16" opacity="0.6" />
        <path d="M4 12h16M12 4v16" opacity="0.3" />
        <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
        <path d="M16 8l3.4-3.4" opacity="0.6" />
      </svg>
    );
  }

  if (id === "circles") {
    return (
      <svg {...common}>
        <circle cx="10.2" cy="12" r="6.4" />
        <path d="M15.6 7.2L21 17.4" />
        <path d="M10.2 12l4.3-3.4" opacity="0.65" />
        <path d="M15.6 7.2h3.1v3.1" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3.3l8.2 6-3.1 9.5H6.9L3.8 9.3 12 3.3z" />
      <path d="M12 3.3L12 12l8.2 6.8M12 12L3.8 9.3M12 12l3.1 6.8" opacity="0.28" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

DemoIcon.propTypes = {
  id: PropTypes.oneOf([
    "trigonometry",
    "parabola",
    "coordinates",
    "circles",
    "polygons",
  ]).isRequired,
};
