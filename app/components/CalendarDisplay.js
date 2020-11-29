const { createStore } = Redux;
const { Provider, connect } = ReactRedux;
const { render } = ReactDOM;
const classnames = classNames;

const {
  getDaysInMonth,
  getDay,
  lastDayOfMonth,
  addMonths,
  subMonths,
  differenceInWeeks,
  format,
  isSameDay,
  differenceInDays,
  lastDayOfYear
} = dateFns;

/* --- COMPONENTS --- */
class CalendarDisplay extends React.Component {
  render() {
    return (
      <div className="CalendarDisplay">
        <article className="board">
          <ConnectedMonths />
          <ConnectedCalendar />
          <ConnectedDetail />
        </article>
      </div>
    );
  }
}

const ConnectedMonths = connect(
  (state) => {
    return {
      selectedMonth: state.selectedMonth
    };
  },
  (dispatch) => {
    return {
      changeSelectedMonth: (month) => {
        dispatch(actions.changeSelectedMonth(month));
      }
    };
  }
)(Months);





const ConnectedCalendar = connect(
  (state) => {
    return {
      year: new Date().getFullYear(),
      month: state.selectedMonth,
      selectedDate: state.selectedDate
    };
  },
  (dispatch) => ({
    changeSelectedDate: (date) => {
      dispatch(actions.changeSelectedDate(date));
    }
  })
)(Calendar);



const ConnectedDetail = connect((state) => {
  return {
    selectedDate: state.selectedDate
  };
})(Detail);

const initialState = {
  selectedMonth: new Date().getMonth(),
  selectedDate: new Date()
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_MONTH":
      return {
        ...state,
        selectedMonth: payload.selectedMonth
      };
    case "CHANGE_DATE":
      const month = new Date(payload.selectedDate).getMonth();

      return {
        ...state,
        selectedMonth: month,
        selectedDate: payload.selectedDate
      };
    default:
      return state;
  }
};

/* --- ACTIONS --- */

const actions = {
  changeSelectedMonth: (month) => {
    return {
      type: "CHANGE_MONTH",
      payload: {
        selectedMonth: month
      }
    };
  },
  changeSelectedDate: (date) => {
    return {
      type: "CHANGE_DATE",
      payload: {
        selectedDate: date
      }
    };
  }
};

/* --- STORE --- */
const store = createStore(reducer, initialState);

// Render the app
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
