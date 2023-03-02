import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";

import ReactAutocomplete from "react-autocomplete";
import Autocomplete from "react-autocomplete";

class Camera_check_plate extends Component {
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

    let all_data = await httpClient.post(server.RFID_ALL_VENDER, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    this.setState({ list_plate: all_data.data.result, list_5: data_5.data.result });
    // this.input_plate_id.focus();
    // console.log( all_data.data.result);
  }
  renderTableRow = () => {
    try {
      if (this.state.list_5 !== null) {
        const myResult = this.state.list_5;
        return myResult.map((item) => (
          <tr>
            <td>{item.mfgdate}</td>
            <td>{item.time}</td>
            {/* <td>{item.emp_no}</td>
            <td>{item.driver_name}</td> */}
            <td>{item.plate_id}</td>
            <td>{item.vender} </td>
            <td style={{ color: item.color }}>{item.camera_condition} </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  find_data = async (plate_id) => {
    console.log(plate_id);
    let _data = await httpClient.post(server.RFID_PLATE, { plate_id: plate_id });
    // if (rfid_data.data.result !== "rfid_not_found") {
    console.log(_data.data.result);

    this.setState({
      emp_no: _data.data.result.emp_no,
      emp_name: _data.data.result.driver_name,
      vender_name: _data.data.result.vender,

      rfid: _data.data.result.rfid,
    });
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
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Camera Check by Plate</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-secondary col-md-8">
            <div className="card-body">
              <div className="row">
                {/* <div style={{ width: "30%" }}>
                  <label>รหัสพนักงาน</label>
                  <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.emp_no} className="form-control" />
                </div> */}
                <div class="col-sm-12 col-md-6" style={{ zIndex: 9998 }}>
                  <label>ทะเบียนรถ&nbsp;</label>
                  {/* <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.plate_id} className="form-control" /> */}
                  <Autocomplete
                    // className="form-control"
                    // type="text"
                    style={{ width: "100%", zIndex: 9998 }}
                    items={this.state.list_plate}
                    ref={(input) => {
                      this.input_plate_id = input;
                    }}
                    shouldItemRender={(item, value) =>
                      // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                      item.plate_id.indexOf(value) > -1
                    }
                    getItemValue={(item) => item.plate_id}
                    renderItem={(item, isHighlighted) => (
                      <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey" }}>{item.plate_id}</div>
                    )}
                    value={this.state.plate_id}
                    onChange={async (e) => {
                      await this.setState({
                        plate_id: e.target.value,
                      });
                      this.find_data(this.state.plate_id);
                    }}
                    onSelect={async (val) => {
                      await this.setState({
                        plate_id: val,
                      });
                      this.find_data(this.state.plate_id);
                    }}
                  />
                </div>
                <div class="col-sm-12 col-md-1">&nbsp;</div>
                <div class="col-sm-12 col-md-5">
                  {/* <label>&nbsp;</label> */}
                  <div className="row">
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
                  <div className="row">
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
                </div>
              </div>
              <br />

              <div className="row">
                {/* <div style={{ width: "3%" }}></div> */}
                <div class="col-sm-12 col-md-2">
                  <label>ผู้ประกอบการ</label>
                  <input
                    value={this.state.vender_name}
                    className="form-control"
                    style={{ backgroundColor: "white" }}
                    readOnly={true}
                    type="text"
                  ></input>
                </div>
                {/* <div style={{ width: "5%" }}></div> */}
                <div class="col-sm-11 col-md-9">
                  <label>&nbsp;</label>
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
                <div  class="col-sm-1 col-md-1" style={{  color: "lightgray" }}> {50 - this.state.remark.length}</div>
              </div>
          
              <br />

              <div className="row">
                <div style={{ width: "35%" }}></div>
                <div style={{ width: "30%" }}>
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
              <div className="card-body table-responsive p-0" style={{ height: 200, fontSize: 14 }}>
                <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                  <thead>
                    <tr>
                      <th>วันที่</th> <th>เวลา</th>
                      {/* <th>รหัสพนักงาน</th>
                      <th>ชื่อ</th> */}
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

export default Camera_check_plate;
