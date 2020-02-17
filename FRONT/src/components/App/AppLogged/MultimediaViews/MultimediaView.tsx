import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IFile } from "../../../../interfaces/IFile";
import {
  API_URL_MULTIMEDIA,
  API_URL_IMAGES
} from "../../../../constants";
import { myFetch, getYoutubeId } from "../../../../utils";
import "./MultimediaView.css";
import { Link } from "react-router-dom";
import { SetChosenFileAction } from "../../../../redux/actions";
import paid from "../../../../icons/money.png";
import free from "../../../../icons/free.png";
import history from "../../../../history";
import logoSolo from "../../../../images/logoSolo.png"

interface IGlobalStateProps {}

interface IGlobalActionProps {
  setChosenFile(file: IFile): void;
}

interface IProps {
  file: IFile;
}

interface IState {
  name: string;
  surname: string;
  avatar: string;
  userId: number | null;
  isPurchased: boolean;
  isAdmin: boolean;
}

type TProps = IProps & IGlobalStateProps & IGlobalActionProps;

class MultimediaView extends React.Component<TProps, IState> {
  isRedkaneLive = history.location.pathname.split("/")[1] === "redkaneLive";

  constructor(props: TProps) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      avatar: "",
      userId: null,
      isPurchased: false,
      isAdmin: false
    };
    this.settingFile = this.settingFile.bind(this);
  }
  //setting card owner´s details
  componentDidMount() {
    const { file } = this.props;
    const { id, multimediaId } = file;
    const token: any = localStorage.getItem("token");
    this.getUser(id, token);
    this.setPurchaseStatus(multimediaId, token);
  }

  setPurchaseStatus(multimediaId: number, token: any) {
    myFetch({ path: `/multimedia/isPurchased/${multimediaId}`, token }).then(
      response => {
        this.setState({ isPurchased: response });
      }
    );
  }

  getUser(id: number, token: any) {
    myFetch({ path: `/users/${id}`, token }).then(user => {
      this.setState({
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
        userId: user.id,
        isAdmin: user.isAdmin
      });
    });
  }

  settingFile(file: IFile) {
    this.props.setChosenFile(file);
  }
  render() {
    const { file } = this.props;
    const { multimediaId, price, type } = file;
    let { path, title, description } = file;
    description = description?.replace(/1!1/g, "'");
    const { name, surname, userId, isPurchased } = this.state;
    let { avatar } = this.state;
    path = path ? path : "defaultBanner.jpg";
    avatar = avatar ? avatar : "defaultAvatar.jpg";
    title = title ? title : "TITLE";


    return (
      <div
        className={
          !this.isRedkaneLive
            ? "card animated fadeIn delay-0.5s cardStyle"
            : "card animated fadeIn delay-0.5s cardStyleDark"
        }
        style={{
          height: "62vh",
          backgroundColor: this.isRedkaneLive ? "#00000000" : ""
        }}
      >
        {path?.includes("youtube") ? (
          <iframe
          title={this.state.name}
            style={{ height: "59%", border: "none" }}
            src={`https://www.youtube.com/embed/${getYoutubeId(
              path
            )}?start=0&end=7`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <img
            className="card-img-top"
            style={{ height: "50%" }}
            src={`${API_URL_MULTIMEDIA}${path}`}
            alt="Not found"
          />
        )}
        {/* Title */}

        <div
          className="card-body text-light"
          style={{
            backgroundColor: !this.isRedkaneLive ? "#fafafa" : "#101010"
          }}
        >
                  <Link
            to={`/singleMultimedia/${multimediaId}`}
            onClick={() => this.settingFile(file)}
          >

            <h5
              className={
                !this.isRedkaneLive
                  ? "card-text text-dark webLinks"
                  : "card-text text-light webLinks"
              }
              style={{ color: this.isRedkaneLive ? "white" : "" }}
            >
              {type === "image" && <i className="fas fa-camera"></i>}
              {type === "article" && <i className="far fa-newspaper"></i>}
              {" " + title}
            </h5>

          <p
            className={
              !this.isRedkaneLive
                ? "card-text text-dark"
                : "card-text text-light"
            }
            style={{ minHeight: "8vh" }}
          >
            {" "}
            {description?.substring(0, 100) + "..."}
          </p>
          </Link>
          {/* AVATAR. LIINK TO USERS MULTIMEDIA */}
          <div className="container-fluid">
            <div className="row" style={{ fontSize: "1.5rem" }}>
              {!this.isRedkaneLive ? (
                <div className="col-2">
                  <Link to={`/updateProfile/${userId}`}>
                    {
                      <img
                        data-toggle="tooltip"
                        data-placement="top"
                        title={`${name} ${surname}`}
                        className="cardAvatar"
                        src={`${API_URL_IMAGES}${avatar}`}
                        alt="not found"
                      />
                    }
                  </Link>
                </div>
              ) : (
                <div className="col-2">
                <img
                  data-toggle="tooltip"
                  data-placement="top"
                  title={`${name} ${surname}`}
                  className="cardAvatarRK"
                  src={logoSolo}
                  alt="not found"
                />
                </div>
              )}

              <div className="col-6"></div>

              <div className="col-2"></div>
              <div className="col-2">
                {price !== 0 && !isPurchased && (
                  <img className="iconsSize" src={paid} alt="" />
                )}
                {price !== 0 && isPurchased && (
                  <i className="far fa-check-circle text-success"></i>
                )}
                {price === 0 && !this.isRedkaneLive && <img className="iconsSize" src={free} alt="" />}
              </div>
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              {/* {new Date(time).toLocaleDateString()} */}
              <br />
            </small>
          </p>
        </div>


      </div>
      
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {
  setChosenFile: SetChosenFileAction
};

export default connect(mapStateToProps, mapDispatchToProps)(MultimediaView);
