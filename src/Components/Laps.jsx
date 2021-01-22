import { Card } from "@material-ui/core";
import { checkNum } from "../helpers/checkNum";

export const Laps = ({ componentClass, laps = null }) => (
  <Card variant="outlined" className={componentClass}>
    {laps &&
      laps.map((item) => {
        const { h, m, s } = item;

        return (
          <p key={Math.random()}>{`${checkNum(h)}:${checkNum(m)}:${checkNum(
            s
          )}`}</p>
        );
      })}
  </Card>
);
