import React from "react";
import "./ContentUploader.css";
import UploadMultimedia from "../../App/AppLogged/UploadMultimedia";
import UploadArticle from "../../App/AppLogged/UploadArticle";
import { Link } from "react-router-dom";

interface IGlobalStateProps {}

type TProps = IGlobalStateProps;

class ContentUploader extends React.PureComponent<TProps> {
  render() {
    return (
      <>
        <div className=" uploader">
  
          <div className="article">
            <Link to="/uploadArticle/0" className="nav-link">
              <i className="far fa-keyboard icon"></i>
            </Link>
          </div>
          <a className="card-body">
            <i
              className="fas fa-camera icon"
              data-toggle="modal"
              data-target="#exampleModal"
            ></i>

            <div
              className="modal fade"
              id="exampleModal"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Upload Image
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
                    <UploadMultimedia type={"image"} />
                  </div>
                </div>
              </div>
            </div>
          </a>
          <a className="card-body">
            <i
              className="fas fa-video icon"
              data-toggle="modal"
              data-target="#exampleModal2"
            ></i>

            <div
              className="modal fade"
              id="exampleModal2"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Upload Video
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
                    <UploadMultimedia type={"video"} />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </>
    );
  }
}

export default ContentUploader;
