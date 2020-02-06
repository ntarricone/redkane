import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IFile } from "../../../../interfaces/IFile";
import {
  API_URL,
  API_URL_MULTIMEDIA,
  API_URL_IMAGES
} from "../../../../constants";
import { myFetch } from "../../../../utils";
import "./MultimediaView.css";
import { Link } from "react-router-dom";
import { SetChosenFileAction } from "../../../../redux/actions";
import paid from "../../../../icons/money.png";
import saved from "../../../../icons/save-button.png";


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
}

type TProps = IProps & IGlobalStateProps & IGlobalActionProps;

class MultimediaView extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      avatar: "",
      userId: null
    };
    this.setingFile = this.setingFile.bind(this);
  }
  //setting card owner´s details
  componentDidMount() {
    const { file } = this.props;
    const { id } = file;
    const token: any = localStorage.getItem("token");
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

  setingFile(file: IFile) {
    this.props.setChosenFile(file);
  }
  render() {
    const { file } = this.props;
    const { path, multimediaId, description, title, time, price, type } = file;
    const { name, surname, avatar, userId } = this.state;
    return (
      <div
        className="card animated fadeIn delay-0.5s"
        // style={{ height: "30vw"}}
      >
        {path.includes("youtube") ? (
          <iframe
            style={{ height: "13vw" }}
            src={path + "?start=0&end=5"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            className="card-img-top"
            style={{ height: "13vw" }}
            src={`${API_URL_MULTIMEDIA}${path}`}
            alt="Card image cap"
          />
        )}

        <div className="card-body" style={{ backgroundColor: "#fafafa" }}>
          <Link
            to={`/singleMultimedia/${multimediaId}`}
            onClick={() => this.setingFile(file)}
          >
            <h5 className="card-title text-dark webLinks">{title}</h5>
          </Link>

          {/* //ADD A VARIABLE TO ADD THE TEXT AS A STRING AND THEN CROP  */}
          <p className="card-text text-dark" style={{ minHeight: "8vh" }}>
            {" "}
            {description?.substring(0, 100) + "..."}
          </p>

          {/* AVATAR. LIINK TO USERS MULTIMEDIA */}
          <div className="container-fluid">
            <div className="row" style={{ fontSize: "1.5rem" }}>
              <div className="col-2">
               <Link to ={`/updateProfile/${userId
                }`}>
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
                {price != 0 && <img className="iconsSize" src={paid} alt="" />}
              </div>
              <div className="col-2">
                {/* <i className="far fa-bookmark"></i> */}
                <img className="iconsSize" src={saved} alt="" />
              </div>
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              {new Date(time).toLocaleDateString()}
              <br/>
              <span>({type})</span>
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
