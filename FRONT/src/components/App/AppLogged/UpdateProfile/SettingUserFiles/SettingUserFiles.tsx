import React from "react";
import ContentUploader from "../../../../shared/ContentUploader/ContentUploader";
import Filter from "../../../../shared/Filter/Filter";
import { IAccount } from "../../../../../interfaces/IAccount";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../../../redux/actions";
import { IFile } from "../../../../../interfaces/IFile";
import { myFetch } from "../../../../../utils";
import { IFiles } from "../../../../../interfaces/IFiles";
import history from "../../../../../history";
import MultimediaView from "../../MultimediaViews/MultimediaView";


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
  userFiles: IFile[];
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class Home extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "article",
      userFiles: []
    };
    this.settingFiles = this.settingFiles.bind(this);
  }

  componentDidMount() {
    this.props.unsetFiles();
    console.log(this.state.type);
    const token = localStorage.getItem("token");
    this.settingFiles(this.state.type);
    
  }

  settingFiles(type: any) {
    console.log(type);
    const token: any = localStorage.getItem("token")
    this.setState({ type: type });
    setTimeout(
      ( { setFiles } = this.props) =>
        myFetch({ path: `/multimedia/byUserAndType/${this.userId}/${type}`, token }).then(files => {
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
    return (
      <>
        <div className="container">
          <div className="row justify-content-center">
            <div className="top" style={{ width: "30rem" }}>
              <input
                type="text"
                placeholder="Search content..."
                className="form-control"
              />
            </div>
          </div>
          <div className="row ">
            <div className="col-12 d-flex justify-content-center">
              <Filter></Filter>

            </div>
          </div>

          <div className="row">
            <div className="col-12 ">
              <div className="btn-group ">
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
