import React, { Component } from "react";
import "../styles/view.scss";
import SearchBox from "./SearchBox";

class EmpExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "John Hartman",
      value: "",
      btnText: "Search",
      error: null,
      isLoading: false,
      users: []
    };
  }

  fetchUsers() {
    fetch("http://api.additivasia.io/api/v1/assignment/employees/", {
      mode: "no-cors"
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            users: result,
            isLoading: false
          });
        },
        error => {
          this.setState({
            isLoading: false,
            error
          });
        }
      );
  }

  componentDidMount() {
    this.fetchUsers();
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
            <SearchBox
              value={this.state.value}
              placeholder={this.state.placeholder}
              btnText={this.state.btnText}
            />
          </div>
        </div>
        <div className="row">
          <h6 className="col-12 text-secondary">History of search:</h6>
        </div>
        <div className="row">
          <div className="col-12">
            <ul className="list-unstyled">
              {this.state.users.map(user => (
                <li className="emp-search" key={user.name}>
                  {user.name}
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
