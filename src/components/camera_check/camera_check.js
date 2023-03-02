import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";

import ReactAutocomplete from "react-autocomplete";
import Autocomplete from "react-autocomplete";
class Camera_check extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rfid: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      plate_id: "",
      path_image: "",
      remark: "",
      camera_condition: "OK",
      list_plate: [],
      list_5: [],
    };
  }

  async componentDidMount() {
    let data_5 = await httpClient.post(server.CAMEAR_5, { lv: localStorage.getItem(key.USER_LV), vender: localStorage.getItem(key.USER_VENDER) });
    this.setState({ list_5: data_5.data.result });
    // this.input_plate_id.focus();
  }
  rfid_KeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("enter", this.state.rfid);
      this.find_data(this.state.rfid);
    }
  };
  renderTableRow = () => {
    try {
      if (this.state.list_5 !== null) {
        const myResult = this.state.list_5;
        return myResult.map((item) => (
          <tr>
            <td>{item.mfgdate}</td>
            <td>{item.time}</td>
            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td>
            <td>{item.plate_id}</td>
            <td>{item.vender} </td>
            <td style={{ color: item.color }}>{item.camera_condition} </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  find_data = async (r_rfid) => {
    var my_rfid = r_rfid.replace(/\s/g, "");
    console.log(my_rfid);
    let rfid_data = await httpClient.post(server.RFID_RFID, { rfid: my_rfid });
    if (rfid_data.data.result !== "rfid_not_found") {
      console.log("rfid", rfid_data.data.result);
      this.setState({
        emp_no: rfid_data.data.result.emp_no,
        emp_name: rfid_data.data.result.driver_name,
        vender_name: rfid_data.data.result.vender,
        plate_id: rfid_data.data.result.plate_id,
        rfid: my_rfid,
        image: rfid_data.data.result.pic1.data,
        path_image: `rfid/picture/${rfid_data.data.result.emp_no}`,
      });
      // this.find_data2();
    } else {
      let emp_data = await httpClient.post(server.RFID_EMP, { emp_no: my_rfid });
      if (emp_data.data.result !== "emp_no_not_found") {
        console.log("emp_no", emp_data.data.result);
        this.setState({
          emp_no: emp_data.data.result.emp_no,
          emp_name: emp_data.data.result.driver_name,
          vender_name: emp_data.data.result.vender,
          plate_id: emp_data.data.result.plate_id,
          image: emp_data.data.result.pic1.data,
          rfid: emp_data.data.result.rfid,
          path_image: `rfid/picture/${emp_data.data.result.emp_no}`,
        });
        // this.find_data2();
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่พบข้อมูล",
          // text: "RFID is duplicated.",
          showConfirmButton: false,
          timer: 2500,
        });
        this.setState({ rfid: "" });
        return;
      }
    }
  };
  Click_Confirm = async () => {
    let find_data = await httpClient.post(server.CAMEAR_LAST, { emp_no: this.state.emp_no });
    // console.log(find_data.data.result[0].timestamp);
    if (find_data.data.result[0].timestamp == null) {
      console.log("no last data");
      this.Click_Confirm2();
    } else {
      const yourDate = new Date();
      var time_now = moment(yourDate).format("YYYY-MM-DD HH:mm:ss.000");
      var time_db = moment.utc(find_data.data.result[0].timestamp).format("YYYY-MM-DD HH:mm:ss.000");
      console.log("time_now", time_now);
      console.log("time_db", time_db);

      var time_dif = moment(time_now, "YYYY-MM-DD HH:mm:ss.000").diff(moment(time_db, "YYYY-MM-DD HH:mm:ss.000"), "minutes");
      console.log(time_dif);
      if (time_dif < 30) {
        Swal.fire({
          icon: "info",
          title: "ไม่บันทึก",
          text: "กรุณาบันทึกอีกครั้ง ในอีก " + (30 - time_dif) + " นาที",
        });
        this.setState({ rfid: "", emp_no: "", emp_name: "", vender_name: "", plate_id: "", path_image: "", remark: "" });
        return;
      } else {
        this.Click_Confirm2();
      }
    }
  };
  Click_Confirm2 = async () => {
    const yourDate = new Date();
    var my_data = {
      timestamp: moment(yourDate).add(7, "hour").format("YYYY-MM-DD HH:mm:ss.000"),
      time: moment(yourDate).format("HH:mm:ss"),
      mfgdate: moment(yourDate).format("YYYY-MM-DD"),
      emp_no: this.state.emp_no,
      driver_name: this.state.emp_name,
      vender: this.state.vender_name,
      plate_id: this.state.plate_id,
      rfid: this.state.rfid,
      camera_condition: this.state.camera_condition,
      remark: this.state.remark,
    };
    let input_data = await httpClient.post(server.CAMEAR_IN, my_data);
    if (input_data.data.api_result == "ok") {
      await Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.reload(false);
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please see Console.log",
        showConfirmButton: true,
        // timer: 100000,
      });
      // window.location.reload(false);
    }
    // this.setState({ rfid: "", remark: "" });
    // this.rfid_PositionInput.focus();
  };

  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Camera Check by RFID</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-secondary col-md-8" style={{ fontSize: 14 }}>
            <div className="card-body">
              <div className="row">
              <div class="col-sm-12 col-md-9">
                  <div className="row">
                    <div style={{ width: "30%" }}>
                      <label>RFID</label>
                      <input
                        autoFocus
                        ref={(input) => {
                          this.rfid_PositionInput = input;
                        }}
                        type="text"
                        placeholder="Scan Here.."
                        value={this.state.rfid}
                        className="form-control"
                        onKeyPress={this.rfid_KeyPress}
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            rfid: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "57%" }}>
                      <label>ชื่อ-นามสกุล </label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.emp_name} className="form-control" />
                    </div>
                  </div>

                  <br />

                  <div className="row">
                    <div style={{ width: "30%" }}>
                      <label>รหัสพนักงาน</label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.emp_no} className="form-control" />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "25%" }}>
                      <label>ทะเบียนรถ</label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.plate_id} className="form-control" />
                      {/* <Autocomplete
                    // className="form-control"
                    // type="text"
                    style={{ width: "100%" }}
                    items={this.state.list_plate}
                    ref={(input) => {
                      this.input_plate_id = input;
                    }}
                    shouldItemRender={(item, value) =>
                      // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                      item.plate_id.indexOf(value) > -1
                    }
                    getItemValue={(item) => item.plate_id}
                    renderItem={(item, isHighlighted) => <div style={{ background: isHighlighted ? "lightgray" : "white" }}>{item.plate_id}</div>}
                    value={this.state.plate_id}
                    onChange={(e) => {
                      this.setState({
                        plate_id: e.target.value,
                      });
                    }}
                    onSelect={(val) => {
                      this.setState({
                        plate_id: val,
                      });
                    }}
                  /> */}
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>ผู้ประกอบการ</label>
                      <input
                        value={this.state.vender_name}
                        className="form-control"
                        style={{ backgroundColor: "white" }}
                        readOnly={true}
                        type="text"
                      ></input>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3" >
                
                  <img
                    style={{ flex: 1, width: "100%", height: "100%", resizeMode: "contain" }}
                    id="target"
                    src={join(apiUrl, this.state.path_image)}
                  />
                </div>
              </div>
              <br />

              <div className="row">
                <div class="col-xs-12 col-sm-5 col-md-3">
                  <div className="custom-control custom-radio">
                    <input
                      className="custom-control-input"
                      type="radio"
                      id="customRadio1"
                      name="customRadio"
                      defaultChecked
                      onChange={async (e) => {
                        // e.preventDefault();
                        await this.setState({
                          camera_condition: "OK",
                        });
                        console.log(this.state.camera_condition);
                      }}
                    />
                    <label htmlFor="customRadio1" className="custom-control-label">
                      ใช้งานได้ปกติ
                    </label>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-7 col-md-4">
                  <div className="custom-control custom-radio">
                    <input
                      className="custom-control-input"
                      type="radio"
                      id="customRadio2"
                      name="customRadio"
                      onChange={async (e) => {
                        // e.preventDefault();
                        await this.setState({
                          camera_condition: "NG",
                        });
                        console.log(this.state.camera_condition);
                      }}
                    />
                    <label htmlFor="customRadio2" className="custom-control-label">
                      ไม่สามารถใช้งานได้
                    </label>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-5">
                  <input
                    value={this.state.remark}
                    className="form-control"
                    type="text"
                    placeholder="จำกัด 50 อักษร"
                    maxLength={50}
                    onChange={async (e) => {
                      e.preventDefault();

                      this.setState({
                        remark: e.target.value,
                      });
                    }}
                  ></input>
                </div>
                <div style={{ width: "10%", color: "lightgray" }}> {50 - this.state.remark.length}</div>
              </div>

              <div className="row">
              <div class="col-sm-12 col-md-4" ></div>
              <div class="col-sm-12 col-md-4" >
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Confirm();
                    }}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-secondary col-md-11">
            <div className="card-body">
              <div className="card-body table-responsive p-0" style={{ height: 200, fontSize: 12 }}>
                <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                  <thead>
                    <tr>
                      <th>วันที่</th> <th>เวลา</th>
                      <th>รหัสพนักงาน</th>
                      <th>ชื่อ</th>
                      <th>ทะเบียนรถ</th>
                      <th>Vender</th>
                      <th>กล้อง</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderTableRow()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Camera_check;
