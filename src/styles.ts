import { css } from "lit";

export const launcherStyles = css`
  :host {
    display: block;
    color: var(--primary-text-color, #f8f8fa);
    font-family:
      -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI",
      sans-serif;
  }
  ha-card {
    display: block;
    overflow: hidden;
    padding: clamp(18px, 3vw, 34px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--ha-card-border-radius, 26px);
    background:
      radial-gradient(
        circle at 18% -10%,
        rgba(126, 73, 184, 0.22),
        transparent 34%
      ),
      radial-gradient(
        circle at 96% 20%,
        rgba(20, 104, 111, 0.16),
        transparent 30%
      ),
      linear-gradient(145deg, rgba(30, 29, 36, 0.96), rgba(7, 8, 12, 0.98));
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
  }
  header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin: 0 2px clamp(20px, 3vw, 32px);
  }
  h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 650;
    letter-spacing: -0.035em;
  }
  .power {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-left: auto;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.58);
    background: radial-gradient(
      circle at 38% 30%,
      #45474d,
      #191a1e 68%,
      #0d0e10
    );
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.16),
      0 5px 12px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    transition:
      color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
  }
  .power svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-width: 2;
  }
  .power.on {
    border-color: rgba(100, 230, 139, 0.56);
    color: #d8ffe4;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.18),
      0 0 0 2px rgba(86, 214, 126, 0.17),
      0 0 18px rgba(86, 214, 126, 0.5);
  }
  .power:hover,
  .power:focus-visible {
    color: #fff;
    outline: none;
    transform: scale(1.055);
  }
  .power:active {
    transform: scale(0.94);
  }
  .power.busy {
    opacity: 0.62;
    cursor: wait;
    animation: power-pulse 0.8s ease-in-out infinite alternate;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--launcher-columns), minmax(0, 1fr));
    gap: clamp(17px, 2.2vw, 28px) clamp(13px, 1.8vw, 23px);
  }
  .app {
    min-width: 0;
    padding: 0;
    border: 0;
    color: inherit;
    font: inherit;
    text-align: center;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .app:disabled {
    cursor: wait;
  }
  .art,
  .placeholder {
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1 / 1;
    transform: translateZ(0);
    transition:
      transform 180ms cubic-bezier(0.2, 0.75, 0.2, 1),
      border-color 180ms ease;
  }
  .art.fallback-artwork,
  .placeholder {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 22.37%;
    corner-shape: squircle;
    background: var(--tile-bg, rgba(255, 255, 255, 0.07));
  }
  .app:hover .art,
  .app:focus-visible .art {
    border-color: rgba(255, 255, 255, 0.52);
    transform: translateY(-4px) scale(1.035);
  }
  .app:active .art {
    transform: scale(0.97);
  }
  .app:focus-visible {
    outline: none;
  }
  .app.active .art {
    border-color: rgba(255, 255, 255, 0.92);
  }
  .fallback {
    color: #fff;
    font-size: clamp(19px, 3vw, 36px);
    font-weight: 760;
    letter-spacing: -0.045em;
  }
  .art img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.012);
  }
  .art img.contain {
    object-fit: contain;
  }
  .label {
    display: block;
    overflow: hidden;
    margin: 10px 5px 0;
    color: rgba(255, 255, 255, 0.88);
    font-size: clamp(11px, 1.4vw, 14px);
    font-weight: 510;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .app.active .label {
    color: #fff;
    font-weight: 650;
  }
  .spinner {
    position: absolute;
    width: 25px;
    height: 25px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  .placeholder {
    background: rgba(255, 255, 255, 0.055);
    animation: shimmer 1.25s ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }
  .empty {
    display: grid;
    gap: 7px;
    min-height: 150px;
    place-content: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.55);
    text-align: center;
  }
  .empty strong {
    color: rgba(255, 255, 255, 0.88);
    font-size: 17px;
  }
  .error {
    margin-top: 22px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 120, 120, 0.25);
    border-radius: 12px;
    color: #ffc5c5;
    font-size: 13px;
    background: rgba(150, 30, 30, 0.18);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes power-pulse {
    to {
      filter: brightness(1.28);
    }
  }
  @keyframes shimmer {
    from {
      opacity: 0.45;
    }
    to {
      opacity: 1;
    }
  }
  @media (max-width: 600px) {
    ha-card {
      padding: 18px 14px 22px;
      border-radius: 22px;
    }
    header {
      margin-bottom: 20px;
    }
    .grid {
      grid-template-columns: repeat(
        var(--launcher-mobile-columns),
        minmax(0, 1fr)
      );
      gap: 17px 11px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .art {
      transition: none;
    }
    .app:hover .art,
    .app:focus-visible .art {
      transform: none;
    }
    .placeholder,
    .spinner {
      animation-duration: 2.5s;
    }
    .power.busy {
      animation: none;
    }
  }
`;
