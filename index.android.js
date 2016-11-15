import React, {Component} from 'react';
import {
	AppRegistry,
	Navigator,
	DrawerLayoutAndroid,
	ScrollView,
	View,
	Text
} from 'react-native';

let GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';

import Navigate from './src/utils/Navigate';
import {Toolbar} from './src/components';
import Sidemenu from './src/scenes/Sidemenu';
import GioiThieu from './src/scenes/GioiThieu';

if (GcmAndroid.launchNotification) {
	let notification = GcmAndroid.launchNotification;
	let info = JSON.parse(notification.info);
	Notification.create({subject: info.subject, message: info.message,});
	GcmAndroid.stopService();
} else {

	class Application extends Component {

		static childContextTypes = {
			drawer: React.PropTypes.object,
			navigator: React.PropTypes.object
		};

		constructor(props) {
			super(props);
			this.state = {
				drawer: null,
				navigator: null
			};
		}

		getChildContext = () => {
			return {drawer: this.state.drawer, navigator: this.state.navigator}
		};

		setDrawer = (drawer) => {
			this.setState({drawer});
		};

		setNavigator = (navigator) => {
			this.setState({navigator: new Navigate(navigator)});
		};

		render() {
			const {drawer, navigator} = this.state;
			const navView = React.createElement(Sidemenu);

			return (
				<DrawerLayoutAndroid drawerWidth={300} drawerPosition={DrawerLayoutAndroid.positions.Left} renderNavigationView={() => {
					if (drawer && navigator) {
						return navView;
					}
					return null;
				}} ref={(drawer) => {
					!this.state.drawer
					? this.setDrawer(drawer)
					: null
				}}>
					{drawer && <Navigator initialRoute={Navigate.getInitialRoute()} navigationBar={< Toolbar onIconPress = {
						drawer.openDrawer
					} />} configureScene={() => {
						return Navigator.SceneConfigs.FadeAndroid;
					}} ref={(navigator) => {
						!this.state.navigator
						? this.setNavigator(navigator)
						: null
					}} renderScene={(route) => {
						if (this.state.navigator && route.component) {
							return (
								<View style={styles.scene} showsVerticalScrollIndicator={false}>
									<route.component title={route.title} path={route.path} {...route.props}/>
								</View>
							);
						}
					}}/>
}
				</DrawerLayoutAndroid>
			);
		}
	}

	AppRegistry.registerComponent('VFUScheduler', () => Application);

	const styles = {
		scene: {
			flex: 1,
			marginTop: 56
		}
	};
}
