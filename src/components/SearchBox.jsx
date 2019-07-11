import React, { Component } from "react";
import "../styles/view.scss";

const ENTER_KEY = 13;

class SearchBox extends Component {
  state = {
    placeholder: "John Hartman",
    value: "",
    btnText: "Search",
    isLoading: false
  };

  render() {
    return (
      <form>
        <div className="input-group mb-3 search-box">
          <input
            type="search"
            className="form-control"
            placeholder={this.state.placeholder}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyPress={this.onEnter}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              id="search"
              onClick={this.onSearchClick}
            >
              {this.renderButtonText()}
            </button>
          </div>
        </div>
      </form>
    );
  }

  renderButtonText() {
    if (this.state.isLoading)
      return (
        <span
          className="spinner-border spinner-border-sm text-primary"
          role="status"
          aria-hidden="true"
        />
      );
    return this.state.btnText;
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
    console.log(this.state.value);
  };

  onEnter = event => {
    const isEnterPressed =
      event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed) {
      console.log("On Enter: " + event.target.value);
    }
  };

  onSearchClick = () => {
    this.setState({ isLoading: !this.state.isLoading });
    console.log("Search click: " + this.state.value);
  };
}
export default SearchBox;
