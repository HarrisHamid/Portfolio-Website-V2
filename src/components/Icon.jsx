import React from "react";
import { icon } from "../assets/icons.js";

// Renders one of the custom line icons from icons.js (inherits text color).
const Icon = ({ name, ...opts }) => (
  <span
    className="icon-wrap"
    dangerouslySetInnerHTML={{ __html: icon(name, opts) }}
  />
);

export default Icon;
