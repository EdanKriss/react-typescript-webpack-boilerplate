import * as React from 'react';

interface LayoutObject {
    innerHeight: number;
    innerWidth: number;
}

const LayoutContext = React.createContext<LayoutObject>({
    innerHeight: 0,
    innerWidth: 0,
});

type LayoutContextType = React.ContextType<typeof LayoutContext>;

export {
    LayoutContext,
    LayoutContextType,
};