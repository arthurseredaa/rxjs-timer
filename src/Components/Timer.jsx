import { checkNum } from "../helpers/checkNum";

export const Timer = ({ s, m, h, componentClass = null }) => (
  <h1 className={componentClass}>
    {checkNum(h)}:{checkNum(m)}:{checkNum(s)}
  </h1>
);
