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

class Report_achive_driver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_data: [],
      list_vender: [],
      vender: "All",
      date_start: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_end: moment().add(-0, "days").format("YYYY-MM-DD"),
    };
  }
  async componentDidMount() {
    let vender_data = await httpClient.get(server.VENDER_ALL);

    this.setState({ list_vender: vender_data.data.result });
  }
  renderTableRow_vender = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => <option value={item.vender_name}>{item.vender_name}</option>);
      }
    } catch (error) {}
  };
  Click_Submit = async () => {
    let input_data = await httpClient.post(server.ACHIVE_DRIVER_ALL, {
      vender: this.state.vender,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    });
    console.log(input_data.data.result);
    this.setState({
      list_data: input_data.data.result,
    });
    // console.log(this.state.list_data);
  };
  renderTableRow = () => {
    try {
      if (this.state.list_data !== null) {
        const myResult = this.state.list_data;
        return myResult.map((item) => (
          <tr>
            <td>{item.date_record}</td>
            <td>{item.date_archive}</td>

            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td>
            <td>{item.plate_id}</td>
            <td>{item.vender}</td>

            <td>{item.employ_date} </td>
            <td>{item.remark} </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Report Archive Driver</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
        
          <div className="card card-dark col-md-11">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
              <div class="col-sm-12 col-md-2">
                  <label>Vender</label>
                  <select
                    value={this.state.vender}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        vender: e.target.value,
                      });
                    }}
                  >
                    <option value="All" selected>
                      All
                    </option>
                    {this.renderTableRow_vender()}
                  </select>
                </div>
                <div class="col-sm-12 col-md-2">
                  <label>Archive Start</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_start}
                    onChange={async (e) => {
                      await this.setState({
                        date_start: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
                <div class="col-sm-12 col-md-2">
                  <label>End</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_end}
                    onChange={async (e) => {
                      await this.setState({
                        date_end: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
                <div className="col-md-1"></div>
                <div class="col-sm-12 col-md-2">
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
                        Report Download <AiFillFileExcel />
                      </button>
                    }
                    filename="driver_list_report"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.list_data} name="Sheet1">
                      <ExcelColumn label="date_record" value="date_record" />
                      <ExcelColumn label="date_archive" value="date_archive" />
                      <ExcelColumn label="emp_no" value="emp_no" />
                      <ExcelColumn label="driver_name" value="driver_name" />
                      <ExcelColumn label="plate_id" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />
                      <ExcelColumn label="employ_date" value="employ_date" />
                      <ExcelColumn label="remark" value="remark" />
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
                        <th>วันที่ลบ</th>
                        <th>วันที่มีผล</th>

                        <th>รหัสพนักงาน</th>
                        <th>ชื่อ</th>
                        <th>ทะเบียนรถ</th>
                        <th>Vender</th>
                        <th>วันจ้างงาน</th>
                        <th>Remark</th>
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

export default Report_achive_driver;
