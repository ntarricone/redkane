import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";
import { IAccount } from "../../../../../interfaces/IAccount";
import { myFetch } from "../../../../../utils";
import { SetAccountAction } from "../../../../../redux/actions";
import { IStore } from "../../../../../interfaces/IStore";
import youtubeIcon from "../../../../../icons/youtube2.png";
import linkedinIcon from "../../../../../icons/linkedin2.png";
import emailjs from "emailjs-com";
import { decode } from "jsonwebtoken";


interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

interface IProps {
  id: string;
}

interface IState {
  personalStatement: string;
  youtube: string;
  linkedin: string;
  updatedMessage: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class BecomeCreator extends React.Component<TProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      personalStatement: "",
      youtube: "",
      linkedin: "",
      updatedMessage: ""
    };

    this.sendEmail = this.sendEmail.bind(this);
  }

  sendEmail() {
    const { personalStatement, youtube, linkedin } = this.state;
    const name = this.props.account.name;
    const id = this.props.id;

    ;
    let params = {
      from_name: `${name}`,
      id: `${id}`,
      personalStatement: `${personalStatement}`,
      youtube: `${youtube}`,
      linkedin: `${linkedin}`,
      confirmLink: `http://localhost:3001/adminConfirmCreator/${id}`
    };
    console.log(params)

    emailjs
      .send("gmail", "template_378oGZQC", params, "user_awOkEod8V5OPyDAHyaGPf")
      .then(
        result => {
          console.log(result.text);
            swal(
                {title: 'You´ve successfully applied to be a creator!',
                text: 'We´ll shortly confirm your account',
                icon: "success",
                timer: 4000
              });
              myFetch({ method: 'POST', path: `/users/updateSocialMedia/${id}`, json:{youtube, linkedin}
            });
        },
        error => {
          console.log(error);
            swal(
                {title: 'Sorry there has been an error',
                text: 'Please try registering again',
                icon: "error",
                timer: 4000
              });
        }
      );
  }

  render() {
    const { account } = this.props;
    let { personalStatement, youtube, linkedin } = this.state;

    return (
      <>
        <div
          className="modal fade"
          id="becomeCreator"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Hello {account.name}!
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <span>
                  We´d love to have you on board. For this we´d like you to tell
                  us why do you think your content should be on RedKane and to
                  show us some of your best work!
                </span>
                {/* Personal Statement */}
                <div className="container-fluid text-center mt-5">
                  <span> Tell us why do you want to join RedKane:</span>

                  <textarea
                    placeholder="Write a description about you"
                    className="form-control mt-3"
                    value={personalStatement}
                    onChange={({ target: { value } }: any) =>
                      this.setState({ personalStatement: value })
                    }
                  ></textarea>
                </div>

                {/* Social Media Links */}
                <div className="container-fluid text-center mt-5">
                  <span> Links to your portfolio:</span>
                  <div className="row">
                    {/* YOUTUBE */}
                    <img
                      src={youtubeIcon}
                      alt=""
                      style={{ width: "2rem" }}
                      className="mt-3"
                    />

                    <input
                      style={{ width: "90%" }}
                      placeholder="Youtube"
                      className="form-control mt-3 input-sm ml-2 "
                      type="text"
                      value={youtube}
                      onChange={({ target: { value } }) =>
                        this.setState({ youtube: value })
                      }
                    />
                  </div>

                  {/* LINKEDIN */}
                  <div className="row mt-4">
                    <img
                      src={linkedinIcon}
                      alt=""
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <input
                      style={{ width: "90%" }}
                      className="form-control input-sm ml-2"
                      placeholder="Linkedin"
                      type="text"
                      value={linkedin}
                      onChange={({ target: { value } }) =>
                        this.setState({ linkedin: value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  className="btn btn-block buttonColor"
                  style={{ width: "20%" }}
                  onClick={this.sendEmail}
                >
                  Send
                </button>
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BecomeCreator);
