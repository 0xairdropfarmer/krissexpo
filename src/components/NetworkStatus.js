import React from 'react';
import {List} from 'react-native-paper'
import NetInfo from '@react-native-community/netinfo';
import {Text, StyleSheet} from 'react-native';

export default class NetworkStatus extends React.Component {
    state = {
      isConnected: true,
    };
  
     componentDidMount() {
      NetInfo.addEventListener(state => {
        this.handleConnectivityChange(state.isConnected);
      });
    }
    handleConnectivityChange = isConnected => {
      this.setState({isConnected});
    }
    render() {
   
        return this.state.isConnected ? (
          <Text></Text>
        ) : (
          <List.Item title="Your are offline" style={styles.offLine} />
        );
      }
    }
    
    const styles = StyleSheet.create({
    
      offLine: {
        marginRight: 15,
        flexDirection: 'row',
      },
    });