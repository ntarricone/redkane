import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IFile } from "../../../../interfaces/IFile";
import {
  API_URL,
  API_URL_MULTIMEDIA,
  API_URL_IMAGES
} from "../../../../constants";
import { myFetch, getYoutubeId } from "../../../../utils";
import "./MultimediaView.css";
import { Link } from "react-router-dom";
import { SetChosenFileAction } from "../../../../redux/actions";
import paid from "../../../../icons/money.png";
import free from "../../../../icons/free.png";
import saved from "../../../../icons/save-button.png";
import { decode } from "jsonwebtoken";

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
}

type TProps = IProps & IGlobalStateProps & IGlobalActionProps;

class MultimediaView extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      avatar: "",
      userId: null,
      isPurchased: false
    };
    this.settingFile = this.settingFile.bind(this);
  }
  //setting card owner´s details
  componentDidMount() {
    const { file } = this.props;
    const { id, multimediaId } = file;
    const token: any = localStorage.getItem("token");
    console.log(id);
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
      console.log(user);
      this.setState({
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
        userId: user.id
      });
    });
  }

  settingFile(file: IFile) {
    this.props.setChosenFile(file);
  }
  render() {
    const { file } = this.props;
    const { multimediaId, description, time, price, type } = file;
    let { path, title } = file;
    const { name, surname, userId, isPurchased } = this.state;
    let { avatar } = this.state;
    path = path ? path : "defaultBanner.jpg";
    avatar = avatar ? avatar : "avatar.png";
    title = title ? title : "TITLE";
    const token: any = localStorage.getItem("token");
    const { id: loggedId }: any = decode(token);

    return (
      <div
        className="card animated fadeIn delay-0.5s cardStyle"
        style={{ height: "62vh" }}
      >
        {path?.includes("youtube") ? (
          <iframe
            style={{ height: "59%" }}
            src={`https://www.youtube.com/embed/${getYoutubeId(
              path
            )}?start=0&end=5`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <img
            className="card-img-top"
            style={{ height: "50%" }}
            src={`${API_URL_MULTIMEDIA}${path}`}
            alt="Card image cap"
          />
        )}
        {/* Title */}
        <div className="card-body" style={{ backgroundColor: "#fafafa" }}>
          <Link
            to={`/singleMultimedia/${multimediaId}`}
            onClick={() => this.settingFile(file)}
          >
            <h5 className="card-title text-dark webLinks">
              {type === "image" && <i className="fas fa-camera"></i>}
              {/* {type === "video" && <i className="fab fa-youtube"></i>} */}
              {type === "article" && <i className="far fa-newspaper"></i>}
              {" " + title}
            </h5>
          </Link>

          <p className="card-text text-dark" style={{ minHeight: "8vh" }}>
            {" "}
            {description?.substring(0, 100) + "..."}
          </p>

          {/* AVATAR. LIINK TO USERS MULTIMEDIA */}
          <div className="container-fluid">
            <div className="row" style={{ fontSize: "1.5rem" }}>
              <div className="col-2">
                <Link to={`/updateProfile/${userId}`}>
                  {
                    <img
                      data-toggle="tooltip"
                      data-placement="top"
                      title={`${name} ${surname}`}
                      className="cardAvatar"
                      src={`${API_URL_IMAGES}${avatar}`}
                    />
                  }
                </Link>
              </div>

              <div className="col-6"></div>

              <div className="col-2">

              </div>
              <div className="col-2">
              {price !== 0 && !isPurchased && loggedId !== userId && (
                  <img className="iconsSize" src={paid} alt="" />
                )}
                {price !== 0 && isPurchased && (
                  <i className="far fa-check-circle text-success"></i>
                )}
                {price == 0 && (
                  <img className="iconsSize" src={free} alt="" />
                )}
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
