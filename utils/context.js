import React, { createContext } from 'react';
import * as userApi from '../api/user';
import * as groupApi from '../api/group';
import { withOAuth } from 'aws-amplify-react-native';

const GlobalContext = createContext(undefined);

class State extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skipChooseUsername: false,
            userInitLoading: true,
            userAppetite: [],
            userFollowing: [],
            userGroups: [],
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
                userApi
                    .editAppetite([])
                    .then(() => this.setState({ userAppetite: [] }));
            },
            setSkipChooseUsername: () => {
                this.setState({ skipChooseUsername: true });
            },
            followUser: async (userDisplayUsername) => {
                const followRes = await userApi.followUser(userDisplayUsername);
                this.setState({ userFollowing: followRes.following });
            },
            unfollowUser: async (userDisplayUsername) => {
                const unfollowRes = await userApi.unfollowUser(
                    userDisplayUsername,
                    this.state.userFollowing
                );
                this.setState({ userFollowing: unfollowRes.following });
            },
            createNewGroup: async (groupName, userDisplayUsername) => {
                const createGroupRes = await groupApi.createNewGroup(
                    groupName,
                    userDisplayUsername
                );
                this.setState({ userGroups: createGroupRes.groups });
            },
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.oAuthUser && this.props.oAuthUser) {
            const userInit = await userApi.getInitUserInfo();
            console.log('didnt have oauthuser, now we do!!!!', userInit);
            this.setState({
                userInitLoading: false,
                userAppetite: userInit.appetite || [],
                userFollowing: userInit.following || [],
                userGroups: userInit.groups || [],
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
