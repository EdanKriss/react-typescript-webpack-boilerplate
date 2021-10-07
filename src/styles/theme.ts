import { createTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import type { Breakpoints } from '@material-ui/core/styles/createBreakpoints';
import grey from '@material-ui/core/colors/grey';
// import green from '@material-ui/core/colors/green';

// These must be kept in sync with ./global-styles.scss variables
export const colors = {
    white: '#fff',
    black: '#000',
    info: '#3498db',
    success: '#07bc0c',
    warning: '#f1c40f',
    error: '#e74c3c',
    gray: {
        dark: grey[800],
        darker: grey["A400"],
        darkest: '#222225',
        neutral: grey[400],
        light: grey[300],
        lighter: grey[200],
        lightest: grey[100],
    },
} as const;

export const breakpoints: Partial<{
    unit: string;
    step: number;
} & Breakpoints> = {
    values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
};

declare module '@material-ui/core/styles/createTheme' {
    interface Theme {
        layout: {
            contentViewPaddingPx: number;
            paperPaddingPx: number;
            drawerWidth: number;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        layout: {
            contentViewPaddingPx: number;
            paperPaddingPx: number;
            drawerWidth: number;
        };
    }
}

export const LightTheme = createTheme({
    layout: {
        contentViewPaddingPx: 24,
        paperPaddingPx: 16,
        drawerWidth: 240,
    },
    breakpoints: breakpoints,
    palette: {
        type: "light",
        //   primary: {
        //     main: green[500],
        //   },
        secondary: {
            main: purple[500],
        },
        background: {
            default: colors.gray.lighter,
            paper: colors.white,
        },
    },
    mixins: {
        toolbar: {
            height: "64px",
        },
    },
    overrides: {
        MuiFormHelperText: {
            root: {
                position: "absolute",
                bottom: "-17px"
            },
        },
    },
});

export const DarkTheme = createTheme({
    layout: {
        contentViewPaddingPx: 24,
        paperPaddingPx: 16,
        drawerWidth: 240,
    },
    breakpoints: breakpoints,
    palette: {
        type: "dark",
        //   primary: {
        //     main: green[500],
        //   },
        secondary: {
            main: purple[500],
        },
        background: {
            default: colors.gray.darker,
            paper: colors.gray.dark,
        },
    },
    mixins: {
        toolbar: {
            height: "64px",
        },
    },
    overrides: {
        MuiFormHelperText: {
            root: {
                position: "absolute",
                bottom: "-17px"
            },
        },
    },
});