import React, {Component, PropTypes} from 'react';
import { View, Text, Image, IntentAndroid, StyleSheet } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';

import AppStore from '../stores/AppStore';

export default class GioiThieu extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    render() {
        const { navigator } = this.context;
        const theme = AppStore.getState().theme;

        return (
            <View>
              <Card>
                <Card.Media
                  image={<Image source={require('./../img/gioiThieu.jpg')} />}
                  overlay
                >
                  <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey50]}>Lịch Tuần</Text>
                  <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>Đại học Lâm Nghiệp Việt Nam</Text>
                </Card.Media>
                <Card.Body>
                  <Text style={styles.cardBodyText}>
                    <Text style={{fontWeight: 'bold'}}>Ứng dụng Lịch Tuần Đại học Lâm nghiệp Việt Nam </Text>
                    <Text>mang đến một hình thức mới để cập nhật thông tin nội bộ cho cán bộ công nhân viên trong trường.</Text>
                  </Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Text style={styles.cardBodyText}>
                    <Text>Các chức năng chính của ứng dụng:{'\n'}</Text>
                    <Text>- Xem các sự kiện và cuộc họp quan trọng diễn ra trong tuần ở các đơn vị trong trường.{'\n'}</Text>
                    <Text>- Đặt lịch hẹn để hiện thông báo nhắc nhở khi một sự kiện nào đó sắp diễn ra.</Text>
                  </Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Text style={styles.cardBodyText}>Ứng dụng hiện chỉ hỗ trợ các điện thoại sử dụng hệ điều hành Android.</Text>
                </Card.Body>
              </Card>

              <Button primary={theme} text="XEM LỊCH TUẦN" onPress={() => {navigator.to('lichTuan', 'Lịch Tuần') }} />
              <Button text="Go to child component" primary={theme} onPress={() => { navigator.forward('example',{test: 'dog'}) }} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
  cardBodyText: {
    fontSize: 14,
    lineHeight: 20
  }
});
