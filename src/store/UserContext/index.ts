import * as React from 'react';

interface User {
    token: string;
    username: string;
}

const UserContext = React.createContext<User>({
    token: "",
    username: "",
});

type UserContextType = React.ContextType<typeof UserContext>;

export {
    User,
    UserContext,
    UserContextType,
};