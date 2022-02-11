import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const Section = ({children, title, navigation, id}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {id})}
      style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

function Home({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [result, setResult] = useState([]);
  async function get(url, body) {
    return axios
      .get(url, {
        params: body,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }

  useEffect(() => {
    if (result.length === 0) {
      get('https://jsonplaceholder.typicode.com/posts', null).then(res => {
        setResult(res);
      });
    }
  });

  function renderItems({item, index}) {
    return (
      <Section title={item.title} navigation={navigation} id={item.id}>
        {item.body}
      </Section>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={[
          backgroundStyle,
          {
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          },
        ]}>
        <FlatList data={result} renderItem={renderItems} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#bcbcbc',
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Home;
