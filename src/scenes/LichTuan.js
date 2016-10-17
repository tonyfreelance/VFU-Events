import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Alert
} from 'react-native';

// import { Subheader, Ripple } from 'react-native-material-design';

// const API_URL = 'http://demo9383702.mockable.io/users';
const API_URL = 'http://demo7138566.mockable.io/vfu-weeks';

export default class LichTuan extends Component {

  constructor(props) {
      super(props);
      this.state = this.getInitialState();
      this.bindMethods();
  }

  bindMethods() {
      if (! this.bindableMethods) {
          return;
      }

      for (let methodName in this.bindableMethods) {
          this[methodName] = this.bindableMethods[methodName].bind(this);
      }
  }

  getInitialState() {
      let getSectionData = (dataBlob, sectionID) => {
          return dataBlob[sectionID];
      }

      let getRowData = (dataBlob, sectionID, rowID) => {
          return dataBlob[sectionID + ':' + rowID];
      }

      return {
          loaded : false,
          dataSource : new ListView.DataSource({
              getSectionData          : getSectionData,
              getRowData              : getRowData,
              rowHasChanged           : (row1, row2) => row1 !== row2,
              sectionHeaderHasChanged : (s1, s2) => s1 !== s2
          })
      }
  }

  componentDidMount() {
      this.fetchData();
  }

  fetchData () {
      fetch(API_URL).then((response) => response.json()).then((responseData) => {
          let weekEvents = responseData.weekEvents,
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

              for(j = 0; j < eventsLength; j++) {
                  event = events[j].event;
                  rowIDs[i].push(event.eventId);

                  dataBlob[dayEvents.dayId + ':' + event.eventId] = event;
              }
          }

          this.setState({
              dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
              loaded     : true
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
            <Text style={styles.headerText}>Lịch tuần 42</Text>
            <View style={styles.container}>
              {/* <ActivityIndicatorIOS
                animating={!this.state.loaded}
                style={[styles.activityIndicator, {height: 80}]}
                size="large"
              /> */}
              <Text>Loading...</Text>
              </View>
          </View>
      );
  }

  renderListView() {
      return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Lịch tuần 42</Text>
            </View>
              <ListView
                  dataSource = {this.state.dataSource}
                  style      = {styles.listview}
                  renderRow  = {this.renderRow}
                  renderSectionHeader = {this.renderSectionHeader}
              />
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
  bindableMethods : {
      renderRow : function (rowData, sectionID, rowID) {
          return (
              <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                <View style={styles.rowStyle}>
                  <Text style={styles.rowText}>{rowData.content}</Text>
                  </View>
              </TouchableOpacity>
          );
      },
      onPressRow : function (rowData, sectionID) {
          var buttons = [
              {
                  text : 'Cancel'
              },
              {
                  text    : 'OK',
                  onPress : () => this.createCalendarEvent(rowData, sectionID)
              }
          ]
          Alert.alert(rowData.time + ': ' + rowData.participants + ' tại ' + rowData.place, null, null);
          // <Text>UserEmail is:</Text>
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
      backgroundColor: '#3F51B5',
      flexDirection: 'column',
      paddingTop: 25
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
  subText: {
      fontSize: 14,
      color: '#757575'
  },
  section: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 6,
      backgroundColor: '#2196F3'
  }
});
