import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetBannerAction, SetAvatarAction } from "../../../../redux/actions";
import { API_URL_IMAGES } from "../../../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import { IFile } from "../../../../interfaces/IFile";
import { IFiles } from "../../../../interfaces/IFiles";

interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps {

}

interface IProps {
  file: IFile;
}

interface IState {
  name: string;
  surname: string;
  avatar: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class UserArticles extends React.Component<TProps, IState> {

  constructor(props: TProps) {
    super(props);


    this.state = {
      name: "",
      surname: "",
      avatar: ""

    };


  }


  render() {
    const { account, file } = this.props;
    const { textArea, path } = file;
    const { name, surname, avatar } = this.state;

    return (
      <>
       <div
        className="card animated fadeIn delay-0.5s"
        style={{ height: "30vw"}} 
      >
        <div className="card-body" style={{ backgroundColor: "#fafafa" }}>
          <h5 className="card-title">{file.title}</h5>
          <p className="card-text"
                  style={{ minHeight: "8vh" }} 
          >{textArea?.substring(0, 200) + "..."}</p>

          <div className="container-fluid">
            <div className="row"
            style={{ fontSize: "1.5rem" }}>
              <div className="col-2">
                {
                  <img
                    data-toggle="tooltip"
                    data-placement="top"
                    title={`${name} ${surname}`}
                    className="cardAvatar"
                    src={`${API_URL_IMAGES}${avatar}`}
                  />
                }

              </div>

              <div className="col-6"></div>
              <div className="col-2">
                {/* <i className="far fa-bookmark"></i> */}
                <i className="fas fa-bookmark"></i></div>
              
              <div className="col-2">
                {file.price != 0 && <i className="far fa-money-bill-alt"></i>}
              </div>
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              {new Date(file.time).toLocaleDateString()}
            </small>
          </p>
        </div>
      </div>

      </>
    );
  }
}

const mapStateToProps = ({ account, files }: IStore): IGlobalStateProps => ({
  account,
  files
});

const mapDispatchToProps: IGlobalActionProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(UserArticles);
