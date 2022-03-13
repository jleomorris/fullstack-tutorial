import { Key } from "react";
import styled, { css } from "react-emotion";

const breakpoints = {
  mobile: 0,
  tabletSm: 500,
  tablet: 768,
  desktopSm: 1200,
  desktopMed: 1600,
  desktop: 1920,
};

export const mq = (n: keyof typeof breakpoints) => {
  return `@media (min-width: ${breakpoints[n]}px)`;
};
