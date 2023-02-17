import React, { Component } from "react";

class Registrule extends Component {
  render() {
    return (
      <div className="row"  style={{marginTop: 70,marginBottom:20 }}>
        <div className="col-3"></div>
        <div className="col-6">
          <h2>Roles for Registeration</h2>
          {/* xx */}
          <div>
            <h5>User Name : &nbsp;</h5>
            <p>
              Users need to use this item for log-in that can not duplicated
              with other and length must be 4-20 charactors.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Emp No : &nbsp;</h5>
            <p>
              The NMB employee number which belong to you. and length must be
              4-5 charactors.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Password : &nbsp;</h5>
            <p>
              Users need to use this item for log-in. You should remember. After
              registed your password will convert to hash code.

              Admin team can not recall your password. In worst case you can ask
              to delete your account. and regist an account again.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Division Code : &nbsp;</h5>
            <p>
              The NMB Division which you are working, should be abbreviation
              because length must be 2-5 charactors.
            </p>
          </div>

          {/* xx */}
          <div>
            <h5>Email : &nbsp;</h5>
            <p>
              is optional data, Not necessary to fill. In case admin would like to contact user, Email is necessary.
            for input need to follow Email name structure Ex. aaaaa@iii.com/.co.th
            </p>
          </div>
          {/* xx */}
          <div className="row">
            <div className="col-4">
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={(e) => {
                  e.preventDefault();
                  //this.props.history.push("/register");
                  window.close();
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
        <div className="col-3"></div>
      </div>
    );
  }
}

export default Registrule;
