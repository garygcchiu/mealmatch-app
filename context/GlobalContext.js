import React, { createContext } from 'react';

const GlobalContext = createContext({});

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

    render() {
        return (
            <GlobalContext.Provider value={this.state}>
                {this.props.children}
            </GlobalContext.Provider>
        );
    }
}

export default GlobalContext;
