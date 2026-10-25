import React from "react";

function Flange({ side }) {
  return (
    <div className={`section-divider-flange section-divider-flange-${side}`}>
      <span className="section-plaque-rivet section-plaque-rivet-tl" />
      <span className="section-plaque-rivet section-plaque-rivet-tr" />
      <span className="section-plaque-rivet section-plaque-rivet-bl" />
      <span className="section-plaque-rivet section-plaque-rivet-br" />
      <div className="section-divider-vents">
        <span className="section-divider-slat" />
        <span className="section-divider-slat" />
        <span className="section-divider-slat" />
        <span className="section-divider-slat" />
        <span className="section-divider-slat" />
      </div>
    </div>
  );
}

export default function SectionDivider({ label, code }) {
  return (
    <div className="section-divider">
      <div className="section-divider-frame">
        <div className="section-divider-bar">
          <span className="section-plaque-rivet section-plaque-rivet-mt1" />
          <span className="section-plaque-rivet section-plaque-rivet-mt2" />
          <span className="section-plaque-rivet section-plaque-rivet-mt3" />
          <span className="section-plaque-rivet section-plaque-rivet-mt4" />
          <span className="section-plaque-rivet section-plaque-rivet-mt5" />
          <span className="section-plaque-rivet section-plaque-rivet-mb1" />
          <span className="section-plaque-rivet section-plaque-rivet-mb2" />
          <span className="section-plaque-rivet section-plaque-rivet-mb3" />
          <span className="section-plaque-rivet section-plaque-rivet-mb4" />
          <span className="section-plaque-rivet section-plaque-rivet-mb5" />

          <Flange side="left" />

          <div className="section-divider-track">
            <span className="section-plaque-rivet section-plaque-rivet-track-tl" />
            <span className="section-plaque-rivet section-plaque-rivet-track-tr" />
            <span className="section-plaque-rivet section-plaque-rivet-track-bl" />
            <span className="section-plaque-rivet section-plaque-rivet-track-br" />
            <div className="section-divider-display">
              <div className="section-divider-display-inner">
                <span className="section-divider-text">{label}</span>
              </div>
            </div>
          </div>

          <Flange side="right" />

          <div className="section-divider-lights">
            <span className="section-plaque-light section-plaque-light-amber" />
            <span className="section-plaque-light section-plaque-light-teal" />
            <span className="section-plaque-light section-plaque-light-red" />
            <span className="section-plaque-light section-plaque-light-dim" />
          </div>

          <div className="section-divider-strip">
            <span>{code}</span>
            <span className="section-divider-hex">
              0x4B2E · 0x1A90 · 0xF03C · 0x77D1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
