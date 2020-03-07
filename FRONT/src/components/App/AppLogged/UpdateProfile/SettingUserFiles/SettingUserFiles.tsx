import React from "react";
import Filter from "../../../../shared/Filter/Filter";
import { IAccount } from "../../../../../interfaces/IAccount";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../../../redux/actions";
import { IFile } from "../../../../../interfaces/IFile";
import { myFetch } from "../../../../../utils";
import { IFiles } from "../../../../../interfaces/IFiles";
import history from "../../../../../history";
import { decode } from "jsonwebtoken";

interface IProps {
  changeIsFoundToFalse(): void;
  changeIsFoundToTrue(): void;
}
interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps {
  setFiles(files: IFile[]): void;
  unsetFiles(): void;
}

interface IState {
  type: "" | "article" | "image" | "video" | "purchases";
  price: number;
  category: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class settingFiles extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "",
      price: 0,
      category: ""
    };
    this.settingFiles = this.settingFiles.bind(this);
    this.settingCategoryByUser = this.settingCategoryByUser.bind(this);
    this.getPurchases = this.getPurchases.bind(this);
    this.changeTypeToDefault = this.changeTypeToDefault.bind(this);
  }

  componentDidMount() {
    this.props.unsetFiles();
    this.settingFiles(this.state.type);
  }

  changeTypeToDefault() {
    this.setState({ type: "", category: "default" });
  }

  settingFiles(type: any) {
    this.props.unsetFiles();
    const token: any = localStorage.getItem("token");
    this.setState({ type: type, category: "" });
    setTimeout(
      ({ setFiles } = this.props) =>
        myFetch({
          method: "POST",
          path: `/multimedia/byUserAndType/${this.userId}`,
          json: { type },
          token
        }).then(files => {
          if (files) {
            setFiles(files);
            this.props.changeIsFoundToTrue();
          } else {
            this.props.changeIsFoundToFalse();
          }
        }),
      200
    );
  }

  settingCategoryByUser() {
    this.props.unsetFiles();
    const { category, type } = this.state;
    const token: any = localStorage.getItem("token");
    const { setFiles } = this.props;
    if (this.state.type !== "purchases") {
      myFetch({
        method: "POST",
        path: `/multimedia/byCategoryAndUser/${this.userId}/${category}`,
        token,
        json: { type }
      }).then(files => {
        if (files) {
          setFiles(files);
          this.setState(files);
          this.props.changeIsFoundToTrue();
        } else {
          this.props.changeIsFoundToFalse();
        }
      });
    } else {
      myFetch({
        method: "GET",
        path: `/multimedia/byPurchasesAndCategory/${this.userId}/${category}`,
        token
      }).then(files => {
        if (files) {
          setFiles(files);
          this.setState(files);
          this.props.changeIsFoundToTrue();
        } else {
          this.props.changeIsFoundToFalse();
        }
      });
    }
  }

  getPurchases(type: any) {
    this.props.unsetFiles();
    const token: any = localStorage.getItem("token");
    this.setState({ type: type, category: "" });
    setTimeout(
      ({ setFiles } = this.props) =>
        myFetch({
          path: `/multimedia/userPurchases/${this.userId}`,
          token
        }).then(files => {
          if (files) {
            setFiles(files);
            this.props.changeIsFoundToTrue();
          } else {
            this.props.changeIsFoundToFalse();
          }
        }),
      200
    );
  }
  render() {
    const { type } = this.state;
    const token: any = localStorage.getItem("token");
    const { id: loggedId }: any = decode(token);

    return (
      <>
        <div className="container mb-4">
          <div className="row">
            <div className="col-sm-4 col-12 mt-2">
              <div className="btn-group search-group">
                {type === "" && <i className="fas fa-search"></i>}
                <button
                  className={
                    type === "" ? "btn btn-sm selectedFilter" : "btn btn-sm"
                  }
                  onClick={() => this.settingFiles("")}
                >
                  All
                </button>
                {type === "article" && <i className="fas fa-search"></i>}
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
                {type === "image" && <i className="fas fa-search"></i>}
                <button
                  className={
                    type === "image"
                      ? "btn btn-sm selectedFilter"
                      : "btn btn-sm"
                  }
                  onClick={() => this.settingFiles("image")}
                >
                  Images
                </button>
                {type === "video" && <i className="fas fa-search"></i>}
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
                {type === "purchases" && <i className="fas fa-search"></i>}
                {loggedId == this.userId && (
                  <button
                    className={
                      type === "purchases"
                        ? "btn btn-sm selectedFilter"
                        : "btn btn-sm"
                    }
                    onClick={() => this.getPurchases("purchases")}
                  >
                    Purchases
                  </button>
                )}
              </div>
            </div>
            <div
              className="col-sm-2 col-6 mt-2"
            >
              {/* CATEGORY */}
              <select
                className="form-control "
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
                <option value="default">Category...</option>
                <option value="environment">environment</option>
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
            </div>
            <div className="col-sm-3 col-6 mt-2">
              <Filter
                parent={"user"}
                changeTypeToDefault={this.changeTypeToDefault}
              ></Filter>
            </div>
            <div className="col-sm-3 col-12"></div>
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
