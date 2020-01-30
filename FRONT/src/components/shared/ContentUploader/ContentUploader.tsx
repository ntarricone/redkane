import React from "react";
import "./ContentUploader.css";
import UploadMultimedia from "../../App/AppLogged/UploadMultimedia";

interface IGlobalStateProps {}

type TProps = IGlobalStateProps;

class ContentUploader extends React.PureComponent<TProps> {
  render() {
    return (
      <>
        <div className="card uploader">
          <div className="card-body">IMAGEN</div>
          <div className="card-body">
            <i className="far fa-keyboard icon"></i>
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
                      Modal title
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
                    <UploadMultimedia></UploadMultimedia>
                  </div>
                </div>
              </div>
            </div>
          </a>
          <a className="card-body">
            <i
              className="fas fa-video icon"
              data-toggle="modal"
              data-target="#exampleModal"
            ></i>
          </a>
        </div>
      </>
    );
  }
}

export default ContentUploader;
