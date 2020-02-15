import React, { Component, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, Switch } from "react-native-paper";
import { ThemeContext } from "../components/ThemeController";
const Setting = ({ navigation }) => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Contact")}
      >
        <List.Section>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="brightness-4" />}
            right={() => <Switch value={theme} onValueChange={toggleTheme} />}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Contact");
            }}
          >
            <List.Item
              title="Contact Us"
              left={() => <List.Icon icon="chevron-right" />}
            />
          </TouchableOpacity>
        </List.Section>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;
