/*import React from 'react';
import FacebookLoginWithButton from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
}

const componentClicked = () => {
  console.log( "Clicked!" )
}

export default function App() {
  return (
    <FacebookLoginWithButton
      appId="2415613495189282"
      autoLoad
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook}
      icon="fa-facebook"/>
    )
}
*/

import React from 'react';
import FacebookLoginWithButton from 'react-facebook-login';

const componentClicked = () => {
  console.log( "Clicked!" )
}

const LoginButton = ({facebookResponse}) => (
  <FacebookLoginWithButton
    appId="2415613495189282"
    // autoLoad
    fields="name,email,picture"
    onClick={componentClicked}
    callback={facebookResponse}
    icon="fa-facebook"/>
  )


const UserScreen = ({user}) => (
  <>
    <h1>Welcome {user.name}!</h1>
    <p>{ user.email }</p>
    <img src={user.picture.data.url} height={user.picture.height} width={user.picture.width} alt="avatar"/>
  </>
)

class login extends React.Component {
  state = {user:false}
  facebookResponse = (response) => { console.log( response ); this.setState( {...this.state, user: response } ) }

  render() {
    return (
      <div style={{ margin: "auto", textAlign: "center", paddingTop: "2em" }}>
        { this.state.user ? <UserScreen user={this.state.user}/> :
          <LoginButton facebookResponse={this.facebookResponse}/>
        }
      </div>
    )
  }
}

export default login