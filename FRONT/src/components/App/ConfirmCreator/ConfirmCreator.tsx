import React from "react";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";
import { myFetch } from "../../../utils";
import { IStore } from "../../../interfaces/IStore";
import { SetAccountAction } from "../../../redux/actions";
import logoKane from "../AppUnlogged/logoKane.png";
import swal from "sweetalert";
import emailjs from "emailjs-com";

interface IProps {
  match: any;
}
interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

interface IState {
  name: string;
  surname: string;
  avatar: string;
  banner: string;
  email: string;
}
class ConfirmCreator extends React.Component<TProps, IState> {
  userId = this.props.match.params.id;
  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      banner: "",
      avatar: "",
      email: ""
    };
    this.confirmCreator = this.confirmCreator.bind(this);
  }

  componentDidMount() {
    (async () => {
      myFetch({ path: `/users/${this.userId}` }).then(response => {
        if (response) {
          this.setState(response);
        }
      });
    })();
  }

  confirmCreator() {
    myFetch({
      method: "POST",
      path: `/users/confirmCreator/${this.userId}`
    }).then(response => {
      if (response) {
        swal({
          title: "Success!",
          text: `${this.state.name} is now a creator!`,
          icon: "success",
          timer: 10000
        });
        let params = {
          to_email: this.state.email,
          to_name: this.state.name
        };
        emailjs.send(
          "gmail",
          "confirming_creator",
          params,
          "user_awOkEod8V5OPyDAHyaGPf"
        );
      } else {
        swal({
          title: "Sorry there has been an error upgrading this user",
          text: "Please contact your support team",
          icon: "error",
          timer: 4000
        });
      }
    });
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-3"></div>
            <div className="col-8 mt-5 ">
              {" "}
              <img
                className="animated zoomIn slower mt-5"
                src={logoKane}
                alt=""
              />{" "}
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 mt-5 text-center">
              <h3>
                Do you want to allow{" "}
                <strong>
                  <u>{" " + this.state.name + " " + this.state.surname}</u>
                </strong>{" "}
                to become a creator?
              </h3>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div
              className="col-10 mt-2 text-center"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                data-toggle="modal"
                data-target="#becomeCreator"
                className="btn btn-block mt-1 mb-2 buttonColor mt-3 animated  pulse  infinite"
                style={{ width: "30%" }}
                onClick={this.confirmCreator}
              >
                Yes Sir!
              </button>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {
  setAccount: SetAccountAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCreator);
