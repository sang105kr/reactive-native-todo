import React, { useCallback, useState, useEffect } from 'react';
import { StatusBar, Dimensions, Alert } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0px 20px; /* y축 x축 */
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

const AllItemDelBtn = ({ width, onPress, title }) => {
  return (
    <Pressable
      style={{
        backgroundColor: '#666',
        width: width - 40,
        margin: 5,
      }}
      onPress={onPress}
    >
      <Text style={{ textAlign: 'center', padding: 5, color: '#fff' }}>
        {title}
      </Text>
    </Pressable>
  );
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const width = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');

  const [tasks, setTasks] = useState({});
  // {
  //   1: { id: '1', text: 'Hanbit', completed: false },
  //   2: { id: '2', text: 'React Native', completed: true },
  //   3: { id: '3', text: 'React Native Sample', completed: false },
  //   4: { id: '4', text: 'Edit TODO ITEM', completed: false },
  // }
  const _saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  const _loadTasks = async () => {
    try {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      setTasks(JSON.parse(loadedTasks) || {});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await _loadTasks();
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const _addTask = () => {
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };

    setNewTask('');
    _saveTasks({ ...tasks, ...newTaskObject });
  };

  const _deleteTask = id => {
    const currentTasks = { ...tasks }; //Object.assign({},tasks);

    Alert.alert('', '삭제하시겠습니까?', [
      {
        text: '아니오',
        onPress() {
          console.log('아니오');
        },
      },
      {
        text: '예',
        onPress() {
          console.log('예');
          delete currentTasks[id];
          _saveTasks(currentTasks);
        },
      },
    ]);
  };

  const _toggleTask = id => {
    const currentTasks = { ...tasks };
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    _saveTasks(currentTasks);
  };

  const _updateTask = item => {
    const currentTasks = { ...tasks };
    currentTasks[item.id] = item;
    _saveTasks(currentTasks);
  };

  const _handleTextChange = text => {
    setNewTask(text);
    console.log(`변경된문자열:${newTask}`);
  };

  const _onBlur = () => {
    setNewTask('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          value={newTask}
          placeholder="+ Add a Task"
          onChangeText={_handleTextChange} //수정시
          onSubmitEditing={_addTask} //완료버튼
          onBlur={_onBlur} //포커스 잃었을때
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              />
            ))}
        </List>
      </Container>
    </ThemeProvider>
  );
};

export default App;
