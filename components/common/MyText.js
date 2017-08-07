import React from "react";
import { Text } from "react-native";

export default class MyText extends React.Component {
  render() {
    return (
      <Text
        allowFontScaling={false}
        style={{ fontFamily: "LatoRegular" }}
        {...this.props}
      />
    );
  }
}
