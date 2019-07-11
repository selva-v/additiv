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
      isLoaded: false,
      items: []
    };
	}
	
	componentDidMount() {
    fetch("http://api.additivasia.io/api/v1/assignment/employees/", {
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'no-cors'
		})
			.then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
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
							{/* {items.map(item => (
								<li className="emp-search" key={item}>{item}</li>
							))} */}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default EmpExplorer;
