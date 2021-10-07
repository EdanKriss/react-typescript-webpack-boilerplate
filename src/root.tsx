import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@material-ui/core/styles';
import type { PaletteType } from '@material-ui/core';

import { LightTheme, DarkTheme } from '@src/styles/theme';
import { UserContext, UserContextType } from '@src/store/UserContext';
import { LayoutContext, LayoutContextType } from '@src/store/LayoutContext';

interface RouteContainerState {
	user: UserContextType;
	layout: LayoutContextType;
	theme: PaletteType;
}

class RouterContainer extends React.Component<{}, RouteContainerState> {

	state: RouteContainerState = {
		user: {
			token: "",
			username: "",
		},
		layout: {
			innerHeight: 0,
			innerWidth: 0,
		},
		theme: 'light',
	};

	componentDidMount() {
		window.addEventListener('resize', this.setInnerDimensions);
		this.setInnerDimensions();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setInnerDimensions);
	}

	setUser = (user: UserContextType): void => {
		this.setState({ user }, () => {
			console.log("setUser() new state:", this.state);
		});
	}

	setLayout = (layout: LayoutContextType): void => {
		this.setState({ layout }, () => {
			console.log("setLayout():", this.state.layout);
		});
	}

	setInnerDimensions = (): void => {
		const { innerHeight, innerWidth } = window;
		const { layout } = this.state;
		this.setLayout({ ...layout, innerHeight, innerWidth });
	}

	// Routes intended to be used when NOT signed in, like '/login'.
	// If a user is already signed in, redirect to '/'
	NoUserRoute = ({ children, ...rest }: RouteProps) => {
		const { user } = this.state;
		return (
			<Route
				{...rest}
				render={(props) => {
					console.log("NoUserRoute render:", props);
					return user.token
						? 	<Redirect
								to={{
									pathname: "/"
								}}
							/>
						:	children
					;
				}}
			/>
		);
	}

	// Routes for signed-in users only.
	// If no user signed in, redirect to '/login'
	PrivateRoute = ({ children, ...rest }: RouteProps) => {
		const { user } = this.state;
		return (
			<Route
				{...rest}
				render={(props) => {
					console.log("PrivateRoute render:", props);
					return user.token 
						? 	children
						:	<Redirect
								to={{
									pathname: "/login"
								}}
							/>
					;
				}}
			/>
		);
	}

	toggleTheme = (): void => {
		const { theme } = this.state;
		if (theme === "light") {
			this.setState({ theme: "dark" });
		} else {
			this.setState({ theme: "light" });
		}
	}

	render() {
		const { user, layout, theme } = this.state;
		const selectedTheme = theme === "light" ? LightTheme : DarkTheme;
		const layoutLoaded: boolean = layout.innerHeight !== 0 && layout.innerWidth !== 0;
		return (
				<ThemeProvider theme={selectedTheme}>
					<LayoutContext.Provider value={layout} >
						<UserContext.Provider value={user} >
							<ToastContainer 
								position="top-center"
							/>
							{
								layoutLoaded &&
								<BrowserRouter>
									<Switch>
										<this.NoUserRoute path="/login">
											<button onClick={()=>{this.setUser({ token: "xxxxxxx", username: "John Doe"})}}>
												Login
											</button>
											{/* <LoginPage setUser={this.setUser} /> */}
										</this.NoUserRoute>
										<this.NoUserRoute path="/signup">
											<h1>Signup</h1>
											{/* <SignupPage /> */}
										</this.NoUserRoute>
										<this.PrivateRoute path="/">
											<h1>Welcome, {user.username}</h1>
											{/* <PortalPage setUser={this.setUser} toggleTheme={this.toggleTheme} /> */}
										</this.PrivateRoute>
									</Switch>
								</BrowserRouter>
							}
						</UserContext.Provider>
					</LayoutContext.Provider>
				</ThemeProvider>
		);
	};
}

ReactDOM.render(
	<RouterContainer />,
	document.querySelector('.holder'),
);
