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
                <button
          className="btn btn-sm btn-default ">
          <Link to="/uploadArticle/0">
            <i className="far fa-keyboard icon mr-2"></i>
          </Link>
          </button>
          <button
          className="btn btn-sm btn-default ">
          <i
            className="fas fa-camera icon mr-2"
            data-toggle="modal"
            data-target="#exampleModal"
          ></i>
          </button>
          <button
          className="btn btn-sm btn-default ">
          <i
            className="fas fa-video icon"
            data-toggle="modal"
            data-target="#exampleModal2"
          ></i>
          </button>
 
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
      </>
    );
  }
}

export default ContentUploader;
