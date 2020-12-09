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
            userGroupInvites: [],
            signOut: () => {
                this.setState({
                    userAppetite: [],
                    userFollowing: [],
                    userGroups: [],
                    userGroupInvites: [],
                    userInitLoading: false,
                    shouldSkipUsername: false,
                });
                props.signOut();
            },
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
            followUser: async (userId, userDisplayUsername) => {
                const followRes = await userApi.followUser(
                    userId,
                    userDisplayUsername
                );
                console.log('setting user following to ', followRes.following);
                this.setState({ userFollowing: followRes.following });
            },
            unfollowUser: async (userId) => {
                const unfollowRes = await userApi.unfollowUser(
                    userId,
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
            answerGroupInvite: async (groupId, groupName, accept) => {
                await userApi.respondGroupInvite(groupId, groupName, accept);
                this.fetchUserInit();
            },
            leaveGroup: async (groupId) => {
                const leaveRes = await userApi.leaveGroup(groupId);
                if (leaveRes.success) {
                    this.setState({
                        userGroups: [
                            ...this.state.userGroups.filter(
                                (g) => g.id !== groupId
                            ),
                        ],
                    });
                }
            },
            selectedCategoryId: '',
            setSelectedCategoryId: (categoryId) => {
                this.setState({ selectedCategoryId: categoryId });
            },
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.oAuthUser && this.props.oAuthUser) {
            this.fetchUserInit();
        }
    }

    async fetchUserInit() {
        try {
            const userInit = await userApi.getInitUserInfo();
            console.log('fetched userinit: ', userInit);
            this.setState({
                userInitLoading: false,
                userAppetite: userInit.appetite || [],
                userFollowing: userInit.following || [],
                userGroups: userInit.groups || [],
                userGroupInvites: userInit.group_invites || [],
            });
        } catch (err) {
            console.error('error receiving user init info: ', err);
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
