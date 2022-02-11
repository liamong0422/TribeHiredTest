import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

function Details({route, navigation}) {
  const [content, setContent] = useState(null);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [comments, setComments] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
  };

  useEffect(() => {
    if (!content) {
      get(
        'https://jsonplaceholder.typicode.com/posts/' + route.params.id,
        null,
      ).then(res => {
        setContent(res);
        get(
          'https://jsonplaceholder.typicode.com/comments?postId=' +
            route.params.id,
        ).then(commentResp => {
          setFetchedComments(commentResp);
        });
      });
    }
  });

  useEffect(() => {
    setFilteredComments();
  }, [fetchedComments, searchText]);

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

  function renderComments({item, index}) {
    return (
      <View style={{marginVertical: 10}}>
        <Text
          style={[styles.sectionTitle, {fontSize: 18, fontWeight: 'normal'}]}>
          {item.body}
        </Text>
        <Text style={[styles.sectionDescription, {color: '#aaaaaa'}]}>
          By {item.name} - {item.email}
        </Text>
      </View>
    );
  }

  function onChangeText(text) {
    setSearchText(text);
  }

  function setFilteredComments() {
    // filtered by name, email, body
    let text = searchText.toLowerCase();
    if (text.length) {
      let filteredName = fetchedComments.filter(comment => {
        return comment.name.toLowerCase().match(text);
      });
      let filteredEmail = fetchedComments.filter(comment => {
        return comment.email.toLowerCase().match(text);
      });
      let filteredBody = fetchedComments.filter(comment => {
        return comment.body.toLowerCase().match(text);
      });
      let filteredList = [];
      let ids = [];
      filteredName.forEach(res => {
        ids.push(res.id);
        filteredList.push(res);
      });
      filteredEmail.forEach(res => {
        if (!ids.includes(res.id)) {
          ids.push(res.id);
          filteredList.push(res);
        }
      });
      filteredBody.forEach(res => {
        if (!ids.includes(res.id)) {
          ids.push(res.id);
          filteredList.push(res);
        }
      });
      setComments(filteredList);
    } else {
      setComments(fetchedComments);
    }
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
        <View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            {content?.title}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {content?.body}
          </Text>
          <Text
            style={[
              styles.sectionTopic,
              {color: isDarkMode ? '#efefef' : '#aeaeae'},
            ]}>
            Comments:
          </Text>
        </View>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchText}
            autoCorrect={false}
            onChangeText={text => onChangeText(text)}
            defaultValue={searchText}
            placeholder={'Search for comments....'}
            placeholderTextColor={'#aeaeae'}
          />
        </View>
        <FlatList
          data={comments}
          showsVerticalScrollIndicator={false}
          renderItem={renderComments}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  sectionTopic: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#aeaeae',
  },
  searchWrapper: {
    width: '100%',
    height: 45,
    backgroundColor: '#efefef',
    borderRadius: 5,
    marginTop: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  searchText: {
    fontSize: 18,
  },
});

export default Details;
