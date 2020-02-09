import React from "react";
import ContentUploader from "../../shared/ContentUploader/ContentUploader";
import Filter from "../../shared/Filter/Filter";
import { IAccount } from "../../../interfaces/IAccount";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { SetFilesAction } from "../../../redux/actions";
import { IFile } from "../../../interfaces/IFile";
import { myFetch } from "../../../utils";
import { IFiles } from "../../../interfaces/IFiles";
import MultimediaView from "./MultimediaViews/MultimediaView";
import InfiniteScroll from "react-infinite-scroll-component";
import produce from "immer";

interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps {
  setFiles(files: IFile[]): void;
}

interface IState {
  type: "" | "article" | "image" | "video";
  price: number | null;
  counter: number;
  hasMore: boolean;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class Home extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "",
      price: null,
      counter: 6,
      hasMore: true
    };
    this.settingFiles = this.settingFiles.bind(this);
    this.cookies = this.cookies.bind(this);
  }

  componentDidMount() {
    this.settingFiles(this.state.type);
    this.cookies();
  }

  settingFiles(type: any) {
    console.log("Ooooooooooooooooooooooo");
    if (this.state.counter >= 36) {
      this.setState({ hasMore: false });
      return;
    }

    let { counter } = this.state;

    this.setState({ type: type, counter: counter + 3 });
    console.log(counter);
    setTimeout(
      ({ token } = this.props.account, { setFiles } = this.props) =>
        myFetch({
          method: "POST",
          path: `/multimedia/${type}`,
          token,
          json: { counter }
        }).then(files => {
          console.log("entri");
          console.log(files);
          if (files) {
            setFiles(files);
          }
        }),
      200
    );
  }

  //TODO - COOKIES FOR ARTICLLEEE

  cookies(){
document.cookie = "juanitoooo"
console.log(document.cookie)
  }

  render() {
    const { files } = this.props;
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm d-flex justify-content-center marginTopUploader">
              {this.props.account.isCreator ? (
                <ContentUploader></ContentUploader>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-7 ">
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
                <button className="btn btn-sm btn-default btn-sorteable">
                  Category <i className="fa fa-sort"></i>
                </button>
                <button className="btn btn-sm btn-default btn-sorteable filterButton">
                  Free <i className="fa fa-sort"></i>
                </button>
                <div className="col-5">
                  <Filter parent={"home"}></Filter>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InfiniteScroll
          dataLength={files.order.length}
          next={() => this.settingFiles(this.state.type)}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          // onScroll={this.settingFiles}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
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
        </InfiniteScroll>

        {/* <ImagesView></ImagesView>
          <VideosView></VideosView> */}
      </>
    );
  }
}

const mapStateToProps = ({ account, files }: IStore): IGlobalStateProps => ({
  account,
  files
});

const mapDispatchToProps: IGlobalActionProps = {
  setFiles: SetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
