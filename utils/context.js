import React, { createContext } from 'react';
import * as userApi from '../api/user';

const GlobalContext = createContext(undefined);

export class GlobalProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
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
        };
    }

    render() {
        return (
            <GlobalContext.Provider value={this.state}>
                {this.props.children}
            </GlobalContext.Provider>
        );
    }
}

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
