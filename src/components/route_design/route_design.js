import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import { AiFillEdit } from "react-icons/ai";
import Autocomplete from "react-autocomplete";
import * as moment from "moment";
import { wait } from "@testing-library/react";
const menuStyle = {
  borderRadius: "4px",

  fontSize: 16,
  // maxHeight: '100%', // TODO: don't cheat, let it flow to the bottom
  zIndex: 9998,
  width: "90%",
  borderColor: "lightgrey",
  borderStyle: "solid",
  borderWidth: 1,
  // ,padding: 0
  // flex: 1,
  // alignItems: "stretch",
  height: "5vh",
  textAlign: "center",
};

class Route_design extends Component {
  constructor() {
    super();
    this.state = {
      show_table: [],
      list_plate: [],
      list_route: [],
      // plate_id: "",
      edit_table: "",
      petrol: "",
      opacity_table: 1,
      display_newroute: "none",
      display_update: "none",
      display_update_day: "none",
      selected_route: "",
      selected_plate_id_old: "",
      selected_shift: "",
      new_plate_id: "",
      date_data: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_from: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_to: moment().add(-0, "days").format("YYYY-MM-DD"),

      add_route: "",
      add_shift: "AM_in",
      add_plate_id: "",
      add_date: "",
    };
  }
  componentDidMount = async () => {
    // const Array_obj = [
    //   { id: 0, name: "David", pos: "A" },
    //   { id: 1, name: "John", pos: "A" },
    // ];
    // var upd_obj = Array_obj.findIndex((obj) => obj.id == 0 && obj.pos == "B");
    // console.log("Before Object Updation: ", Array_obj[upd_obj]);
    // try {
    //   Array_obj[upd_obj].name = "Harry";
    // } catch (error) {}
    // console.log("After Object Updation: ", Array_obj[upd_obj]);
    // console.log(Array_obj);

    this.call_master_data();
  };
  call_master_data = async () => {
    let route_data = await httpClient.post(server.DATA_ROUTE_ALL, { date: this.state.date_data });
    let bus_data = await httpClient.post(server.BUS_LIST_PLATE, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    ///////////////////////
    let list_route = await httpClient.get(server.ROUTE_ALL);
    this.setState({ show_table: route_data.data.result, list_plate: bus_data.data.result, list_route: list_route.data.result });
    console.log(this.state.show_table);

    if (this.state.show_table.length === 0) {
      this.setState({ petrol: "0" });
    }

    for (let index = 0; index < route_data.data.result.length; index++) {
      // console.log(route_data.data.result[index].petrol);
      if (route_data.data.result[index].petrol !== null) {
        this.setState({ petrol: route_data.data.result[index].petrol });
        break;
      }
    }
  };
  renderTableRow_input = () => {
    try {
      if (this.state.show_table !== null) {
        const myResult = this.state.show_table;
        return myResult.map((item) => (
          <tr>
            <td>{item.route}</td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("AM_in", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.AM_in}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("CN_out", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.CN_out}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("B_in", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.B_in}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("A_out", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.A_out}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("N_in", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.N_in}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("M_out", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.M_out}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("C_in", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.C_in}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("B_out", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.B_out}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("D_in", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.D_in}&nbsp;
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={async (e) => {
                  this.click_1("D_out", item.route, item.AM_in);
                }}
              >
                &nbsp;{item.D_out}&nbsp;
              </button>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  find_data = async (plate_id) => {
    await console.log("new_plate_id > ", this.state.new_plate_id);
    await console.log("selected_shift > ", this.state.selected_shift);

    var upd_obj;

    switch (this.state.selected_shift) {
      case "AM_in":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].AM_in = this.state.new_plate_id;
        break;
      case "CN_out":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].CN_out = this.state.new_plate_id;
        break;
      case "B_in":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].B_in = this.state.new_plate_id;
        break;
      case "A_out":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].A_out = this.state.new_plate_id;
        break;
      case "N_in":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].N_in = this.state.new_plate_id;
        break;
      case "M_out":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].M_out = this.state.new_plate_id;
        break;
      case "C_in":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].C_in = this.state.new_plate_id;
        break;
      case "B_out":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].B_out = this.state.new_plate_id;
        break;
      case "D_in":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].D_in = this.state.new_plate_id;
        break;
      case "D_out":
        upd_obj = this.state.show_table.findIndex((obj) => obj.route == this.state.selected_route);
        this.state.show_table[upd_obj].D_out = this.state.new_plate_id;
        break;
      default:
      // code block
    }

    this.setState({
      selected_route: "",
      selected_plate_id_old: "",
      selected_shift: "",
      new_plate_id: "",
      display_update: "none",
      opacity_table: 1,
    });
  };
  click_1 = async (my_shift, my_route, plate_id) => {
    // console.log(my_shift, my_route, plate_id);
    this.setState({
      selected_route: my_route,
      selected_plate_id_old: plate_id,
      selected_shift: my_shift,
      display_update: "",
      opacity_table: 0.2,
      // display_table: "none"
    });
  };
  click_delete = async () => {
    Swal.fire({
      title: "Confirm",
      text: "You are going to delete " + this.state.date_data,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.patch(server.DATA_ROUTE_DEL, { date: this.state.date_data });
        await Swal.fire({
          title: "Delete Success",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        this.call_master_data();
      }
    });
  };
  Click_Update = async () => {
    Swal.fire({
      title: "Confirm",
      text: "You are going to Update " + this.state.date_data,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,",
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.insert_data();
      }
    });
  };
  insert_data = async () => {
    console.log(this.state.show_table);
    var try_data = [];
    for (let i = 0; i < this.state.show_table.length; i++) {
      // console.log(this.state.show_table[i]);
      //AM_in
      if (this.state.show_table[i].AM_in !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "AM_in",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].AM_in,
        });
      }
      //CN_out
      if (this.state.show_table[i].CN_out !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "CN_out",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].CN_out,
        });
      }
      //B_in
      if (this.state.show_table[i].B_in !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "B_in",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].B_in,
        });
      }
      //A_out
      if (this.state.show_table[i].A_out !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "A_out",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].A_out,
        });
      }
      //N_in
      if (this.state.show_table[i].N_in !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "N_in",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].N_in,
        });
      }
      //M_out
      if (this.state.show_table[i].M_out !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "M_out",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].M_out,
        });
      }
      //C_in
      if (this.state.show_table[i].C_in !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "C_in",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].C_in,
        });
      }
      //B_out
      if (this.state.show_table[i].B_out !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "B_out",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].B_out,
        });
      }
      //D_in
      if (this.state.show_table[i].D_in !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "D_in",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].D_in,
        });
      }
      //D_out
      if (this.state.show_table[i].D_out !== "") {
        try_data.push({
          mfgdate: this.state.date_data,
          petrol: this.state.petrol,
          shift: "D_out",
          route: this.state.show_table[i].route,
          plate_id: this.state.show_table[i].D_out,
        });
      }
    }
    // console.log(try_data);

    await httpClient.patch(server.DATA_ROUTE_DEL, { date: this.state.date_data });
    for (let j = 0; j < try_data.length; j++) {
      await httpClient.post(server.DATA_ROUTE_IN, try_data[j]);
    }
    // console.log(this.state.show_table);
    await Swal.fire({
      title: "Insert Success",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    });
    this.call_master_data();
  };
  click_copy = async () => {
    Swal.fire({
      title: "Confirm Copy data",
      text: this.state.date_from + " --> " + this.state.date_to,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.post(server.DATA_ROUTE_COPY, { date_to: this.state.date_to, date_from: this.state.date_from, petrol: this.state.petrol });
        await Swal.fire({
          title: "Copy Success",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        this.setState({
          selected_route: "",
          selected_plate_id_old: "",
          selected_shift: "",
          new_plate_id: "",
          display_update_day: "none",
          opacity_table: 1,
        });
        this.call_master_data();
      }
    });
  };
  click_new = async () => {
    this.setState({
      display_newroute: "none",
      opacity_table: 1,
    });

    console.log("add_route", this.state.add_route);
    console.log("add_shift", this.state.add_shift);
    console.log("add_plate_id", this.state.add_plate_id);
    console.log("add_date", this.state.add_date);
    // console.log();

    let new_data = await httpClient.post(server.DATA_ROUTE_DUP, {
      mfgdate: this.state.add_date,
      route: this.state.add_route,
      shift: this.state.add_shift,
    });

    console.log(new_data.data.result.length);

    if (new_data.data.result.length !== 0) {
      Swal.fire({
        icon: "error",
        title: "Data Duplicate",
        text: this.state.add_date + "  " + this.state.add_route + "  " + this.state.add_shift,
        html:
          `
      <div classname="row">วันที่ ` +
          this.state.add_date +
          `</div>
      <div classname="row">เส้นทาง' ` +
          this.state.add_route +
          ` </div>
        <div classname="row">กะ' ` +
          this.state.add_shift +
          ` </div>
      `,
      });
      return;
    } else {
      //insert
      let insert_data = await httpClient.post(server.DATA_ROUTE_IN, {
        mfgdate: this.state.add_date,
        route: this.state.add_route,
        shift: this.state.add_shift,
        plate_id: this.state.add_plate_id,
        petrol: this.state.petrol,
      });
      console.log(insert_data.data);
  
      //load
      await Swal.fire({
        title: "Insert Success",
        icon: "success",
        showConfirmButton: false,
        timer: 500,
      });
      this.call_master_data();
    }
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Route Design</h1>
        <div
          className="row"
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            className="card card-warning col-12"
            style={{ display: this.state.display_table, position: "relative", opacity: this.state.opacity_table }}
          >
            <div className="card-body">
              <div className="row">
                <div class="col-xs-4 col-sm-3 col-md-3 col-lg-3 ">
                  <label>Date</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_data}
                    onChange={async (e) => {
                      await this.setState({
                        petrol: "",
                        date_data: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      this.call_master_data();
                      // this.call_data();
                    }}
                  />
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-success btn-block"
                    onClick={async (e) => {
                      this.setState({
                        add_route: "",
                        add_shift: "",
                        add_plate_id: "",
                        add_date: this.state.date_data,
                        display_newroute: "",
                        opacity_table: 0.2,
                        // display_table: "none"
                      });
                    }}
                  >
                    New Route
                  </button>
                </div>
                <div class="col-xs-1 col-sm-1 col-md-3 col-lg-4 "></div>
                <div class="col-xs-2 col-sm-3 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.setState({
                        display_update_day: "",
                        display_update: "none",
                        display_table: "",
                        opacity_table: 0.2,
                        date_from: this.state.date_data,
                      });
                    }}
                  >
                    Copy Data
                  </button>
                </div>
                <div class="col-xs-2 col-sm-3 col-md-2 col-lg-1 ">
                  <label>Petrol</label>
                  <input
                    // placeholder="Petrol"
                    type="text"
                    value={this.state.petrol}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        petrol: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="card-body table-responsive p-0" style={{ height: 400, fontSize: 14 }}>
              <table id="DivTable" className="table table-head-fixed  text-nowrap" role="grid" aria-describedby="example2_info">
                <thead style={{ textAlign: "center" }}>
                  <tr>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      สายรถ
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      A/M-เข้า
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      C/N-ออก
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      B-เข้า
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      A-ออก
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      N-เข้า
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      M-ออก
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      C-เข้า
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      B-ออก
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      D-เข้า
                    </th>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      D-ออก
                    </th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow_input()}</tbody>
              </table>
            </div>
            <div className="card-body">
              <div className="row" style={{ width: "100%" }}>
                <div class="col-sm-12 col-md-2"> </div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      await this.call_master_data();
                    }}
                  >
                    Return
                  </button>
                </div>
                <div class="col-sm-12 col-md-1"> </div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={async (e) => {
                      await this.click_delete();
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div class="col-sm-12 col-md-1"></div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Update();
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>
          <div className="card card-warning col-7" style={{ display: this.state.display_update, position: "absolute" }}>
            <div className="card-header" style={{ backgroundColor: "lightgrey" }}>
              <div className="row">Update Plate ID</div>
            </div>
            <div className="card-body">
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  zIndex: 9998,
                }}
              >
                <div class="col-sm-11 col-md-9" style={{ width: "100%", zIndex: 9999 }}>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Route </th>
                        <th>Shift</th>
                        <th>Plate ID</th>
                        <th>New Plate ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.state.selected_route}</td>
                        <td>{this.state.selected_shift}</td>
                        <td>{this.state.selected_plate_id_old}</td>
                        <td>
                          <Autocomplete
                            style={{ width: "100%" }}
                            inputProps={{ style: menuStyle }}
                            items={this.state.list_plate}
                            shouldItemRender={(item, value) =>
                              // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                              item.plate_id.indexOf(value) > -1
                            }
                            getItemValue={(item) => item.plate_id}
                            renderItem={(item, isHighlighted) => (
                              <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey", fontSize: 14 }}>
                                {item.plate_id}
                              </div>
                            )}
                            value={this.state.new_plate_id}
                            inputSearchString="hello"
                            onChange={async (e) => {
                              await this.setState({
                                new_plate_id: e.target.value,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                            onSelect={async (val) => {
                              await this.setState({
                                new_plate_id: val,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 1 }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      this.setState({
                        selected_route: "",
                        selected_plate_id_old: "",
                        selected_shift: "",
                        new_plate_id: "",
                        display_update: "none",
                        opacity_table: 1,
                      });
                    }}
                  >
                    Return
                  </button>
                </div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 1 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.find_data(this.state.new_plate_id);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <br />
            </div>
          </div>
          <div className="card card-warning col-7" style={{ display: this.state.display_update_day, position: "absolute" }}>
            <div className="card-header" style={{ backgroundColor: "lightgrey" }}>
              <div className="row">Copy Date</div>
            </div>
            <div className="card-body">
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  zIndex: 9998,
                }}
              >
                <div class="col-sm-6 col-md-4">
                  <label>Copy From</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_from}
                    onChange={async (e) => {
                      await this.setState({
                        date_from: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
                <div class="col-sm-6 col-md-4">
                  <label>Copy To</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_to}
                    onChange={async (e) => {
                      await this.setState({
                        date_to: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      this.setState({
                        selected_route: "",
                        selected_plate_id_old: "",
                        selected_shift: "",
                        new_plate_id: "",
                        display_update_day: "none",
                        opacity_table: 1,
                      });
                    }}
                  >
                    Return
                  </button>
                </div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.click_copy();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <br />
            </div>
          </div>
          <div className="card card-warning col-7" style={{ display: this.state.display_newroute, position: "absolute" }}>
            <div className="card-header" style={{ backgroundColor: "lightgrey" }}>
              <div className="row">Create New Route</div>
            </div>
            <div className="card-body">
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  // zIndex: 9997,
                }}
              >
                <div class="col-sm-11 col-md-9" style={{ width: "100%", zIndex: 9997 }}>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "25%" }}>Date </th>
                        <th style={{ width: "25%" }}>Route </th>
                        <th style={{ width: "25%" }}>Shift</th>
                        <th style={{ width: "25%" }}>Plate ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.state.add_date}</td>
                        <td>
                          <Autocomplete
                            style={{ width: "100%" }}
                            inputProps={{ style: menuStyle }}
                            items={this.state.list_route}
                            shouldItemRender={(item, value) =>
                              // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                              item.route.indexOf(value) > -1
                            }
                            getItemValue={(item) => item.route}
                            renderItem={(item, isHighlighted) => (
                              <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey", fontSize: 14 }}>
                                {item.route}
                              </div>
                            )}
                            value={this.state.add_route}
                            inputSearchString="hello"
                            onChange={async (e) => {
                              await this.setState({
                                add_route: e.target.value,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                            onSelect={async (val) => {
                              await this.setState({
                                add_route: val,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                          />
                        </td>
                        <td>
                          <select
                            className="form-control"
                            onChange={async (e) => {
                              e.preventDefault();
                              await this.setState({ add_shift: e.target.value });
                              await console.log(this.state.add_shift);
                            }}
                          >
                            <option value="AM_in" selected>
                              A/M-เข้า
                            </option>
                            <option value="CN_out">C/N-ออก</option>
                            <option value="B_in">B-เข้า</option>
                            <option value="A_out">A-ออก</option>
                            <option value="N_in">N-เข้า</option>
                            <option value="M_out">M-ออก</option>
                            <option value="C_in">C-เข้า</option>
                            <option value="B_out">B-ออก</option>
                            <option value="D_in">D-เข้า</option>
                            <option value="D_out">D-ออก</option>
                          </select>
                        </td>

                        <td>
                          <Autocomplete
                            style={{ width: "100%" }}
                            inputProps={{ style: menuStyle }}
                            items={this.state.list_plate}
                            shouldItemRender={(item, value) =>
                              // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                              item.plate_id.indexOf(value) > -1
                            }
                            getItemValue={(item) => item.plate_id}
                            renderItem={(item, isHighlighted) => (
                              <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey", fontSize: 14 }}>
                                {item.plate_id}
                              </div>
                            )}
                            value={this.state.add_plate_id}
                            inputSearchString="hello"
                            onChange={async (e) => {
                              await this.setState({
                                add_plate_id: e.target.value,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                            onSelect={async (val) => {
                              await this.setState({
                                add_plate_id: val,
                              });
                              // this.find_data(this.state.new_plate_id);
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 1 }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      this.setState({
                        add_route: "",
                        add_shift: "",
                        add_plate_id: "",
                        add_date: "",
                        display_newroute: "none",
                        opacity_table: 1,
                      });
                    }}
                  >
                    Return
                  </button>
                </div>
                <div class="col-sm-12 col-md-2">
                  <button
                    style={{ width: "100%", zIndex: 1 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.click_new();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Route_design;
