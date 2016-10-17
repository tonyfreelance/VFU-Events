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
              <Drawer.Header image={<Image source={require('./../img/nav.jpg')} />}>
                <View style={styles.header}>
                  <Avatar size={80} image={<Image source={{ uri: "http://facebook.github.io/react-native/img/opengraph.png?2" }}/>} />
                  <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>Ứng dụng xem lịch tuần</Text>
                </View>
              </Drawer.Header>

              <Drawer.Section
                items={[{
                  icon: 'home',
                  value: 'Giới Thiệu',
                  active: !route || route === 'gioiThieu',
                  onPress: () => this.changeScene('gioiThieu'),
                  onLongPress: () => this.changeScene('gioiThieu')
                }]}
              />

              <Drawer.Section
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
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Config"
                    items={[{
                        icon: 'invert-colors',
                        value: 'Change Theme',
                        label: '24',
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
