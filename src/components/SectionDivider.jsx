import React from "react";

export default function SectionDivider({ label, code }) {
  return (
    <div className="section-divider">
      <div className="section-divider-bar">
        <div className="section-divider-flange section-divider-flange-left">
          <span className="section-plaque-rivet section-plaque-rivet-tl" />
          <span className="section-plaque-rivet section-plaque-rivet-tr" />
          <span className="section-plaque-rivet section-plaque-rivet-bl" />
          <span className="section-plaque-rivet section-plaque-rivet-br" />
        </div>

        <div className="section-divider-track">
          <div className="section-divider-display">
            <span className="section-divider-text">{label}</span>
          </div>
        </div>

        <div className="section-divider-flange section-divider-flange-right">
          <span className="section-plaque-rivet section-plaque-rivet-tl" />
          <span className="section-plaque-rivet section-plaque-rivet-tr" />
          <span className="section-plaque-rivet section-plaque-rivet-bl" />
          <span className="section-plaque-rivet section-plaque-rivet-br" />
        </div>

        <div className="section-divider-lights">
          <span className="section-plaque-light section-plaque-light-amber" />
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
  );
}
