import React, { useContext } from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
// import {
//   NavigationContainer,
//   DefaultTheme,
//   DarkTheme
// } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import CategorieScreen from "../screens/Categories";
import SettingScreen from "../screens/Setting";
import BookMarkScreen from "../screens/BookMark";
import { Ionicons } from "@expo/vector-icons";
import SinglePost from "../screens/SinglePost";
import CategorieList from "../screens/CategorieList";
import Contact from "../screens/Contact";
import NetworkStatus from "./NetworkStatus";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme
} from "react-native-paper";
import { ThemeContext } from "../components/ThemeController";
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  SinglePost: SinglePost
});
// const Stack = createStackNavigator();
// function HomeStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Post" component={SinglePost} />
//     </Stack.Navigator>
//   );
// }
const BookMarkStack = createStackNavigator({
  Bookmark: BookMarkScreen,
  SinglePost: SinglePost
});
// function BookMarkStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Bookmark" component={BookMarkScreen} />
//       <Stack.Screen name="Post" component={SinglePost} />
//     </Stack.Navigator>
//   );
// }
const SettingStack = createStackNavigator({
  Setting: SettingScreen,
  Contact: Contact
});
// function SettingStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Setting" component={SettingScreen} />
//       <Stack.Screen name="Contact" component={Contact} />
//     </Stack.Navigator>
//   );
// }
const CategorieStack = createStackNavigator({
  Categories: CategorieScreen,
  CategorieList: CategorieList,
  SinglePost: SinglePost
});
// function CategorieStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Categorie" component={CategorieScreen} />
//       <Stack.Screen name="CategorieList" component={CategorieList} />
//       <Stack.Screen name="Post" component={SinglePost} />
//     </Stack.Navigator>
//   );
// }

// const Tab = createBottomTabNavigator();

// export default function DashboardTabNavigator() {
//   const { theme } = useContext(ThemeContext);
//   let paper_theme = theme ? PaperDarkTheme : PaperDefaultTheme;
//   let nav_theme = theme ? DarkTheme : DefaultTheme;

//   return (
//     <PaperProvider theme={paper_theme}>
//       <NavigationContainer theme={nav_theme}>
//         <Tab.Navigator>
//           <Tab.Screen name="Home" component={HomeStack} />
//           <Tab.Screen name="Categories" component={CategorieStack} />
//           <Tab.Screen name="Bookmark" component={BookMarkStack} />
//           <Tab.Screen name="Settings" component={SettingStack} />
//         </Tab.Navigator>
//       </NavigationContainer>
//     </PaperProvider>
//   );
// }
const DashboardTabNavigator = createBottomTabNavigator(
  {
    HomePage: {
      screen: HomeStack,
      navigationOptions: ({ theme }) => {
        const color = theme == "light" ? "black" : "white";
        return {
          tabBarLabel: "Home",
          tabBarIcon: () => <Ionicons color={color} name="md-home" size={30} />
        };
      }
    },
    Categories: {
      screen: CategorieStack,
      navigationOptions: ({ theme }) => {
        const color = theme == "light" ? "black" : "white";
        return {
          tabBarLabel: "Categories",
          tabBarIcon: () => <Ionicons name="md-apps" color={color} size={30} />
        };
      }
    },
    Bookmark: {
      screen: BookMarkStack,
      navigationOptions: ({ theme }) => {
        const color = theme == "light" ? "black" : "white";
        return {
          tabBarLabel: "BookMark",
          tabBarIcon: () => (
            <Ionicons name="ios-bookmark" color={color} size={30} />
          )
        };
      }
    },

    Setting: {
      screen: SettingStack,
      navigationOptions: ({ theme }) => {
        const color = theme == "light" ? "black" : "white";
        return {
          tabBarLabel: "Setting",
          tabBarIcon: () => (
            <Ionicons name="md-settings" color={color} size={30} />
          )
        };
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
        headerRight: <NetworkStatus />
      };
    }
  }
);
const Navigation = createAppContainer(DashboardTabNavigator);
export default () => {
  const { theme } = useContext(ThemeContext);
  let paper_theme = theme ? DarkTheme : DefaultTheme;
  let nav_theme = theme ? "dark" : "light";

  return (
    <PaperProvider theme={paper_theme}>
      <Navigation theme={nav_theme} />
    </PaperProvider>
  );
};
