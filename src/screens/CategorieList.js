import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, withTheme } from "react-native-paper";
import RNPlaceHolder from "../components/RNPlaceHolder";
import PostCard from "../components/PostCard";
import NetInfo from "@react-native-community/netinfo";
const cacheKey = "CacheCategories";
import {
  AdMobBanner
} from "expo-ads-admob";
class CategorieList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      isFetching: false,
      isLoading: false,
      page: 1
    };
  }
  renderFooter = () => {
    if (this.state.isFetching) return null;
    return <RNPlaceHolder />;
  };
  onRefresh() {
    this.setState({ isLoading: true }, function() {
      this.fetchPost();
    });
  }
  componentDidMount() {
    this.setState({ isLoading: true }, function() {
      this.fetchPost();
    });
  }
  handleLoadMore = () => {
    this.setState(
      {
        isFetching: true,
        page: this.state.page + 1
      },
      () => {
        this.fetchPost();
      }
    );
  };
  async fetchPost() {
    let page = this.state.page;
    let categorie_id = this.props.navigation.getParam("categorie_id");
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      const _cachedData = await AsyncStorage.getItem(cacheKey);
      if (!_cachedData) {
        alert("You're currently offline and no local data was found.");
      } else {
        alert("Your are offline but still have cache data");
      }
      this.setState({
        categories: categories,
        isloading: false
      });
    } else {
      const response = await fetch(
        `https://kriss.io/wp-json/wp/v2/posts?categories=${categorie_id}&page=${page}&per_page=10`
      );
      const post = await response.json();
      this.setState({
        posts: page === 1 ? post : [...this.state.posts, ...post],
        isLoading: false
      });
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          post
        })
      );
    }
  }
  render() {
    let categorie_name = this.props.navigation.getParam("categorie_name");
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
          <Title style={{ marginLeft: 30 }}>{categorie_name}</Title>
          <FlatList
            data={this.state.posts}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isLoading}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.1}
            handleLoadMore={this.renderFooter}
            renderItem={({ item, index }) => (
              <View>
                <PostCard
                  item={item}
                  navigation={this.props.navigation}
                  textColor={colors.text}
                />
                {index % 4 == 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <AdMobBanner
                      bannerSize="fullBanner"
                      adUnitID="ca-app-pub-2547344479047582/3578793688" // Test ID, Replace with your-admob-unit-id
                      testDeviceID="EMULATOR"
                      servePersonalizedAds // true or false
                      onDidFailToReceiveAdWithError={this.bannerError}
                    />
                  </View>
                ) : (
                  <View />
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}
export default withTheme(CategorieList);
