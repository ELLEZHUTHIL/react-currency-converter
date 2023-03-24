import { useReducer, useEffect } from "react";

const initialState = {
  fxRate: 1.1,
  inputValue: 0,
  switchValue: "EUR",
  override: "No",
  historicalData: [],
  userFxRate: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FXRATE":
      return { ...state, fxRate: action.payload };
    case "SET_INPUTVALUE":
      return { ...state, inputValue: action.payload };
    case "SET_SWITCHVALUE":
      return { ...state, switchValue: action.payload };
    case "SET_OVERRIDE":
      return { ...state, override: action.payload };
    case "SET_HISTORICALDATA":
      return { ...state, historicalData: action.payload };
    case "SET_USERFXRATE":
      return { ...state, userFxRate: action.payload };
    default:
      return state;
  }
}

function ExchangeConverter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.fxRate)
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({
        type: "SET_FXRATE",
        payload: Number(
          (1.1 + (Math.random() * (0.05 - (-0.05) + -0.05))).toFixed(2)
        ),
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, [state.fxRate]);

  const handleInputChange = (e) => {
    dispatch({
      type: "SET_INPUTVALUE",
      payload: e.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    dispatch({
      type: "SET_SWITCHVALUE",
      payload: e.target.value,
    });
  };

  const handleOverrideChange = (e) => {
    dispatch({
      type: "SET_OVERRIDE",
      payload: e.target.value,
    });
  };

  const convert = () => {
    if (state.inputValue == 0) return;
    if (state.override === "Yes" && state.userFxRate == 0) return;
    let convertedValue;
    let flag = state.override === "Yes" ? true : false;
    if (
      flag &&
      Math.abs(state.userFxRate - state.fxRate) / state.fxRate > 0.02
    ) {
      flag = !flag;
    }
    if (state.switchValue === "EUR") {
      convertedValue =
        state.inputValue * (flag ? state.userFxRate : state.fxRate);
    } else {
      convertedValue =
        state.inputValue / (flag ? state.userFxRate : state.fxRate);
    }
    convertedValue = Number(convertedValue.toFixed(2));
    if (state.historicalData.length > 4) {
      state.historicalData.pop();
    }
    let rate = flag ? state.userFxRate : state.fxRate;
    let overrideFlag = flag ? "Yes" : "No";
    dispatch({
      type: "SET_HISTORICALDATA",
      payload: [
        {
          rate,
          overrideFlag,
          inputValue: state.inputValue,
          switchValue: state.switchValue,
          convertedValue,
          currencyTag:state.switchValue==='EUR'?'USD':'EUR',
        },
        ...state.historicalData,
      ],
    });
  };

  const validNumber = (event) => {
    if ((event.which >= 48 && event.which <= 57) || event.which == 46) {
    } else {
      event.preventDefault();
    }
  };

  return (
    <div className="container my-3">
      <div className="d-flex justify-content-center">
        <div style={{ width: "555px" }}>
          <div>
            <h2 className="text-center text-danger">Currency Converter</h2>
          </div>
          <div className="mb-3">
            <label htmlFor="inputValue" className="form-label">
              Amount:
            </label>
            <input
              type="number"
              className="form-control"
              id="inputValue"
              value={state.inputValue}
              onChange={handleInputChange}
              onKeyPress={validNumber}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="switchValue" className="form-label">
              From:
            </label>
            <select
              className="form-select"
              id="switchValue"
              value={state.switchValue}
              onChange={handleSwitchChange}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="userFxRate" className="form-label">
              Custom exchange rate (optional):
            </label>
            <input
              type="number"
              className="form-control"
              id="userFxRate"
              value={state.userFxRate}
              onChange={(e) =>
                dispatch({
                  type: "SET_USERFXRATE",
                  payload: e.target.value,
                })
              }
              onKeyPress={validNumber}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="override" className="form-label">
              Override system rate?
            </label>
            <select
              className="form-select"
              id="override"
              value={state.override}
              onChange={handleOverrideChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary" onClick={convert}>
              Convert
            </button>
          </div>
          <div className="mb-3">
            {state.historicalData.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Fx Rate</th>
                    <th scope="col">Input</th>
                    <th scope="col">Converted</th>
                    <th scope="col">Override</th>
                  </tr>
                </thead>
                <tbody>
                  {state.historicalData.map((data, i) => (
                    <tr key={i}>
                      <td>{new Date().toLocaleDateString()}</td>
                      <td>{data.switchValue}</td>
                      <td>
                        {data.currencyTag}
                      </td>
                      <td>{data.rate}</td>
                      <td>{data.inputValue}</td>
                      <td>{data.convertedValue}</td>
                      <td>{data.overrideFlag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExchangeConverter;
