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
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <article className="board">
          <ConnectedMonths />
          <ConnectedCalendar />
          <ConnectedDetail />
        </article>
      </div>
    );
  }
}

const MONTHS_CON = [
  {
    key: "January",
    short: "Jan."
  },
  {
    key: "February",
    short: "Feb."
  },
  {
    key: "March",
    short: "Mar."
  },
  {
    key: "April",
    short: "Apr."
  },
  {
    key: "May",
    short: "May."
  },
  {
    key: "June",
    short: "Jun."
  },
  {
    key: "July ",
    short: "Jul."
  },
  {
    key: "August",
    short: "Aug."
  },
  {
    key: "September",
    short: "Sep."
  },
  {
    key: "October,",
    short: "Oct."
  },
  {
    key: "November",
    short: "Nov."
  },
  {
    key: "December",
    short: "Dec."
  }
];

class Months extends React.PureComponent {
  renderItem = (item, index) => {
    const { changeSelectedMonth, selectedMonth } = this.props;
    const month = index;
    const cls = classnames("month", {
      active: month === selectedMonth
    });

    return (
      <div
        className={cls}
        key={month}
        onClick={(e) => changeSelectedMonth(month)}
      >
        {item.short}
      </div>
    );
  };
  render() {
    return (
      <section className="months">
        {MONTHS_CON.map(this.renderItem)}
        <span className="indicator" />
      </section>
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class Calendar extends React.PureComponent {
  static defaultProps = {
    renderDateSubjects: () => null,
    changeSelectedDate: () => null
  };
  constructor(props) {
    super(props);
    this.state = {
      year: null,
      month: null,
      selectedDate: null,
      dates: []
    };
  }
  static makeMonthDates = (props) => {
    const { year, month } = props;
    const preDates = [];
    const dates = [];
    const nextDates = [];

    const preMonth = subMonths(new Date(year, month), 1);
    const preMonthLastDate = lastDayOfMonth(preMonth);
    let preMonthDayOffset = getDay(preMonthLastDate);
    while (preMonthDayOffset >= 0 && preMonthDayOffset < 6) {
      preDates.push({
        inMonth: false,
        date: new Date(
          `${preMonthLastDate.getFullYear()}-${
            preMonthLastDate.getMonth() + 1
          }-${preMonthLastDate.getDate() - preMonthDayOffset}`
        )
      });
      preMonthDayOffset--;
    }

    const totalDaysInCurrentMonth = getDaysInMonth(new Date(year, month));
    const currentMonthLastDate = new Date(
      `${year}-${month + 1}-${totalDaysInCurrentMonth}`
    );
    for (let day = 1; day < totalDaysInCurrentMonth + 1; day++) {
      dates.push({
        inMonth: true,
        date: new Date(`${year}-${month + 1}-${day}`)
      });
    }
    const nextMonth = addMonths(new Date(year, month), 1);
    const nextMonthFirstDate = new Date(nextMonth.setDate(1));
    let nextMonthDayOffset = 6 - getDay(currentMonthLastDate);
    for (let i = 0; i < nextMonthDayOffset; i++) {
      nextDates.push({
        inMonth: false,
        date: new Date(
          `${nextMonthFirstDate.getFullYear()}-${
            nextMonthFirstDate.getMonth() + 1
          }-${nextMonthFirstDate.getDate() + i}`
        )
      });
    }

    return [...preDates, ...dates, ...nextDates];
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.year !== prevState.year ||
      nextProps.month !== prevState.month ||
      nextProps.selectedDate !== prevState.selectedDate
    ) {
      return {
        year: nextProps.year,
        month: nextProps.month,
        selectedDate: nextProps.selectedDate,
        dates: Calendar.makeMonthDates(nextProps)
      };
    }
    return null;
  }
  renderDate(dateObj) {
    const { changeSelectedDate, renderDateSubjects } = this.props;
    const { selectedDate } = this.state;
    const { date, inMonth } = dateObj;
    const cls = classnames("calendar-date", {
      "in-month": inMonth,
      highlight: inMonth && isSameDay(date, new Date(selectedDate))
    });
    return (
      <div
        className={cls}
        key={date.getTime()}
        onClick={(e) => changeSelectedDate(date)}
      >
        {format(date, "DD")}
        {renderDateSubjects(date)}
      </div>
    );
  }
  renderDay(day) {
    return (
      <div className="calendar-day" key={day}>
        {day}
      </div>
    );
  }
  renderDays() {
    return (
      <header className="calendar-days">
        {DAYS.map((day) => this.renderDay(day))}
      </header>
    );
  }
  renderGrid() {
    return (
      <section className="calendar-grid">
        {this.state.dates.map((date) => this.renderDate(date))}
      </section>
    );
  }
  render() {
    const { dates } = this.state;
    const weeks = differenceInWeeks(
      dates[dates.length - 1].date,
      dates[0].date
    );
    const cls = classnames("calendar", `calendar-${weeks}-weeks`);
    return (
      <article className={cls}>
        {this.renderDays()}
        {this.renderGrid()}
      </article>
    );
  }
}

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

class Detail extends React.PureComponent {
  render() {
    const { selectedDate } = this.props;
    const remaind = differenceInDays(lastDayOfYear(selectedDate), selectedDate);
    const year = new Date(selectedDate).getFullYear();
    return (
      <section className="detail">
        <h3 className="date-string">
          {format(this.props.selectedDate, "MMM，Do")}
        </h3>
        <p className="remaind">
          {remaind} days from the end of {year}
        </p>
      </section>
    );
  }
}

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
