import React, { Component } from "react";
import { FlatList, View, AsyncStorage, Text } from "react-native";
import { Headline, withTheme } from "react-native-paper";
import RNPlaceHolder from "../components/RNPlaceHolder";
import PostCard from "../components/PostCard";
import NetInfo from "@react-native-community/netinfo";
const cacheKey = "HomeCacheData";
import { AdMobBanner } from "expo-ads-admob";
import * as InAppPurchases from "expo-in-app-purchases";
export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastestpost: [],
      isLoading: false,
      isFetching: false,
      page: 1
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, function() {
      this.fetchLastestPost();
    });
  }
  renderPurchaseButton = item => {
    // Render product details with a "Buy" button
    return (
      <View key={item.productId}>
        ...
        <View style={styles.buttonContainer}>
          <Button
            title="Buy"
            onPress={() => purchaseItemAsync(item.productId)}
          />
        </View>
        ...
      </View>
    );
  };
  
  
  renderFooter = () => {
    if (this.state.isFetching) return null;
    return <RNPlaceHolder />;
  };
  onRefresh() {
    this.setState({ isLoading: true }, function() {
      this.fetchLastestPost();
    });
  }
  async fetchLastestPost() {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      const _cachedData = await AsyncStorage.getItem(cacheKey);
      if (!_cachedData) {
        alert("You're currently offline and no local data was found.");
      }

      const cachedData = JSON.parse(_cachedData);

      this.setState({
        lastestpost: cachedData.post,
        isFetching: false
      });
    } else {
      let page = this.state.page;
      const response = await fetch(
        `https://kriss.io/wp-json/wp/v2/posts?per_page=5&page=${page}`
      );
      const post = await response.json();
      this.setState({
        lastestpost: page === 1 ? post : [...this.state.lastestpost, ...post],
        isLoading: false,
        isFetching: false
      });
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          post
        })
      );
    }
  }
  handleLoadMore = () => {
    this.setState(
      {
        isFetching: true,
        page: this.state.page + 1
      },
      () => {
        this.fetchLastestPost();
      }
    );
  };
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
          <Headline style={{ marginLeft: 30 }}>Lastest Post</Headline>

          <FlatList
            data={this.state.lastestpost}
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
                {index % 3 == 1 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80%",
                      marginLeft: 20
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
                  <Text />
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

export default withTheme(Home);
