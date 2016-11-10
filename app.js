import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigation, withNavigation } from '@exponent/ex-navigation';
import Router from './navigation/Router';

@withNavigation
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StackNavigation
        id="root"
        initialRoute={Router.getRoute('home')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
