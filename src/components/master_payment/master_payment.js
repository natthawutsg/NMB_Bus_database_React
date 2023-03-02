import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";

class Master_payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_table: [],
      route_name: "",
      route_name: "",
    };
  }

  render() {
    return <div>Master_payment</div>;
  }
}

export default Master_payment;
