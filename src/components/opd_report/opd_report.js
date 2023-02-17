import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactExport from "react-export-excel";
// import { FaCalendarCheck, FaCalendarTimes, FaAddressCard } from "react-icons/fa";
// import { GoAlert } from "react-icons/go";
import { BsArchiveFill } from "react-icons/bs";
import Autocomplete from "react-autocomplete";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class Opd_report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_plate: [],
      list_opd: [],
      opd_name: "All",
      date_start: moment().add(-20, "days").format("YYYY-MM-DD"),
      date_end: moment().add(-0, "days").format("YYYY-MM-DD"),
      plate_id: "All",
      list_report: [],
    };
  }
  async componentDidMount() {
    let opd_data = await httpClient.get(server.OPD_ALL);
    let all_data = await httpClient.post(server.RFID_ALL_VENDER, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    this.setState({ list_plate: all_data.data.result, list_opd: opd_data.data.result });
  }
  renderTableRow = () => {
    try {
      if (this.state.list_opd !== null) {
        const myResult = this.state.list_opd;
        return myResult.map((item) => <option value={item.category}>{item.category}</option>);
      }
    } catch (error) {}
  };
  Click_Confirm = async () => {
    let t_data = await httpClient.post(server.OPD_report_raw, {
      opd_name: this.state.opd_name,
      date_start: moment(this.state.date_start).format("YYYY-MM-DD"),
      date_end: moment(this.state.date_end).format("YYYY-MM-DD"),
      plate_id: this.state.plate_id,
    });
    this.setState({ list_report: t_data.data.result });
    console.log(t_data.data);
  };
  renderTableRow_report = () => {
    try {
      if (this.state.list_report !== null) {
        const myResult = this.state.list_report;
        return myResult.map((item) => (
          <tr>
            <td>{item.mfgdate}</td>
            <td>{item.plate_id}</td>
            <td>{item.vender}</td>
            <td>{item.opd_category}</td>
            <td>{item.item}</td>
            <td>{item.qty}</td>
            <td>{item.price}</td>
            <td>{item.detail}</td>
            <td>{item.remark}</td>

            <td>
              <button
                type="button"
                class="btn btn-secondary btn-block"
                onClick={async (e) => {
                  console.log(item.id);
                  Swal.fire({
                    title: "Delete OPD : " + item.plate_id,
                    // text: "You are going to delete " + item.id,
                    html:
                      `
                    <div classname="row">วันที่ ` +
                      item.mfgdate +
                      ` /หมวดหมู่ ` +
                      item.opd_category +
                      ` /รายการ ` +
                      item.item +
                      `</div>
                    <div classname="row">จำนวน ` +
                      item.qty +
                      ` </div>
                    `,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await httpClient.patch(server.OPD_RECORD_DEL, { id: item.id });
                      // window.location.reload(false);
                      this.Click_Confirm();
                    }
                  });
                }}
              >
                <BsArchiveFill />
              </button>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>OPD Report</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-info col-md-10">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-6 col-md-3">
                  <div className="row">
                    <label>ทะเบียนรถ</label>
                  </div>
                  <div className="row">
                    <Autocomplete
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
                      renderItem={(item, isHighlighted) => (
                        <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey" }}>{item.plate_id}</div>
                      )}
                      value={this.state.plate_id}
                      onChange={async (e) => {
                        await this.setState({
                          plate_id: e.target.value,
                        });
                        // this.find_data(this.state.plate_id);
                      }}
                      onSelect={async (val) => {
                        await this.setState({
                          plate_id: val,
                        });
                        // this.find_data(this.state.plate_id);
                      }}
                    />
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <label>OPD</label>
                  <select
                    value={this.state.opd_name}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        opd_name: e.target.value,
                      });
                      // this.input_plate_id.focus();
                    }}
                  >
                    <option value="All" selected>
                      All
                    </option>
                    {this.renderTableRow()}
                  </select>
                </div>
                <div class="col-sm-6 col-md-3">
                  <label>Start</label>
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
                <div class="col-sm-6 col-md-3">
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
                <div class="col-sm-0 col-md-2"></div>
                <div class="col-sm-6 col-md-4">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Confirm();
                    }}
                  >
                    ค้นหา
                  </button>
                </div>
                <div class="col-sm-6 col-md-4">
                  <label>&nbsp;</label>
                  <ExcelFile
                    element={<button className="btn btn-success btn-block float-right">Download</button>}
                    filename="opd_raw_data"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.list_report} name="Sheet1">
                      <ExcelColumn label="mfgdate" value="mfgdate" />
                      <ExcelColumn label="plate_id" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />
                      <ExcelColumn label="opd_category" value="opd_category" />
                      <ExcelColumn label="item" value="item" />
                      <ExcelColumn label="price" value="price" />
                      <ExcelColumn label="qty" value="qty" />
                      <ExcelColumn label="detail" value="detail" />
                      <ExcelColumn label="remark" value="remark" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
              </div>
              
              <br />
              <br />

              <div className="card-body table-responsive p-0" style={{ height: 400 }}>
                <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>ทะเบียน</th>
                      <th>Vender</th>
                      <th>หมวดหมู่</th>
                      <th>รายการสิ่งของ</th>
                      <th>จำนวน</th>

                      <th>ค่าใช้จ่าย</th>
                      <th>รายละเอียด</th>
                      <th>หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderTableRow_report()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Opd_report;
