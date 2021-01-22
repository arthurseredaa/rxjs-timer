import { ButtonGroup, Button } from "@material-ui/core";
import ReactTooltip from "react-tooltip";

export const ControlButtons = ({
  timeState,
  classes,
  setState,
  state,
  setLaps,
}) => (
  <div>
    <Button
      className={classes.lapBtn}
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
        data-tip="Нажмите два раза, чтобы приостановить таймер"
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
);
