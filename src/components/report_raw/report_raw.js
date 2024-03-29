import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactApexChart from "react-apexcharts";
import ReactExport from "react-export-excel";
import { BsArchiveFill } from "react-icons/bs";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class Report_raw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_start: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_end: moment().add(-0, "days").format("YYYY-MM-DD"),
      list_data: [],
      pivot_data: [],
      pivot_head: [],
      pivot_excel: [],
      series: [],
      options: {},
      test: "",
    };
  }

  click_search = async () => {
    await this.setState({ list_data: [], pivot_data: [], pivot_head: [], pivot_excel: [], series: [], options: {}, test: "" });

    let xcel_data = await httpClient.post(server.REPORT_PIVOT_EXCEL, {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    let raw_data = await httpClient.post(server.REPORT_RAW, {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let p_data = await httpClient.post(server.REPORT_PIVOT, {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    await this.setState({ list_data: raw_data.data.result, pivot_data: p_data.data.result, pivot_excel: xcel_data.data.result });
    console.log(this.state.pivot_excel);
    // console.log(p_data.data.list_date);
    var chart_serie = [];
    for (let i = 0; i < p_data.data.result.length; i++) {
      const propertyValues = Object.values(p_data.data.result[i]);
      // console.log(propertyValues);
      // console.log(propertyValues[0],propertyValues.splice(1, propertyValues.length));
      var data_k = propertyValues.splice(1, propertyValues.length);
      var data_chart_k = [];
      for (let k = 0; k < data_k.length; k++) {
        // console.log(data_k[k]);
        data_chart_k.push(data_k[k]);
      }

      // console.log(data_k);

      chart_serie.push({ name: propertyValues[0], data: data_chart_k });
    }
    // console.log(this.state.pivot_data);
    const propertyKeys = Object.keys(this.state.pivot_excel[0]);

    for (let j = 0; j < propertyKeys.length; j++) {
      this.state.pivot_head.push({ data1: propertyKeys[j] });
    }

    // console.log(chart_serie);
    // console.log(this.state.pivot_head);
    this.setState({
      series: chart_serie,
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                // offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            // borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          // axisTicks: {
          //   show: true
          // },
          tickAmount: "dataPoints",
          // tickAmount: 7,
          // range: 7,
          labels: {
            show: true,
            rotate: -90,
            // rotateAlways: true,
          },
          type: "text",
          categories: p_data.data.list_date,
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
    });
  };
  renderTableRow = () => {
    try {
      if (this.state.list_data !== null) {
        const myResult = this.state.list_data;
        return myResult.map((item) => (
          <tr>
            <td>{item.rfid}</td>
            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td>
            <td>{item.vender}</td>
            <td>{item.plate_id}</td>
            <td>{item.mfgdate}</td>
            <td>{item.time}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary btn-block"
                onClick={async (e) => {
                  console.log(item.id);
                  Swal.fire({
                    title: "Attendance Report : " + item.plate_id,
                    // text: "You are going to delete " + item.id,
                    html:
                      `
                    <div classname="row">วันที่ ` +
                      item.mfgdate +
                      ` /เวลา ` +
                      item.time +
                      `ทะเบียน ` +
                      item.plate_id +
                      `</div>
  
                    `,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await httpClient.patch(server.REPORT_DEL, { id: item.id });
                      // window.location.reload(false);
                      this.click_search();
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
  renderTableRow_excel = () => {
    try {
      if (this.state.pivot_head !== null) {
        const myResult = this.state.pivot_head;
        return myResult.map((item) => <ExcelColumn label={item.data1} value={item.data1} numFmt={0} />);
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Attendance Report</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-secondary col-md-11">
            <div className="card-header"> </div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-3">
                  <label>Date Start</label>
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
                <div class="col-sm-12 col-md-3">
                  <label>Date End</label>
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
                <div class="col-sm-12 col-md-2">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-success btn-block"
                    onClick={async (e) => {
                      await this.setState({ list_data: [], pivot_data: [], pivot_excel: [] });
                      this.click_search();
                    }}
                  >
                    Search
                  </button>
                </div>
                <div class="col-sm-2 col-md-2">
                  <label>&nbsp;</label>
                  <div style={{ width: "100%" }}>
                    <ExcelFile
                      element={<button className="btn btn-info btn-block float-right">Raw Report</button>}
                      filename="raw_data"
                      // fileExtension="XLSX"
                    >
                      <ExcelSheet data={this.state.list_data} name="Sheet1">
                        <ExcelColumn label="rfid" value="rfid" />
                        <ExcelColumn label="emp_no" value="emp_no" />
                        <ExcelColumn label="driver_name" value="driver_name" />
                        <ExcelColumn label="plate_id" value="plate_id" />
                        <ExcelColumn label="vender" value="vender" />
                        <ExcelColumn label="date" value="mfgdate" />
                        <ExcelColumn label="time" value="time" />
                      </ExcelSheet>
                    </ExcelFile>
                  </div>
                </div>
                <div class="col-xs-2 col-sm-2">
                  <label>&nbsp;</label>
                  <div
                  // style={{ width: "90%" }}
                  >
                    <ExcelFile
                      element={<button className="btn btn-info btn-block float-right">Pivot Report</button>}
                      filename="pivot_data"
                      // fileExtension="XLSX"
                    >
                      <ExcelSheet data={this.state.pivot_excel} name="Sheet1">
                        {this.renderTableRow_excel()}
                      </ExcelSheet>
                    </ExcelFile>
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div style={{ width: "100%" }}>
                  <div className="card-body table-responsive p-0" style={{ height: 400 }}>
                    <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                      <thead>
                        <tr>
                          <th>RFID</th>
                          <th>รหัสพนักงาน</th>
                          <th>ชื่อ-นามสกุล</th>
                          <th>ผู้ประกอบการ</th>
                          <th>ทะเบียนรถ</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{this.renderTableRow()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-secondary col-md-11">
            <div className="card-body">
              <div className="row" style={{ width: "100%" }}>
                <div id="chart" style={{ width: "100%" }}>
                  <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Report_raw;
