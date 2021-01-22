import { makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import "./App.css";
import { Observable } from "rxjs";
import { Timer } from "./Components/Timer";
import { Laps } from "./Components/Laps";
import { ControlButtons } from "./Components/ControlButtons";

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
  lapBtn: {
    marginRight: "20px",
  },
  time: {
    margin: "30px 0",
  },
}));

export const App = () => {
  const classes = useStyles();
  // Стейт для интервалов (кругов к примеру).
  const [laps, setLaps] = useState([]);

  // Стейт со значениями времени, которые отображаются на странице.
  const [timeState, setTimeState] = useState({
    s: 0,
    m: 0,
    h: 0,
  });

  // Стейт для кнопок управления
  const [state, setState] = useState({
    start: false,
    stop: false,
    wait: false,
    reset: false,
  });

  useEffect(() => {
    // Создаем стрим
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

    // Подписку на стрим заносим в переменную, чтобы ниже отписаться от него когда компонент размонтируется.
    const sub = stream$.subscribe({
      next: (fullTime) => setTimeState((prev) => ({ ...prev, ...fullTime })),
    });

    // Отписываемся
    return () => sub.unsubscribe();
  }, [state, timeState.s, timeState.m, timeState.h]);

  return (
    <div className="App">
      Timer app
      <Timer
        s={timeState.s}
        m={timeState.m}
        h={timeState.h}
        componentClass={classes.time}
      />
      <Laps componentClass={classes.lapsCard} laps={laps} />
      <ControlButtons
        state={state}
        setState={setState}
        classes={classes}
        timeState={timeState}
        setLaps={setLaps}
      />
    </div>
  );
};
