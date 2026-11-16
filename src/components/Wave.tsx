/** Waves bezier decorativas: fundo sutil + corte superior (branco → marrom) */
const Wave = () => {
  return (
    <>
      {/* Curvas de fundo sobre o marrom */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M-100 620 C 180 480, 320 760, 620 560 S 980 380, 1100 520"
          fill="none"
          stroke="oklch(98.5% 0.008 230)"
          strokeWidth="2"
          opacity="0.12"
        />
        <path
          d="M-100 700 C 220 560, 400 840, 700 640 S 1000 460, 1120 600"
          fill="none"
          stroke="oklch(98.5% 0.008 230)"
          strokeWidth="2"
          opacity="0.08"
        />
        <path
          d="M-100 180 C 200 60, 380 300, 640 160 S 960 20, 1100 140"
          fill="none"
          stroke="oklch(72% 0.08 72)"
          strokeWidth="2"
          opacity="0.35"
        />
      </svg>

      {/* Corte superior: separa o topo branco do marrom */}
      <svg
        className="absolute left-0 top-0 h-28 w-full"
        viewBox="0 0 400 112"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 H400 V20 C 330 84, 260 18, 190 52 S 60 96, 0 40 Z"
          fill="oklch(98.5% 0.008 230)"
        />
        <path
          d="M0 40 C 60 96, 130 32, 190 52 S 330 84, 400 20"
          fill="none"
          stroke="oklch(72% 0.08 72)"
          strokeWidth="3"
          opacity="0.55"
        />
      </svg>
    </>
  );
};

export default Wave;
