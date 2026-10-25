import React from "react";
import SciFiDoorPanel from "./SciFiDoorPanel";

export default function SectionDivider({ label, code }) {
  return (
    <div className="section-divider">
      <div className="shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
        <SciFiDoorPanel
          theme="coral"
          message={label}
          serial={code}
          showToggle={false}
          maxHeight={250}
        />
      </div>
    </div>
  );
}
