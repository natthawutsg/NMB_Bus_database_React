import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactExport from "react-export-excel";
import { FaCalendarCheck, FaCalendarTimes, FaAddressCard } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { AiFillFileExcel } from "react-icons/ai";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Black_report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_data: [],

      id_card: "",

      valid_id: "form-control is-invalid",
    };
  }
  Click_Submit = async () => {
    if (this.state.valid_id == "form-control is-invalid") {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        // text: "RFID is duplicated.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    } else {
      let input_data = await httpClient.post(server.BLACK_FIND, {
        id_card: this.state.id_card,
      });
      // console.log(input_data.data.result);
      await this.setState({
        list_data: input_data.data.result[0],
      });
      console.log(this.state.list_data);
    }
  };
  renderTableRow = () => {
    try {
      if (this.state.list_data !== null) {
        const myResult = this.state.list_data;
        return myResult.map((item) => (
          <tr>
            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td>
            <td>{item.id_card}</td>
            <td>{item.vender}</td>
            <td>{item.on_date}</td>
            <td>{item.detail}</td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Black List Report</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-dark col-md-10">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-4">
                  <div className="row">
                    <label>ID Card</label>
                    <input
                      class={this.state.valid_id}
                      type="number"
                      maxLength={13}
                      // value={this.state.id_card}
                      onChange={async (e) => {
                        // if(e.target.value.length === 1 ||e.target.value.length === 6||e.target.value.length === 11||e.target.value.length === 13) {
                        //   e.target.value = e.target.value += "-"
                        // }

                        await this.setState({
                          id_card: e.target.value,
                        });

                        if (this.state.id_card.length == 13) {
                          // console.log(e.target.value.substring(0, 1));
                          // console.log(e.target.value.substring(1, 5));
                          // console.log(e.target.value.substring(5, 10));
                          // console.log(e.target.value.substring(10, 12));
                          // console.log(e.target.value.substring(12, 13));
                          this.setState({
                            valid_id: "form-control is-valid",
                          });
                        } else {
                          this.setState({
                            valid_id: "form-control is-invalid",
                          });
                        }

                        // this.call_data();
                      }}
                    />
                  </div>
                </div>
                <div class="col-sm-0 col-md-2"></div>
                <div class="col-sm-12 col-md-3">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Submit();
                    }}
                  >
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 col-md-3">
                  <label>&nbsp;</label>
                  <ExcelFile
                    element={
                      <button className="btn btn-success btn-block">
                        Report Download <AiFillFileExcel />{" "}
                      </button>
                    }
                    filename="driver_list_report"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.list_data} name="Sheet1">
                      <ExcelColumn label="emp_no" value="emp_no" />
                      <ExcelColumn label="driver_name" value="driver_name" />
                      <ExcelColumn label="id_card" value="id_card" />
                      <ExcelColumn label="vender" value="vender" />
                      <ExcelColumn label="on_date" value="on_date" />
                      <ExcelColumn label="detail" value="detail" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
              </div>
              <br />
              <div>
                <div className="card-body table-responsive p-0" style={{ height: 400 }}>
                  <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                    <thead>
                      <tr>
                        <th>รหัสพนักงาน</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>บัตรประชาชน</th>
                        <th>ผู้ประกอบการ</th>

                        <th>วันที่กระทำผิด</th>
                        <th>รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderTableRow()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Black_report;
