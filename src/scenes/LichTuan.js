import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ListView,
	TouchableOpacity,
	Alert,
	DeviceEventEmitter,
	ActivityIndicator
} from 'react-native';

import Accordion from 'react-native-accordion';
let GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';
import DatePicker from 'react-native-datepicker';

import { Divider } from 'react-native-material-design';

const API_URL = 'https://vfu-events.herokuapp.com/getEvents';

export default class LichTuan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			dataSource: new ListView.DataSource({
				getSectionData: (dataBlob, sectionID) => {
					return dataBlob[sectionID];
				},
				getRowData: (dataBlob, sectionID, rowID) => {
					return dataBlob[sectionID + ':' + rowID];
				},
				rowHasChanged: (row1, row2) => row1 !== row2,
				sectionHeaderHasChanged: (s1, s2) => s1 !== s2
			})
		};
		this.bindMethods();
	}

	bindMethods() {
		if (!this.bindableMethods) {
			return;
		}

		for (let methodName in this.bindableMethods) {
			this[methodName] = this.bindableMethods[methodName].bind(this);
		}
	}

	componentDidMount() {
		this.fetchData();

		GcmAndroid.addEventListener('register', function (token) {
			console.log('send gcm token to server', token);
		});
		GcmAndroid.addEventListener('notification', function (notification) {
			console.log('receive gcm notification', notification);
			var info = JSON.parse(notification.data.info);
			if (!GcmAndroid.isInForeground) {
				Notification.create({subject: info.subject, message: info.message});
			}
		});

		DeviceEventEmitter.addListener('sysNotificationClick', function (e) {
			console.log('sysNotificationClick', e);
		});

		GcmAndroid.requestPermissions();
	}

	fetchData() {
		fetch(API_URL).then((response) => response.json()).then((responseData) => {
			let weekNo = responseData.weekNo,
				weekEvents = responseData.weekEvents,
				length = weekEvents.length,
				dataBlob = {},
				sectionIDs = [],
				rowIDs = [],
				dayEvents,
				events,
				eventsLength,
				event,
				i,
				j;

			for (i = 0; i < length; i++) {
				dayEvents = weekEvents[i];

				sectionIDs.push(dayEvents.dayId);
				dataBlob[dayEvents.dayId] = dayEvents.day;

				events = dayEvents.events;
				eventsLength = events.length;

				rowIDs[i] = [];

				for (j = 0; j < eventsLength; j++) {
					event = events[j].event;
					rowIDs[i].push(event.eventId);

					dataBlob[dayEvents.dayId + ':' + event.eventId] = event;
				}
			}

			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
				weekNo: weekNo,
				loaded: true
			});
		}).done();
	}

	render() {
		if (!this.state.loaded) {
			return this.renderLoadingView();
		}

		return this.renderListView();
	}

	renderLoadingView() {
		return (
			<View style={styles.header}>
				<View style={[styles.container, {paddingTop: 10}]}>
					<ActivityIndicator
						animating={!this.state.loaded}
						style={[styles.activityIndicator, {height: 35}]}
						color="white"
						size="large"
					/>
				</View>
			</View>
		);
	}

	renderListView() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Tuần {this.state.weekNo}</Text>
				</View>
				<ListView dataSource={this.state.dataSource} style={styles.listview} renderRow={this.renderRow} renderSectionHeader={this.renderSectionHeader}/>
			</View>
		);
	}

	renderSectionHeader(sectionData, sectionID) {
		return (
			<View style={styles.section}>
				<Text style={styles.text}>{sectionData}</Text>
			</View>
		);
	}
}

