//TODO - THIS COMPONENT CAN BE DELETED


import React from "react";
import { connect } from "react-redux";
import { IAccount } from "../../../../../interfaces/IAccount";
import { IFiles } from "../../../../../interfaces/IFiles";
import { IFile } from "../../../../../interfaces/IFile";
import { myFetch } from "../../../../../utils";
import Filter from "../../../../shared/Filter/Filter";
import MultimediaView from "../../MultimediaViews/MultimediaView";
import { IStore } from "../../../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../../../redux/actions";
import { decode } from "jsonwebtoken";
import history from "../../../../../history";

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
  category: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UserPurchases extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "article",
      category: ""
    };
    this.getPurchases = this.getPurchases.bind(this);
    this.settingFiles = this.settingFiles.bind(this);
    this.settingCategoryByUser = this.settingCategoryByUser.bind(this);
  }

  componentDidMount() {
    this.props.unsetFiles();
    this.getPurchases();
  }

  getPurchases() {
    const token: any = localStorage.getItem("token");
    const { setFiles } = this.props;
    setTimeout(
      ({ setFiles } = this.props) =>
        myFetch({
          path: `/multimedia/userPurchases/${this.userId}`,
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

    // if (token) {
    //   (async () => {
    //     myFetch({
    //       path: `/multimedia/userPurchases/${this.userId}`,
    //       token
    //     }).then(files => {
    //       console.log("entri");
    //       console.log(files);
    //       if (files) {
    //         setFiles(files);
    //       }
    //     });
    //   })();
    // }
  }

  settingFiles(type: any) {
    console.log(type);
    const token: any = localStorage.getItem("token");
    this.setState({ type: type });
    console.log(type);
    setTimeout(
      ({ setFiles } = this.props) =>
        myFetch({
          path: `/multimedia/byUserAndType/${this.userId}/${type}`,
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

  settingCategoryByUser() {
    const token: any = localStorage.getItem("token");
    const { category } = this.state;
    console.log(category);
    const { setFiles } = this.props;

    myFetch({
      path: `/multimedia/byCategoryAndUser/${this.userId}/${category}`,
      token
    }).then(files => {
      console.log(files);
      if (files) {
        setFiles(files);
      } else {
        this.props.unsetFiles();
      }
    });
  }

  render() {
    const { files } = this.props;
    const { type } = this.state;

    return (
      <>
      <h1>bbbbbbbbbbbbbbbbbbbbbbbb</h1>
        <div className="row mb-2">
          <div className="container ">
            <div className="row mt-4 mb-5">
              <div className="col-sm-4  col-12 mt-3">
                <div className="btn-group search-group">
                  <i className="fas fa-search mt-2"></i>
                  <button
                    className={
                      type === "" ? "btn btn-sm selectedFilter" : "btn btn-sm"
                    }
                    onClick={() => this.settingFiles("")}
                  >
                    All
                  </button>
                  <button
                    className={
                      type === "article"
                        ? "btn btn-sm selectedFilter"
                        : "btn btn-sm"
                    }
                    onClick={() => this.settingFiles("article")}
                  >
                    Articles
                  </button>
                  <button
                    className={
                      type === "image"
                        ? "btn btn-sm selectedFilter"
                        : "btn btn-sm"
                    }
                    // style={{borderBottom: type === 'image'? '2px solid red': ''}}
                    onClick={() => this.settingFiles("image")}
                  >
                    Images
                  </button>
                  <button
                    className={
                      type === "video"
                        ? "btn btn-sm selectedFilter"
                        : "btn btn-sm"
                    }
                    onClick={() => this.settingFiles("video")}
                  >
                    Videos
                  </button>

                  {/* CATEGORY */}
                  <select
                    className="form-control"
                    style={{ width: "9rem" }}
                    data-spy="scroll"
                    value={this.state.category}
                    onChange={e => {
                      this.setState({ category: e.target.value });

                      setTimeout(() => {
                        this.settingCategoryByUser();
                      }, 40);
                    }}
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
                    <Filter parent={"user"}></Filter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPurchases);
