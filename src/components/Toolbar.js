import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import AppStore from '../stores/AppStore';
import DatePicker from 'react-native-datepicker';

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onIconPress: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title: AppStore.getState().routeName,
            theme: AppStore.getState().theme,
            counter: 0
        };
    }

    componentDidMount = () => {
        AppStore.listen(this.handleAppStore);
    };

    componentWillUnmount() {
        AppStore.unlisten(this.handleAppStore);
    }

    handleAppStore = (store) => {
        this.setState({
            title: store.routeName,
            theme: store.theme
        });
    };

    render() {
        const { navigator } = this.context;
        const { theme, counter } = this.state;
        const { onIconPress } = this.props;

        return (
            <MaterialToolbar
              title={navigator && navigator.currentRoute ? navigator.currentRoute.title : 'Lịch Tuần'}
              primary={theme}
              icon={navigator && navigator.isChild ? 'keyboard-backspace' : 'menu'}
              onIconPress={() => navigator && navigator.isChild ? navigator.back() : onIconPress()}
              // actions={[{
              //   icon: 'warning',
              //   badge: { value: counter, animate: true },
              //   onPress: this.handleAlarm
              // }]}
              // rightIconStyle={{
              //   margin: 10
              // }}
            />
        );
    }
}
