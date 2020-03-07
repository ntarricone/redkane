import React from "react";
import { IAccount } from "../../../../interfaces/IAccount";
import { IFiles } from "../../../../interfaces/IFiles";
import { IFile } from "../../../../interfaces/IFile";
import { myFetch } from "../../../../utils";
import { IStore } from "../../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../../redux/actions";
import { connect } from "react-redux";
import history from '../../../../history';
import MultimediaView from "../MultimediaViews/MultimediaView";

interface IProps{
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

class UserPurchases extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "",
      price: 0,
      category: ""
      
    };
    this.getPurchases = this.getPurchases.bind(this);
    this.changeTypeToDefault = this.changeTypeToDefault.bind(this);
    
  }

  componentDidMount() {
    this.props.unsetFiles();
    this.getPurchases(this.state.type);
  }

  changeTypeToDefault(){
    this.setState({type: "", category: "default"});
  }

  
 

  getPurchases(type: any) {
    const token: any = localStorage.getItem("token");
    this.setState({ type: type });
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
            this.props.changeIsFoundToTrue()
          }else{
            this.props.changeIsFoundToFalse()
          }
        }),
      200
    );
  }
  render() {
    const { files } = this.props;

    return (
      <>
        <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                    <div className="container">
                      <div className="row mt-5">
                        {files.order.map(id => (
                          <div key={id} className="col-sm-6 col-md-4 col-12 ">
                            <MultimediaView
                              file={files.byId[+id]}
                            ></MultimediaView>
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
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
