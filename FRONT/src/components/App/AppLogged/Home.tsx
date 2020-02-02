import React from "react";
import ContentUploader from "../../shared/ContentUploader/ContentUploader";
import ArticlesView from "./MultimediaViews/ArticlesView";
import ImagesView from "./MultimediaViews/ImagesView";
import VideosView from "./MultimediaViews/VideosView";
import Filter from "../../shared/Filter/Filter";
import { IAccount } from "../../../interfaces/IAccount";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { SetFilesAction } from "../../../redux/actions";
import { IFile } from "../../../interfaces/IFile";
import { myFetch } from "../../../utils";
import { IFiles } from "../../../interfaces/IFiles";

interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps{
  setFiles(files: IFile[]): void;
}

interface IState {
  selectedView: "articles" | "images" | "videos";
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class Home extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      selectedView: "articles"
    };
  }

  componentDidMount(){
  setTimeout(({token} = this.props.account, {setFiles} = this.props) => 

    myFetch({path: `/multimedia`, token}).then(files =>{
      console.log("entri")
      if(files){
        console.log(files)
        setFiles(files);
      }
    })
    ,300);
    // setTimeout(() => clearTimeout(timeOut), 151)

  }
  render() {
    const {files} = this.props;
    return (
      <>
        {/* {!token && <AppUnlogged></AppUnlogged>} 
        <UpdateProfile></UpdateProfile>
        { token && <AppLogged></AppLogged>} */}
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm d-flex justify-content-center mt-5">
              <ContentUploader></ContentUploader>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="mt-4" style={{ width: "30rem" }}>
              <input
                type="text"
                placeholder="Search content..."
                className="form-control"
              />
            </div>
          </div>
          <div className="row ">
            <div className="col-12 d-flex justify-content-center mt-4">
              <Filter></Filter>
            </div>
          </div>

          <div className="row">
            <div className="col-12 ">
              <div className="btn-group ">
                <button className="btn btn-sm btn-default btn-sorteable">
                  Fecha <i className="fa fa-sort"></i>
                </button>
                <button className="btn btn-sm btn-default btn-sorteable">
                  Costo <i className="fa fa-sort"></i>
                </button>
                <button className="btn btn-sm btn-default btn-sorteable">
                  Tipo de Contenido <i className="fa fa-sort"></i>
                </button>
                <button className="btn btn-sm btn-default btn-sorteable">
                  Vistas <i className="fa fa-sort"></i>
                </button>
                <button className="btn btn-sm btn-default btn-sorteable">
                  Credibilidad <i className="fa fa-sort"></i>
                </button>
              </div>
            </div>
          </div>
          </div>
          <div className="container">
            <div className="row">
              {files.order.map( id =>(
              <div key={id} className="col-sm-6 col-md-4 col-12">
              <ArticlesView file={files.byId[+id]}></ArticlesView>
              <br/>
              </div>
              ))}
            </div>
          </div>
 


          {/* <ImagesView></ImagesView>
          <VideosView></VideosView> */}

      </>
    );
  }
}

const mapStateToProps = ({ account, files }: IStore): IGlobalStateProps => ({
  account, files
});

const mapDispatchToProps: IGlobalActionProps = {
  setFiles: SetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
