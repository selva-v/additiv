import React, { Component } from "react";
import "../styles/view.scss";

class EmpExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "John Hartman",
      btnText: "Search",
      value: "",
      error: null,
      isLoading: false,
      directRepotee: [],
      nonDirectRepotee: [],
      searchHistory: localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [],
      noEmpData: ""
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.getRepotee = this.getRepotee.bind(this);
  }

  renderButtonText() {
    if (this.state.isLoading)
      return <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />;
    return this.state.btnText;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSearch() {
    this.setState({ directRepotee: [] });
    let name = this.state.value;
    let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
    if (searchHistory.indexOf(name) === -1) {
      searchHistory.push(name);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    this.setState({
      directRepotee: [],
      nonDirectRepotee: [],
      searchHistory: searchHistory
    });
    this.fetchUsers(this.state.value, 0);
  }

  getRepotee(event) {
    this.setState({ nonDirectRepotee: [] });
    this.fetchUsers(event.target.value, "nonDirect");
  }

  handleResponse(employeeData, empType) {
    if (employeeData) {
      employeeData.forEach(employee => {
        if (this.state.directRepotee.indexOf(employee) === -1) {
          if (!empType) {
            this.setState({ directRepotee: [...this.state.directRepotee, employee] });
          } else {
            this.setState({ nonDirectRepotee: [...this.state.nonDirectRepotee, employee] });
          }
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  fetchUsers(empName, empType) {
    fetch("http://api.additivasia.io/api/v1/assignment/employees/" + empName)
      .then(res => res.json())
      .then(
        result => {
          let employeeData = result[1] ? result[1]["direct-subordinates"] : "";
          if (employeeData && employeeData.length > 0) {
            this.handleResponse(employeeData, empType);
          } else {
            this.setState({
              noEmpData: "No subordinates found",
              isLoading: false
            });
          }
        },
        error => {
          this.setState({
            isLoading: false,
            error
          });
        }
      );
  }

  render() {
    return (
      <div className="container">
        <div className="row logo">
          <div className="col">
            <h2 className="text-center text-primary">Employee Explorer</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <form>
              <div className="input-group mb-3 search-box">
                <input
                  type="search"
                  value={this.state.value}
                  className="form-control"
                  placeholder={this.state.placeholder}
                  onChange={this.handleChange}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-primary" type="button" id="search" onClick={this.handleSearch}>
                    {this.renderButtonText()}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          {this.state.directRepotee.length ? (
            <h6 className="col-12 text-info">Subordinates of employee {this.state.value}</h6>
          ) : (
            <div />
          )}
          <div className="col-12">
            <ul className="list-unstyled">
              {this.state.directRepotee.length ? (
                this.state.directRepotee.map(repotee => (
                  <li className="emp-name" key={repotee}>
                    <button className="chevron text-primary" type="button" value={repotee} onClick={this.getRepotee}>
                      {repotee}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-black-50">No subordinates found </li>
              )}
            </ul>

            <div className="col-12">
              {this.state.nonDirectRepotee.length ? (
                <h6 className="text-info">Non direct subordinates of employee</h6>
              ) : (
                <div />
              )}
              {this.state.directRepotee.length ? (
                <ul className="list-unstyled">
                  {this.state.nonDirectRepotee.length ? (
                    this.state.nonDirectRepotee.map(item => <li key={item}>{item}</li>)
                  ) : (
                    <li> </li>
                  )}
                </ul>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <h6 className="col-12 text-info">History of search:</h6>
          <div className="col-12">
            <ul className="list-unstyled">
              {this.state.searchHistory.length ? (
                this.state.searchHistory.map(history => (
                  <li className="emp-search text-black-50" key={history}>
                    {history}
                  </li>
                ))
              ) : (
                <li className="emp-search text-black-50">No search history </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default EmpExplorer;
