import React from "react";
import { IAccount } from "../../../../interfaces/IAccount";
import { IFiles } from "../../../../interfaces/IFiles";
import { IFile } from "../../../../interfaces/IFile";
import { myFetch } from "../../../../utils";
import Filter from "../../../shared/Filter/Filter";
import MultimediaView from "../MultimediaViews/MultimediaView";
import { IStore } from "../../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../../redux/actions";
import { connect } from "react-redux";




interface IGlobalStateProps {
    account: IAccount;
    files: IFiles;
    
  }
  
  interface IGlobalActionProps {
    setFiles(files: IFile[]): void;
    unsetFiles(): void;
  }
  
  interface IState {
    type: "" | "article" | "image" | "video";
    price: number | null;
    category: string;
  }
  
  
  type TProps = IGlobalStateProps & IGlobalActionProps;
  
  class RedkaneLive extends React.PureComponent<TProps, IState> {
    constructor(props: TProps) {
      super(props);
  
      this.state = {
        type: "article",
        price: 0,
        category: ""
      };
      this.settingFiles = this.settingFiles.bind(this);
      this.changeTypeToDefault = this.changeTypeToDefault.bind(this);
      
    }
  
    componentDidMount() {
      this.props.unsetFiles()
      const token = localStorage.getItem("token");
      this.settingFiles(this.state.type);
    }

    changeTypeToDefault(){
      this.setState({type: "", category: "default"});
    }
  
    settingFiles(type: any) {
      console.log(type);
  
      this.setState({ type: type });
      setTimeout(
        ({ token } = this.props.account, { setFiles } = this.props) =>
          myFetch({ path: `/multimedia/redkaneLive/${type}`, token }).then(files => {
            console.log("entri");
            console.log(files);
            if (files) {
              setFiles(files);
            }
          }),
        200
      );
      
    }
  
    
  
    render() {
      const { files } = this.props;
      const { category, type } = this.state;
      return (
        <>
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm d-flex justify-content-center marginTopUploader">
               {/* {this.props.account.isCreator? <ContentUploader></ContentUploader>: ""} */}
              </div>
            </div>
            
  
            <div className="row mb-2 mt-2">
              <div className="col-8 ">
                <div className="btn-group search-group">
                  <button
                    className="btn btn-sm btn-default btn-sorteable"
                    onClick={() => this.settingFiles("")}
                  >
                    All <i className="fa fa-sort"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-default btn-sorteable"
                    onClick={() => this.settingFiles("article")}
                  >
                    Articles <i className="fa fa-sort"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-default btn-sorteable"
                    onClick={() => this.settingFiles("image")}
                  >
                    Images <i className="fa fa-sort"></i>
                  </button>
                  <button
                    className="btn btn-sm  btn-sorteable"
                    onClick={() => this.settingFiles("video")}
                  >
                    Videos <i className="fa fa-sort"></i>
                  </button>
                  <div className="col-4">
                  <Filter parent = {"redkaneLive"}  changeTypeToDefault={this.changeTypeToDefault}></Filter>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              {files.order.map(id => (
                <div key={id} className="col-sm-6 col-md-4 col-12 ">
                  <MultimediaView file={files.byId[+id]}></MultimediaView>
                  <br />
                </div>
              ))}
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
    setFiles: SetFilesAction,
    unsetFiles: UnsetFilesAction
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(RedkaneLive);
  