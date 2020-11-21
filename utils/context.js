import React, { createContext } from 'react';
import * as userApi from '../api/user';
import { withOAuth } from 'aws-amplify-react-native';

const GlobalContext = createContext(undefined);

class State extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skipChooseUsername: false,
            userAppetite: [],
            addToUserAppetite: async (id) => {
                const addRes = await userApi.editAppetite([
                    ...this.state.userAppetite,
                    id,
                ]);
                this.setState({ userAppetite: addRes });
            },
            removeFromUserAppetite: async (id) => {
                const removeRes = await userApi.editAppetite(
                    this.state.userAppetite.filter((a) => a !== id)
                );
                this.setState({ userAppetite: removeRes });
            },
            clearUserAppetite: () => {
                userApi.editAppetite([]);
                this.setState({ userAppetite: [] });
            },
            fetchUserAppetite: async () => {
                const userAppetite = await userApi.getAppetite();
                this.setState({ userAppetite });
            },
            setSkipChooseUsername: () => {
                this.setState({ skipChooseUsername: true });
            },
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.oAuthUser && this.props.oAuthUser) {
            //const userInit = await userApi.getInitUserInfo();
            console.log('didnt have oauthuser, now we do!!!!');
            this.setState({
                userInitLoading: false,
            });
        }
    }

    render() {
        return (
            <GlobalContext.Provider value={this.state}>
                {this.props.children}
            </GlobalContext.Provider>
        );
    }
}

export const GlobalProvider = withOAuth(State);

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
