import React from "react";
import { myFetch } from "../utils";

interface IGlobalStateProps {}

interface IState {
  email: string;
  password: string;
  error: string;
}

type TProps = IGlobalStateProps;

class Login extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.login = this.login.bind(this);
  }

  onEmailChange(event: any) {
    const email = event.target.value;
    this.setState({ email, error: "" });
  }

  onPasswordChange(event: any) {
    const password = event.target.value;
    this.setState({ password, error: "" });
  }

  login() {
    console.log("entroooooo")
    const { email, password } = this.state;
    try {
      (async () => {
        const response = await fetch(`http://localhost:3000/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
        console.log("response")
        console.log(response)
        const { token } = await response.json();
        localStorage.setItem("token", token);
        // localStorage.setItem("avatar", avatar);
        // this.userLogin(token, avatar);
      })();
    } catch {
      //this is an immediate function because methods can´t be async
    //   this.setState({ error: true });
    }
  }

  render() {
    const { email, password } = this.state;
    return (
      <>
        <nav className="navbar navbar-light  justify-content-between">
          <div className="navbar-brand"></div>
          <form className="form-inline">
            <input
              className="form-control mr-sm-1"
              type="text"
              placeholder="Email"
              value={email}
              onChange={this.onEmailChange}
            />
            <input
              className="form-control mr-sm-1"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onPasswordChange}
            />
            <button className="btn btn-light my-2 my-sm-0"
            onClick={this.login}>
              Login
            </button>
          </form>
        </nav>
      </>
    );
  }
}

export default Login;
