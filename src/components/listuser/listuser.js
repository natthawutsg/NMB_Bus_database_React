import React, { Component } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { key, server } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";

class Listuser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      levelUser: "",
      user_data: null,
    };
  }

  async componentDidMount() {
    if (localStorage.getItem(key.USER_LV) === "Admin") {
      // this.props.Get_List_User();
      this.Get_List_User();
    } else {
      this.props.history.push("/home");
    }
  }

  Get_List_User = async () => {
    let User_All = await httpClient.get(server.URL_USER);
    console.log(User_All.data.result);
    this.setState({ user_data: User_All.data.result });
  };

  renderTableRow = () => {
    try {
      // const { result, isFetching } = this.props.listuserReducer;
      if (this.state.user_data !== null) {
        const myResult = this.state.user_data;
        return myResult.map((item) => (
          <tr key={item.id} role="row" className="odd">
            <td>{item.username}</td>
            <td>{item.vender}</td>
            <td>{item.levelUser}</td>

            <td>
              <a
                class="btn btn-block btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.setItem("user_edit", item.username);

                  this.props.history.push("/edituser");
                }}
              >
                Edit
              </a>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };

  render() {
    return (
      <div className="content-wrapper">
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card  col-md-8">
            <div className="card">
              <div className="card-body table-responsive p-0" style={{ maxHeight: 550 }}>
                <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                  <thead>
                    <tr role="row">
                      <th>User</th>
                      <th>vender</th>
                      <th>Level</th>

                      <th>Edit</th>
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

// //Reducer
// const mapStateToProps = (state) => ({
//   listuserReducer: state.listuserReducer,
// });

// //Action
// const mapDispatchToProps = {
//   ...actions,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Listuser);
export default Listuser;
