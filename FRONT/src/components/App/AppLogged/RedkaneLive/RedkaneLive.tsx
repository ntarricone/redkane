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
        type: "",
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
      const token: any = localStorage.getItem("token");
      this.setState({ type: type, category: "" });
      console.log(type);
      setTimeout(
        ({ setFiles } = this.props) =>
          myFetch({
            method: "POST",
            path: `/multimedia/redkaneLive`,
            json: { type },
            token
          }).then(files => {
            console.log("entri");
            console.log(files);
            if (files) {
              setFiles(files);
              console.log(files);
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
            <div className="col-12 col-sm d-flex justify-content-center marginTopUploader"></div>
          </div>
        </div>
        <div className="container ">
          <div className="row mt-4 mb-5">
            <div className="col-sm-3  col-12 mt-3">
              <div className="btn-group search-group">
              {type === "" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === ''?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("")}
                >
                  All
                </button>
                {type === "article" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'article'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("article")}
                >
                  Articles 
                </button>
                {type === "image" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'image'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("image")}
                >
                  Images 
                </button>
                {type === "video" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'video'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("video")}
                >
                  Videos 
                </button>
               
              </div>
            </div>
           
            <div className="col-sm-3 col-6 mt-3">
            <Filter parent = {"redkaneLive"}  changeTypeToDefault={this.changeTypeToDefault}></Filter>
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
  