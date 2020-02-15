import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Headline,
  withTheme
} from "react-native-paper";
import React, { Component } from "react";
import PostCard from "../components/PostCard";
import RNPlaceHolder from "../components/RNPlaceHolder";
import { withNavigationFocus } from "react-navigation";
class BookMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark_post: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.fetchBookMark();
    });
  }
  async fetchBookMark() {
    let bookmark = await AsyncStorage.getItem("bookmark").then(token => {
      const res = JSON.parse(token);
      if (res != null) {
        const result = res.map(post_id => {
          return "include[]=" + post_id;
        });
        return result.join("&");
      } else {
        return null;
      }
    });
    const response = await fetch(
      `https://kriss.io/wp-json/wp/v2/posts?${bookmark}`
    );
    const post = await response.json();
    this.setState({ bookmark_post: post, isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ marginTop: 23, padding: 33 }}>
          <RNPlaceHolder />
        </View>
      );
    } else {
      const { colors } = this.props.theme;
      return (
        <View>
          <Headline style={{ marginLeft: 30 }}>Bookmark Post</Headline>
          <FlatList
            data={this.state.bookmark_post}
            renderItem={({ item }) => (
              <PostCard
                item={item}
                navigation={this.props.navigation}
                textColor={colors.text}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}
export default withNavigationFocus(withTheme(BookMark));
