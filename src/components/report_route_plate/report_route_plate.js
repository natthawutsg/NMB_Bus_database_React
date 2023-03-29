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
  zIndex: 9999,
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
class Report_route_plate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_to: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_from: moment().add(-0, "days").format("YYYY-MM-DD"),
      plate_id: "",
      list_plate: [],
      show_table: [],
      display_table:"none"
    };
  }
  componentDidMount = async () => {
    let bus_data = await httpClient.post(server.BUS_LIST_PLATE, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    this.setState({ list_plate: bus_data.data.result });
  };

  click_submit = async () => {
    let route_data = await httpClient.post(server.DATA_ROUTE_REPORT_PLATE, {
      date_from: this.state.date_from,
      date_to: this.state.date_to,
      plate: this.state.plate_id,
    });
    console.log(route_data.data.result);
    this.setState({ show_table: route_data.data.result,   display_table:"" });
  };
  renderTableRow_input = () => {
    try {
      if (this.state.show_table !== null) {
        const myResult = this.state.show_table;
        return myResult.map((item) => (
          <tr>
            <td>{item.mfgdate}</td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.AM_in}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.CN_out}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.B_in}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.A_out}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.N_in}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.M_out}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.C_in}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.B_out}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.D_in}&nbsp;
              </button>
            </td>
            <td>
              <button type="button" className="btn btn-block btn-default">
                &nbsp;{item.D_out}&nbsp;
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
        <h1 style={{ textAlign: "center" }}>Route Report by Plate</h1>
        <div
          className="row"
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
    

          <div className="card card-warning col-12" style={{ zIndex: 1 }}>
          <div className="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>Date From</label>
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
                    }}
                  />
                </div>

                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>Date To</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_to}
                    onChange={async (e) => {
                      this.setState({
                        date_to: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                    }}
                  />
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  {/* <label>&nbsp;</label> */}
                  <br />
                  <Autocomplete
                    style={{ width: "100%", zIndex: 9999 }}
                    inputProps={{ style: menuStyle }}
                    items={this.state.list_plate}
                    shouldItemRender={(item, value) =>
                      // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                      item.plate_id.indexOf(value) > -1
                    }
                    getItemValue={(item) => item.plate_id}
                    renderItem={(item, isHighlighted) => (
                      <div
                        style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey", fontSize: 14, zIndex: 9999 }}
                      >
                        {item.plate_id}
                      </div>
                    )}
                    value={this.state.plate_id}
                    inputSearchString="hello"
                    onChange={async (e) => {
                      await this.setState({
                        plate_id: e.target.value,
                        display_table:"none"
                      });
                      // this.find_data(this.state.new_plate_id);
                    }}
                    onSelect={async (val) => {
                      await this.setState({
                        plate_id: val,
                        display_table:"none"
                      });
                      // this.find_data(this.state.new_plate_id);
                    }}
                  />
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      this.click_submit();
                    }}
                  >
                    Submit
                  </button>
                </div>
                <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 "></div>
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
                      <ExcelColumn label="date" value="mfgdate" />
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
              <br/>
            <div className="card-body table-responsive p-0" style={{ height: this.state.window_height / 1.8, fontSize: 14,display:this.state.display_table }}>
              <table id="DivTable" className="table table-head-fixed  text-nowrap" role="grid" aria-describedby="example2_info">
                <thead style={{ textAlign: "center", zIndex: 1 }}>
                  <tr>
                    <th className="col-1" style={{ backgroundColor: "whitesmoke " }}>
                      วันที่
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

         <br/>
          </div>
        </div>
      </div>
    );
  }
}

export default Report_route_plate;
