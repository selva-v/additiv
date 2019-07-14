import React, { Component } from "react";
import "../styles/view.scss";

const ENTER_KEY = 13;

class EmpExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "John Hartman",
      btnText: "Search",
      query: "",
      error: null,
      isLoading: false,
      employeeData: [],
      directRepotee: [],
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

  handleSearch() {
    console.log("handleSearch: " + this.state.query);
    let name = this.state.query;
    let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
    if (searchHistory.indexOf(name) === -1) {
      searchHistory.push(name);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    this.setState({ searchHistory: searchHistory });
    console.log("Search history: " + this.state.searchHistory);
    this.fetchUsers(this.state.query);
  }

  getRepotee(event) {
    this.fetchUsers(event.target.value);
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
    console.log(event.target.value);
  }

  onEnter = event => {
    const isEnterPressed = event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed) {
      console.log("On Enter: " + event.target.value);
    }
  };

  handleResponse(employeeData) {
    if (employeeData) {
      debugger;
      employeeData.forEach(empName => {
        if (this.state.directRepotee.indexOf(empName) === -1) {
          this.setState({ directRepotee: this.state.directRepotee.concat(empName) });
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  fetchUsers(empName) {
    fetch("http://api.additivasia.io/api/v1/assignment/employees/" + empName)
      .then(res => res.json())
      .then(
        result => {
          let employeeData = result[1] ? result[1]["direct-subordinates"] : "";
          if (employeeData && employeeData.length > 0) {
            this.handleResponse(employeeData);
          } else {
            this.setState({
              noEmpData: "There is no repotee found",
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
    console.log("Repotee: " + employeeData);
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
                  className="form-control"
                  placeholder={this.state.placeholder}
                  onChange={this.handleChange}
                  onKeyPress={this.onEnter}
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
          <div className="col-12">
            <ul className="list-unstyled">
              {this.state.directRepotee.map(repotee => (
                <li className="emp-name clearfix" key={repotee}>
                  <button className="chevron float-left" type="button" value={repotee} onClick={this.getRepotee} />
                  <span className="float-left">{repotee}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="row">
          <h6 className="col-12 text-secondary">History of search:</h6>
          <div className="col-12">
            <ul className="list-unstyled">
              {this.state.searchHistory.map(history => (
                <li className="emp-search text-black-50" key={history}>
                  {history}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default EmpExplorer;
