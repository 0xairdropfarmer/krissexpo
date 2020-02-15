import React from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  withTheme,
  Text,
  Headline
} from "react-native-paper";
import HTML from "react-native-render-html";
import {
  View,
  ScrollView,
  AsyncStorage,
  Dimensions,
  Share,
  TouchableOpacity,
  Linking
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import RNPlaceHolder from "../components/RNPlaceHolder";
import ImageLoad from "react-native-image-placeholder";
import NetInfo from "@react-native-community/netinfo";
const cacheKey = "CacheCategories";
import { AdMobBanner } from "expo-ads-admob";

class SinglePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      post: [],
      already_bookmark: false,
      remainscore: null
    };
  }

  _openRewarded = async () => {
    try {
      this.setState({ disableRewardedBtn: true });
      await AdMobRewarded.requestAdAsync();
      await AdMobRewarded.showAdAsync();
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ disableRewardedBtn: false });
    }
  };
  countScore = async () => {
    AsyncStorage.getItem("score").then(score => {
      if (score == null) {
        this.setState({ remainscore: score });
      } else {
        let getScore = parseInt(score);
        let remainscore = getScore--;
        this.setState({ remainscore: remainscore });
        AsyncStorage.setItem("score", remainscore);
      }
    });
  };
  componentDidMount() {
    let post_id = this.props.navigation.getParam("post_id");
    // console.log("route", );
    this.fetchPost(post_id).then(() => {
      this.renderBookMark(post_id);
    });
    // this.countScore();
  }
  // componentWillUnmount() {
  //   AdMobRewarded.removeAllListeners();
  // }
  onShare = async (title, uri) => {
    Share.share({
      title: title,
      url: uri
    });
  };
  renderBookMark = async post_id => {
    await AsyncStorage.getItem("bookmark").then(token => {
      const res = JSON.parse(token);
      if (res != null) {
        let data = res.find(value => value === post_id);
        return data == null
          ? this.setState({ already_bookmark: false })
          : this.setState({ already_bookmark: true });
      }
    });
  };
  removeBookMark = async post_id => {
    this.setState({ already_bookmark: false });
    const bookmark = await AsyncStorage.getItem("bookmark").then(token => {
      const res = JSON.parse(token);
      return res.filter(e => e !== post_id);
    });
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
  };
  saveBookMark = async post_id => {
    this.setState({ already_bookmark: true });
    await AsyncStorage.getItem("bookmark").then(token => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find(value => value === post_id);
        if (data == null) {
          res.push(post_id);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
        }
      } else {
        let bookmark = [];
        bookmark.push(post_id);
        AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
      }
    });
  };

  async fetchPost(post_id) {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      const cachedData = JSON.parse(_cachedData);

      let post = cachedData.post.filter(value => value.id === post_id);

      this.setState({
        post: post,
        isloading: false,
        offline: true
      });
    } else {
      const response = await fetch(
        `https://kriss.io/wp-json/wp/v2/posts?_embed&include=${post_id}`
      );
      const post = await response.json();

      this.setState({
        post: post,
        isLoading: false,
        already_bookmark: false
      });
    }
  }
  _handlePress = async () => {
    await AdMobRewarded.showAdAsync();
  };
  render() {
    let post = this.state.post;
    const { colors } = this.props.theme;
    if (this.state.isLoading) {
      return (
        <View style={{ marginTop: 23, padding: 33 }}>
          <RNPlaceHolder />
        </View>
      );
    }
    return (
      <ScrollView>
        <Card>
          <Card.Content>
            <Headline style={{ marginLeft: 30 }}>
              {post[0].title.rendered}
            </Headline>
            <List.Item
              title={`${post[0]._embedded.author[0].name}`}
              description={`${post[0]._embedded.author[0].description}`}
              left={props => {
                return (
                  <Avatar.Image
                    size={55}
                    source={{
                      uri: `${post[0]._embedded.author[0].avatar_urls[96]}`
                    }}
                  />
                );
              }}
              right={props => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.onShare(post[0].title.rendered, post[0].link)
                    }
                  >
                    <FontAwesome name="share" color={colors.text} size={30} />
                  </TouchableOpacity>
                );
              }}
            />
            <List.Item
              title={`Published on ${moment(
                post[0].date,
                "YYYYMMDD"
              ).fromNow()}`}
              right={props => {
                if (this.state.already_bookmark == true) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.removeBookMark(post[0].id)}
                    >
                      <FontAwesome
                        name="bookmark"
                        color={colors.text}
                        size={30}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => this.saveBookMark(post[0].id)}
                    >
                      <FontAwesome
                        name="bookmark-o"
                        color={colors.text}
                        size={30}
                      />
                    </TouchableOpacity>
                  );
                }
              }}
            />
            <Paragraph />
          </Card.Content>
          <ImageLoad
            style={{ width: "100%", height: 300 }}
            loadingStyle={{ size: "large", color: "grey" }}
            source={{ uri: post[0].jetpack_featured_media_url }}
          />
          <Card.Content>
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
            <HTML
              html={post[0].content.rendered}
              imagesInitialDimensions={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 2
              }}
              tagsStyles={{
                p: { color: colors.text },
                h1: { color: colors.text },
                h2: { color: colors.text },
                h3: { color: colors.text },
                pre: { color: colors.accent }
              }}
              onLinkPress={(event, href) => {
                Linking.openURL(href);
              }}
            />
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
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }
}
export default withTheme(SinglePost);
