import { ButtonGroup, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import "./App.css";
import { interval, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { checkNum } from "./helpers/checkNum";

const seconds$ = interval(100).pipe(
  take(60),
  map((v) => checkNum(v))
);

export const App = () => {
  const [timeState, setTimeState] = useState({
    s: 0,
    m: 0,
    h: 0,
  });

  const [state, setState] = useState({
    start: false,
    wait: false,
    reset: false,
  });

  useEffect(() => {
    const stream$ = new Observable((observer) => {
      let s = timeState.s,
        m = timeState.m,
        h = timeState.h;
      if (state.start || state.reset) {
        const interval = setInterval(() => {
          if (s === 59) {
            if(m === 59) {
              h++;
              m = 0
            } else {
              m++
            }
            s = 0;
          } else {
            s++;
            observer.next({ s, m, h });
          }
        }, 1000);
      }
    });

    const sub = stream$.subscribe({
      next: (v) => setTimeState({ ...timeState, ...v }),
    });

    return () => sub.unsubscribe();
  }, [state]);

  return (
    <div className="App">
      Timer app
      <h1>
        {checkNum(timeState.h)}:{checkNum(timeState.m)}:{checkNum(timeState.s)}
      </h1>
      <ButtonGroup>
        <Button onClick={() => setState({ ...state, start: !state.start })}>
          {!state.start ? "Start" : "Stop"}
        </Button>
        <Button onDoubleClick={() => console.log('WAIT!')}>Wait</Button>
        <Button onClick={() => setState({...state, reset: true})}>Reset</Button>
      </ButtonGroup>
    </div>
  );
};
