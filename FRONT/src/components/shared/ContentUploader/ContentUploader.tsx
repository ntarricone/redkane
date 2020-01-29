import React from "react";
import "./ContentUploader.css"

interface IGlobalStateProps {}

type TProps = IGlobalStateProps;

class ContentUploader extends React.PureComponent<TProps> {
  render() {
    return (
      <>    
        <div className="card uploader">
         <div className="card-body">IMAGEN</div>
          <div className="card-body"><i className="far fa-keyboard icon"></i></div>
          <div className="card-body"><i className="fas fa-camera icon"></i></div>
          <div className="card-body"><i className="fas fa-video icon"></i></div>
        </div> 
      </>
    );
  }
}

export default ContentUploader;
