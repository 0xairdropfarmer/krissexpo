import React from "react";
import {
  FlatList,
  ScrollView,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Card, Title } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import RNPlaceHolder from "../components/RNPlaceHolder";
const cacheKey = "CacheCategories";
class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isFetching: false,
      categories: [],
      page: 1
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.fetchCategorie();
    });
  }
  handleLoadMore = () => {
    this.setState(
      {
        isFetching: true,
        page: this.state.page + 1
      },
      () => {
        this.fetchCategorie();
      }
    );
  };
  async fetchCategorie() {
    let page = this.state.page;
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
        `https://kriss.io/wp-json/wp/v2/categories?page=${page}`
      );
      const categories = await response.json();

      this.setState({
        categories:
          page === 1 ? categories : [...this.state.categories, ...categories],
        isLoading: false,
        isFetching: false
      });
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          categories
        })
      );
    }
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ marginTop: 23, padding: 33 }}>
          <RNPlaceHolder />
        </View>
      );
    } else {
      return (
        <ScrollView>
          <FlatList
            data={this.state.categories}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.1}
            handleLoadMore={this.renderFooter}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("CategorieList", {
                    categorie_id: item.id,
                    categorie_name: item.name
                  })
                }
              >
                <Card>
                  <Card.Content>
                    <Title>{item.name}</Title>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      );
    }
  }
}
export default Categories;
