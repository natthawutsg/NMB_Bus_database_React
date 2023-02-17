import React, { Component } from "react";
import { APP_TITLE } from "../../constance/contance";
class Footer extends Component {
  render() {
    return (
      <footer className="main-footer">
        <b>{APP_TITLE}</b> <small>by NW-dev</small>


        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 20230215
        </div>
      </footer>
    );
  }
}
export default Footer;
