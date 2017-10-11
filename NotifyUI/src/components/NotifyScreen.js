import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';

const list = [
  {
    source: 'thanhnien.vn',
    image: 'http://image.thanhnien.vn/Uploaded/trantuananh/2017_09_22/screenshot2017-09-22at72827pm_PXAQ.jpg?width=500',
    title: 'Vòng 19 V.League: Đánh bại Hải Phòng, Quảng Nam dẫn đầu bảng xếp hạng',
    description: 'Lại chính là Đinh Thanh Trung ghi bàn quyết định giúp Quảng Nam giành chiến thắng, đồng thời đội bóng của HLV Hoàng Văn Phúc vươn lên dẫn đầu BXH.',
    publishedDate: '2017-09-22T12:32:29Z'
  }
];

class NotifyScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <Text>Notify Tab</Text> */}
        <List>
          {
            list.map((l, i) => (
              <ListItem
                roundAvatar
                avatar={{uri:l.image}}
                key={i}
                title={l.title}
                subtitle={l.description}
              />
            ))
          }
        </List>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  }
}

export default NotifyScreen;
