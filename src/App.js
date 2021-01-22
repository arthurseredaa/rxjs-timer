import { ButtonGroup, Button, makeStyles, Card } from "@material-ui/core";
import { useState, useEffect } from "react";
import "./App.css";
import { Observable } from "rxjs";
import { checkNum } from "./helpers/checkNum";
import ReactTooltip from "react-tooltip";

const useStyles = makeStyles(() => ({
  wait: {
    backgroundColor: "#ffecb3",
  },
  start: {
    backgroundColor: "#c8e6c9",
  },
  stop: {
    backgroundColor: "#f8bbd0",
  },
  reset: {
    backgroundColor: "#ff3d00",
  },
  lapsCard: {
    height: "300px",
    width: "500px",
    textAlign: "center",
    overflow: "auto",
    margin: "0 0 30px",
    "& > p": {
      fontWeight: "700",
    },
  },
  lap: {
    marginRight: "20px",
  },
  time: {
    margin: "30px 0",
  },
}));

export const App = () => {
  const classes = useStyles();

  const [laps, setLaps] = useState([]);

  const [timeState, setTimeState] = useState({
    s: 0,
    m: 0,
    h: 0,
  });

  const [state, setState] = useState({
    start: false,
    stop: false,
    wait: false,
    reset: false,
  });

  useEffect(() => {
    const stream$ = new Observable((observer) => {
      let s = timeState.s,
        m = timeState.m,
        h = timeState.h;

      if (state.start && !state.reset) {
        const interval = setInterval(() => {
          if (state.wait) clearInterval(interval);
          if (s === 59) {
            if (m === 59) {
              h++;
              m = 0;
            } else {
              m++;
            }
            s = 0;
          } else {
            s++;
            observer.next({ s, m, h });
          }
        }, 1000);
      } else if (state.stop || state.reset) {
        if (state.reset) setState({ ...state, reset: false });

        observer.next({ s: 0, m: 0, h: 0 });
      }
    });

    const sub = stream$.subscribe({
      next: (fullTime) => setTimeState((prev) => ({ ...prev, ...fullTime })),
    });

    return () => sub.unsubscribe();
  }, [state, timeState.s, timeState.m, timeState.h]);

  return (
    <div className="App">
      Timer app
      <h1 className={classes.time}>
        {checkNum(timeState.h)}:{checkNum(timeState.m)}:{checkNum(timeState.s)}
      </h1>
      <Card variant="outlined" className={classes.lapsCard}>
        {laps &&
          laps.map((item) => {
            const { h, m, s } = item;

            return <p key={`_${s}-${h}-${m}`}>{`${checkNum(h)}:${checkNum(m)}:${checkNum(s)}`}</p>;
          })}
      </Card>
      <div>
        <Button
          className={classes.lap}
          variant="outlined"
          color="primary"
          onClick={() =>
            setLaps((prev) => [
              ...prev,
              { s: timeState.s, m: timeState.m, h: timeState.h },
            ])
          }
        >
          Lap
        </Button>
        <ButtonGroup>
          <Button
            className={state.start ? classes.stop : classes.start}
            onClick={() => {
              if (state.start) {
                setState({ ...state, stop: true, start: false });
              } else {
                setState({ ...state, start: true, stop: false });
              }
            }}
          >
            {!state.start || state.wait ? "Start" : "Stop"}
          </Button>
          <Button
            data-tip="Кликните два раза, чтобы приостановить таймер"
            className={classes.wait}
            onDoubleClick={() => {
              setState({ ...state, start: !state.start });
            }}
          >
            Wait
          </Button>
          <ReactTooltip place="top" type="dark" effect="float" />
          <Button
            className={classes.reset}
            onClick={() => setState({ ...state, reset: true })}
          >
            Reset
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
