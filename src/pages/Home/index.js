import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import get from 'lodash/get';
import SocketManager from '../../socketManager';
import styles from './styles';
import LiveStreamCard from './LiveStreamCard';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listLiveStream: [],
    };
  }

  componentDidMount() {
    SocketManager.instance.emitListLiveStream();
    SocketManager.instance.listenListLiveStream((data) => {
      this.setState({ listLiveStream: data });
    });
  }

  onPressLiveStreamNow = () => {
    const { route } = this.props;
    const userName = get(route, 'params.userName', '');
    const {
      navigation: { navigate },
    } = this.props;
    navigate('Streamer', { userName, roomName: userName });
  };

  onPressCardItem = (data) => {
    const { route } = this.props;
    const userName = get(route, 'params.userName', '');
    const {
      navigation: { navigate },
    } = this.props;
    navigate('Viewer', { userName, data });
  };

  render() {
    const { route } = this.props;
    const userName = get(route, 'params.userName', '');
    const { listLiveStream } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Welcome : {userName}</Text>
        <Text style={styles.title}>List live stream video</Text>
        <FlatList
          contentContainerStyle={styles.flatList}
          data={listLiveStream}
          renderItem={({ item }) => <LiveStreamCard data={item} onPress={this.onPressCardItem} />}
          keyExtractor={(item) => item._id}
        />
        <TouchableOpacity style={styles.liveStreamButton} onPress={this.onPressLiveStreamNow}>
          <Text style={styles.textButton}>LiveStream Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

Home.propTypes = {
  route: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Home.defaultProps = {
  route: null,
};

export default Home;
