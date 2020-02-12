import React from "react";
import "./Filter.css";
import { myFetch } from "../../../utils";

import { IFiles } from "../../../interfaces/IFiles";
import { IFile } from "../../../interfaces/IFile";
import history from "../../../components/../history";
import { IStore } from "../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../redux/actions";
import { connect } from "react-redux";

interface IProps {
  parent: string;
}
interface IState {
  key: string;
}
interface IGlobalStateProps {
  files: IFiles;
}

interface IGlobalActionProps {
  setFiles(files: IFile[]): void;
  unsetFiles(): void;
}

type TProps = IGlobalStateProps & IProps & IGlobalActionProps;

class Filter extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      key: ""
    };

    this.search = this.search.bind(this);
    
  }

  search() {
    const initialState = { key: "" };
    this.props.unsetFiles();
    const token: any = localStorage.getItem("token");
    const { key } = this.state;
    const { setFiles, parent } = this.props;
    if (parent == "home") {
      myFetch({
        method: "POST",
        path: `/multimedia/searchByWord`,
        token,
        json: { key }
      }).then(files => {
        if (files) {
          setFiles(files);
          this.setState(files);
        }
      });
    } else if (parent == "user") {
      myFetch({
        method: "POST",
        path: `/multimedia/searchByWordAndId/${this.userId}`,
        token,
        json: { key }
      }).then(files => {
        if (files) {
          setFiles(files);
          this.setState(files);
        }
      });
    }  else if (parent == "redkaneLive") {
      myFetch({
        method: "POST",
        path: `/multimedia/searchRedkaneLive`,
        token,
        json: { key }
      }).then(files => {
        if (files) {
          setFiles(files);
          this.setState(files);
        }
      });
    }

    this.setState(initialState);
  }

  render() {
    const { files } = this.props;
    const { key } = this.state;
    return (
      <>
              <div className=" search">
                <input
                  type="text"
                  id="myInput"
                  placeholder="Search content..."
                  className="form-control"
                  value={this.state.key}
                  onChange={event => {
                    this.setState({ key: event.target.value });
                  }}
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.search();
                    }
                  }}
                />
              </div>
       
      </>
    );
  }
}

const mapStateToProps = ({ files }: IStore): IGlobalStateProps => ({
  files
});

const mapDispatchToProps: IGlobalActionProps = {
  setFiles: SetFilesAction,
  unsetFiles: UnsetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
