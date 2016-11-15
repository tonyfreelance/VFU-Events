import React, {Component, PropTypes} from 'react';
import { View, Text, Image } from 'react-native';

import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

export default class Sidemenu extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            route: null
        }
    }

    changeScene = (path, name) => {
        const { drawer, navigator } = this.context;

        this.setState({
            route: path
        });
        navigator.to(path, name);
        drawer.closeDrawer();
    };

    render() {
        const { route } = this.state;

        return (
            <Drawer theme='light'>
              <Drawer.Header image={<Image source={require('./../img/gioiThieu.jpg')} />}>
                <View style={styles.header}>
                  <Avatar size={80} image={<Image source={require('./../img/logo.jpg')}/>} />
                  <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead, {fontWeight: 'bold'}]}>Ứng dụng xem lịch tuần VNUF</Text>
                </View>
              </Drawer.Header>

              <Drawer.Section
                items={[
                  {
                    icon: 'home',
                    value: 'Lịch Tuần',
                    active: !route || route === 'lichTuan',
                    onPress: () => this.changeScene('lichTuan'),
                    onLongPress: () => this.changeScene('lichTuan')
                  },
                  {
                    icon: 'label',
                    value: 'Giới Thiệu',
                    // label: '4',
                    active: route === 'gioiThieu',
                    onPress: () => this.changeScene('gioiThieu'),
                    onLongPress: () => this.changeScene('gioiThieu')
                  }]}
              />

              {/* <Drawer.Section
                title="Components"
                items={[
                {
                icon: 'label',
                value: 'Lịch Tuần',
                // label: '4',
                active: route === 'lichTuan',
                onPress: () => this.changeScene('lichTuan'),
                onLongPress: () => this.changeScene('lichTuan')
                }]}
              /> */}
              <Divider style={{ marginTop: 8 }} />
              <Drawer.Section
                title="Thiết lập"
                items={[{
                  icon: 'invert-colors',
                  value: 'Đổi giao diện',
                  active: route === 'themes',
                  onPress: () => this.changeScene('themes'),
                  onLongPress: () => this.changeScene('themes')
                }]}
              />

            </Drawer>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 20
    }
};