Object.assign(LichTuan.prototype, {
	bindableMethods: {
		renderRow: function (rowData, sectionID, rowID) {

			let handleAlarm = (datetime) => {
				console.log(datetime);

				let d = datetime.split(',');
				let year = parseInt(d[0]);
				let	month = parseInt(d[1])-1;
				let	date = parseInt(d[2]);
				let	hour = parseInt(d[3]);
				let	minute = parseInt(d[4]);

				let message = `${rowData.time} ${rowData.hour} - ${rowData.content}`;
				Notification.create({
					subject: 'Lịch Tuần VNUF',
					message: message,
					sendAt: new Date(year, month, date, hour, minute),
  				autoClear: true,
					bigText: message
				})
				.then((notification) => {
					console.log(notification);
					Alert.alert(
						'Hẹn giờ thông báo',
						'Bạn đã hẹn giờ thành công vào ' + notification.sendAtHour + ':' + notification.sendAtMinute + ' ngày ' + notification.sendAtDay + '/' + notification.sendAtMonth + '/' + notification.sendAtYear,
						[
							{text: 'OK', onPress: () => console.log('OK Pressed!')},
						]
					);
				});
			};

			let header = (
				<View style={styles.rowStyle}>
					<Text style={styles.rowText}>
						<Text style={{fontWeight: 'bold'}}>{rowData.time} {rowData.hour ? rowData.hour + ' ' : ' '}</Text>
						<Text>- {' ' + rowData.content}</Text>
					</Text>
				</View>
			);

			let content = (
				<View style={styles.rowContentStyle}>
					<Text style={styles.rowContentText}>
						<Text style={{fontWeight: 'bold'}}>Địa điểm:</Text>
						<Text> {rowData.place ? rowData.place : 'Đang cập nhật...'}</Text>
					</Text>
					<Text style={styles.rowContentText}>
						<Text style={{fontWeight: 'bold'}}>Thành phần:</Text>
						<Text> {rowData.participants ? rowData.participants : 'Đang cập nhật...'}</Text>
					</Text>
					<Text style={styles.rowContentText}>
						<Text style={{fontWeight: 'bold'}}>Người chủ trì:</Text>
						<Text> {rowData.leader ? rowData.leader : 'Đang cập nhật...'}</Text>
					</Text>
					<Divider style={styles.divider}/>
					<View style={styles.datePicker}>
						<DatePicker
							style={{width: 100}}
							mode="datetime"
							format="YYYY,MM,DD,HH,mm"
							iconSource={require('./../img/alarm.png')}
							placeholder="Hẹn giờ"
							minDate={new Date()}
							customStyles={{
								dateIcon: {
									position: 'absolute',
									left: 0,
									top: 4,
									marginLeft: 0
								},
								dateInput: {
									marginLeft: 36,
									height: 30,
									borderColor: '#009688',
									borderRadius: 5,
								},
								placeholderText: {
									color: 'black'
								}
							}}
							onDateChange={handleAlarm}
						/>
					</View>
				</View>
			);

			return (<Accordion header={header} content={content} easing="easeOutCubic" underlayColor="#B2DFDB"/>);
		}
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1
	},
	activityIndicator: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#B76EB8',
		flexDirection: 'column',
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 20,
		color: 'white'
	},
	text: {
		color: 'white',
		paddingHorizontal: 8,
		fontSize: 16
	},
	rowStyle: {
		paddingVertical: 20,
		paddingLeft: 16,
		borderTopColor: 'white',
		borderLeftColor: 'white',
		borderRightColor: 'white',
		borderBottomColor: '#E0E0E0',
		borderWidth: 1
	},
	rowText: {
		color: '#212121',
		fontSize: 16
	},
	rowContentStyle: {
		paddingVertical: 8,
		paddingLeft: 16,
		borderTopColor: '#009688',
		borderWidth: 0.5,
		backgroundColor: '#B2DFDB'
	},
	rowContentText: {
		color: '#212121',
		fontSize: 14
	},
	subText: {
		fontSize: 14,
		color: '#757575'
	},
	section: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: 6,
		backgroundColor: '#009688'
	},
	datePicker: {
		flex: 1,
		alignItems: 'flex-end',
		marginTop: 5,
		marginRight: 16
	},
	divider: {
		marginTop: 5,
		marginRight: 16
	}
});
