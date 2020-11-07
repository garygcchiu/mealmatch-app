import React, { createContext } from 'react';
import { Auth, Hub } from 'aws-amplify';

const GlobalContext = createContext({});

function getUser() {
    return Auth.currentAuthenticatedUser()
        .then((userData) => userData)
        .catch(() => console.log('Not signed in'));
}

export class GlobalProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            setUser: (newUser) => {
                console.log('setting state user!!!');
                this.setState({ user: newUser });
            },
        };
    }

    componentDidMount() {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                    console.log('signing in!!!!!');
                    getUser().then((userData) => this.state.setUser(userData));
                    break;
                case 'signOut':
                    console.log('signing out!!!');
                    this.state.setUser(null);
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });
    }

    render() {
        return (
            <GlobalContext.Provider value={this.state}>
                {this.props.children}
            </GlobalContext.Provider>
        );
    }
}

export default GlobalContext;
