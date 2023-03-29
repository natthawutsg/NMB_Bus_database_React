import React, { Component, useRef } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import { AiFillEdit, AiOutlineCheckCircle, AiFillFileExcel } from "react-icons/ai";
import Autocomplete from "react-autocomplete";
import * as moment from "moment";
import _ from "lodash";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
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

class Route_design2 extends Component {
  constructor() {
    super();
    this.state = {
      show_table: [],
      list_plate: [],
      list_route: [],
      date_data: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_to: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_from: moment().add(-0, "days").format("YYYY-MM-DD"),
      petrol: "",
      displat_btn_petrol_yellow: "none",
      displat_btn_petrol_green: "",
      display_update: "none",
      display_copy_date: "none",
      window_height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
      new_plate_id: "",
      display_spl_route: "none",
      spl_route: "",
    };
  }
  onChange = (e) => {
    e.persist();
    this.debounceSearch(e);
  };
  componentDidMount = async () => {
    this.call_master_data();
    this.debounceSearch = _.debounce(this.change_petrol, 1500);
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
    // console.log(this.state.list_plate);
    // console.log(this.state.list_route);

    console.log(this.state.show_table);

    if (this.state.show_table.length === 0) {
      this.setState({ petrol: "0" });
    } else {
      this.setState({ petrol: this.state.show_table[0].petrol });
    }

    // for (let index = 0; index < route_data.data.result.length; index++) {
    //   // console.log(route_data.data.result[index].petrol);
    //   if (route_data.data.result[index].petrol !== null) {
    //     this.setState({ petrol: route_data.data.result[index].petrol });
    //     break;
    //   }
    // }
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
                  this.click_1("CN_out", item.route, item.CN_out);
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
                  this.click_1("B_in", item.route, item.B_in);
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
                  this.click_1("A_out", item.route, item.A_out);
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
                  this.click_1("N_in", item.route, item.N_in);
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
                  this.click_1("M_out", item.route, item.M_out);
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
                  this.click_1("C_in", item.route, item.C_in);
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
                  this.click_1("B_out", item.route, item.B_out);
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
                  this.click_1("D_in", item.route, item.D_in);
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
                  this.click_1("D_out", item.route, item.D_out);
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
  change_petrol = async () => {
    if (this.state.petrol == "") {
      return;
    } else {
      await httpClient.put(server.DATA_ROUTE_CHANGE_PETROL, { date: this.state.date_data, petrol: this.state.petrol });

      this.setState({
        displat_btn_petrol_yellow: "none",
        displat_btn_petrol_green: "",
      });
    }
  };
  insert_blank = async () => {
    Swal.fire({
      title: "Confirm Insert blank data",
      text: "on " + this.state.date_data,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(this.state.list_route);

        for (let index = 0; index < this.state.list_route.length; index++) {
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "AM_in",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "A_out",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "B_in",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "B_out",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "CN_out",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "C_in",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "D_in",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "D_out",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "M_out",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
          await httpClient.post(server.DATA_ROUTE_IN, {
            mfgdate: this.state.date_data,
            petrol: this.state.petrol,
            shift: "N_in",
            route: this.state.list_route[index].route,
            plate_id: "",
          });
        }

        await Swal.fire({
          title: "Insert Success",
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
        await httpClient.post(server.DATA_ROUTE_COPY, { date_to: this.state.date_to, date_from: this.state.date_from });
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
          display_copy_date: "none",
          opacity_table: 1,
        });
        this.call_master_data();
      }
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
  update_plate_id = async (newplate) => {
    await httpClient.put(server.DATA_ROUTE_CHANGE_PLATE, {
      mfgdate: this.state.date_data,
      shift: this.state.selected_shift,
      route: this.state.selected_route,
      plate_id: this.state.new_plate_id,
    });
    this.setState({
      selected_route: "",
      selected_plate_id_old: "",
      selected_shift: "",
      new_plate_id: "",
      display_update: "none",
      opacity_table: 1,
    });
    this.call_master_data();
  };
  click_spl = async () => {
    this.setState({
      display_spl_route: "",
      opacity_table: 0.2,
    });
  };

  submit_spl_route= async () => {
    await httpClient.post(server.DATA_ROUTE_IN, {mfgdate:this.state.date_data,route:this.state.spl_route,petrol:this.state.petrol});


    this.setState({                      
      display_spl_route: "none",
      opacity_table: 1,
    });
    this.call_master_data();
  }


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
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
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
                        date_from: moment(e.target.value).format("YYYY-MM-DD"),
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
                      this.insert_blank();
                    }}
                  >
                    All Route
                  </button>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-success btn-block"
                    onClick={async (e) => {
                      this.click_spl();
                    }}
                  >
                    Special Route
                  </button>{" "}
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%", zIndex: 0 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.setState({
                        display_copy_date: "",
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

                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
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

                <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 ">
                  <label>Petrol</label>
                  <div className="input-group">
                    <input
                      // placeholder="Petrol"
                      type="text"
                      value={this.state.petrol}
                      className="form-control"
                      onChange={async (e) => {
                        e.preventDefault();
                        // console.log(e.target.value);
                        if (isNaN(e.target.value)) {
                          // alert("it is not a valid number");
                          return;
                        } else {
                          await this.setState({
                            petrol: e.target.value,
                            displat_btn_petrol_yellow: "",
                            displat_btn_petrol_green: "none",
                          });

                          this.onChange(e);
                        }
                      }}
                    />
                    <div className="input-group-prepend">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        style={{ display: this.state.displat_btn_petrol_yellow }}
                        onClick={async (e) => {
                          this.change_petrol();
                        }}
                      >
                        <AiFillEdit />
                      </button>
                      <span className="badge badge-danger navbar-badge">3</span>

                      <button type="submit" className="btn btn-success" style={{ display: this.state.displat_btn_petrol_green }}>
                        <AiOutlineCheckCircle />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 ">
                  <label>&nbsp;</label>
                  <ExcelFile
                    element={
                      <button className="btn btn-success btn-block">
                        <AiFillFileExcel />
                      </button>
                    }
                    filename="driver_list_report"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.show_table} name="Sheet1">
                      <ExcelColumn label="route" value="route" />
                      <ExcelColumn label="AM_in" value="AM_in" />
                      <ExcelColumn label="CN_out" value="CN_out" />
                      <ExcelColumn label="B_in" value="B_in" />
                      <ExcelColumn label="A_out" value="A_out" />
                      <ExcelColumn label="N_in" value="N_in" />
                      <ExcelColumn label="M_out" value="M_out" />
                      <ExcelColumn label="C_in" value="C_in" />
                      <ExcelColumn label="B_out" value="B_out" />
                      <ExcelColumn label="D_in" value="D_in" />
                      <ExcelColumn label="D_out" value="D_out" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
              </div>
            </div>

            <div className="card-body table-responsive p-0" style={{ height: this.state.window_height / 1.8, fontSize: 14 }}>
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

            <br />
          </div>

          <div className="card card-warning col-7" style={{ display: this.state.display_copy_date, position: "absolute" }}>
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
                        display_copy_date: "none",
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
                        <th>Date</th>
                        <th>Route</th>
                        <th>Shift</th>
                        <th>Plate ID</th>
                        <th>New Plate ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.state.date_data}</td>
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
                      this.update_plate_id(this.state.new_plate_id);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <br />
            </div>
          </div>

          <div className="card card-warning col-7" style={{ display: this.state.display_spl_route, position: "absolute" }}>
            <div className="card-header" style={{ backgroundColor: "lightgrey" }}>
              <div className="row">Add Special Route</div>
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
                        <th>Date</th>
                        <th>Route</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.state.date_data}</td>
                        <td>
                          <input
                            class="form-control"
                            type="text"
                            value={this.state.spl_route}
                            onChange={ (e) => {
                               this.setState({
                                spl_route: e.target.value,
                              });
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
                        display_spl_route: "none",
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
                      this.submit_spl_route();
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

export default Route_design2;
