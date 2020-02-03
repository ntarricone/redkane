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

interface IGlobalStateProps {}

interface IGlobalActionProps {}

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

class ArticlesView extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      avatar: "",
      userId: null
    };
  }
  //setting card owner´s details
  componentDidMount() {
    const { file } = this.props;
    const { id } = file;
    const token: any = localStorage.getItem("token");
    myFetch({ path: `/users/${id}`, token }).then(user =>{
      console.log(user)
      this.setState({
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
        userId: user.id
      })}
    );
  }
  //TODO - SEE IF WE CAN MAKE THIS WORK
  // truncateText(text, length) {
  //   if (text.length <= length) {
  //     return text;
  //   }

  //   return text.substr(0, length) + '\u2026'
  // }

  render() {
    const { file } = this.props;
    const { textArea, path, multimediaId } = file;
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
          <Link to={`/singleMultimedia/${multimediaId}`}>
          <h5 className="card-title text-dark webLinks" >{file.title}</h5>

          <p className="card-text text-dark "
                  style={{ minHeight: "8vh" }} 
          >{textArea?.substring(0, 200) + "..."}</p>
          </Link>
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
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

export default connect(mapStateToProps)(ArticlesView);
