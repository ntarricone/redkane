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
import {decode} from 'jsonwebtoken'


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
  price: number;
  category: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class settingFiles extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "article",
      userFiles: [],
      price: 0,
      category: ""
    };
    this.settingFiles = this.settingFiles.bind(this);
    this.getFreeUserContent = this.getFreeUserContent.bind(this);
    this.settingCategoryByUser = this.settingCategoryByUser.bind(this);
  }

  componentDidMount() {
    this.props.unsetFiles()
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
            console.log(files)
          }
        }),
      200
    );
    
  }

  getFreeUserContent(){
    const { price } = this.state;
    this.setState({ price: 0 })
    const token: any = localStorage.getItem("token");
    setTimeout(
      ( { setFiles } = this.props) =>
        myFetch({ path: `/multimedia/byPriceAndUser/${this.userId}/${price}`, token }).then(files => {
          console.log("entri");
          console.log(files);
          if (files) {
            setFiles(files);
            console.log(files)
          }
        }),
      200
    );
    
  }

  settingCategoryByUser(){
    const initialState = { category: "" };
    const token: any = localStorage.getItem("token");
    const { category } = this.state;
    setTimeout(
      ( { setFiles } = this.props) =>
        myFetch({ path: `/multimedia/byCategoryAndUser/${this.userId}/${category}`, token }).then(files => {
          console.log(files);
          if (files) {
            setFiles(files);
            console.log(files)
          }
        }),
      200
    );
    this.setState(initialState);
    
  }


  render() {
    const { files } = this.props;
    return (
      <>
        

          <div className="row mb-2">
            <div className="col-7 ">
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
                 <button className="btn btn-sm btn-default btn-sorteable"
                 onClick={() => this.getFreeUserContent()}
                 >
                  Free <i className="fa fa-sort"></i>
                </button>
                {/* CATEGORY */}
                <select
              className="form-control"
              style={{ width: "9rem" }}
              data-spy="scroll"
              value={this.state.category}
              
              onChange={e => this.setState({ category: e.target.value })}
              onClick={this.settingCategoryByUser}
            >
              <option selected>Category...</option>
              <option value="environmet">environmet</option>
              <option value="politics">politics</option>
              <option value="sports">sports</option>
              <option value="tech">tech</option>
              <option value="world_news">world news</option>
              <option value="business">business</option>
              <option value="culture">culture</option>
              <option value="fashion">fashion</option>
              <option value="travel">travel</option>
              <option value="other">other</option>
            </select>
                {/* FILTER */}
                <div className="col-5">
                <Filter parent= {"user"} ></Filter>
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

export default connect(mapStateToProps, mapDispatchToProps)(settingFiles);
