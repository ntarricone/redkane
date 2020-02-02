import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetBannerAction, SetAvatarAction } from "../../../../redux/actions";
import { API_URL_IMAGES } from "../../../../constants";
import UpdateProfileForm from "./UpdateProfileForm";

interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {

}

interface IState {

}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UserArticles extends React.Component<TProps, IState> {

  constructor(props: any) {
    super(props);


    this.state = {

    };


  }


  render() {
    const { account } = this.props;
    const { avatar, banner } = account;

    return (
      <>
      <h1>Hello world!</h1>

      </>
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(UserArticles);
