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