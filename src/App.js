import React, {Component} from 'react';
import {Icon} from 'native-base'
import {createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import io from "socket.io-client";

import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducers from './reducers'

import Home from "../pages/home"
import Login from "../pages/login"
import Register from "../pages/register"
import editprofile from "../pages/editprofile"
import CustomDrawerContentComponent from '../Components/menu'
import AuthLoadingScreen from '../pages/AuthLoadingScreen'
import Newpost from '../pages/newpost'
import Onepost from '../pages/onepost'
import Inventario from '../pages/inventario'
//rutas

const DrawerStack = createDrawerNavigator({
  Galeria: {
    screen: Home,
    navigationOptions: {
      drawerLockMode : 'locked-closed',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
        type='Entypo'
        name='camera'
        style={{fontSize:20, color : tintColor}}
        />)
      } 
  },
  Modificar : {
    screen: editprofile,
    navigationOptions: {
      drawerLockMode: 'locked-closed',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
        type='FontAwesome5'
        name='user-edit'
        style={{fontSize:20, color : tintColor}}
        />),
    }
  },
  Inventario :{
    screen : Inventario,
    navigationOptions: {
      drawerLockMode: 'locked-closed',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
        type='FontAwesome5'
        name='briefcase'
        style={{fontSize:20, color : tintColor}}
        />),
    }
  },
  Newpost : {
    screen : Newpost,
    navigationOptions: {
        drawerLabel : () =>  null
    }
  },
  Onepost: {
    screen: Onepost,
    navigationOptions: {
        drawerLabel : () =>  null
    }
  }
},
{
  drawerPosition: 'right',
  contentOptions : {
    activeTintColor:'#ffffff',
    inactiveTintColor : '#1f1f1f',
    activeBackgroundColor : '#24d060', 
    inactiveBackgroundColor: '#ffffff',
    headerMode: 'none'
  },
  contentComponent:
    CustomDrawerContentComponent 
})


const Loginstack = createStackNavigator ({
  Login : {
    screen : Login
  },
  Register: {
    screen : Register
  },
},{headerMode: 'none'})


//Auth loading



//appcontainer
const Aplicacion = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: DrawerStack,
      Login: Loginstack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
); export default class Myapp extends React.Component {
  constructor(props){
    super(props)
    this.socket = io('https://scutebackend.herokuapp.com')
  }
  render() {
    return (
      <Provider store={createStore(reducers)}>
        <Aplicacion/>
      </Provider>
    );
  }
}
