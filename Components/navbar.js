import React, {Component} from 'react';
import {Container, Text, Header, 
Left, Body, Right, Button, Title, Thumbnail, Icon } from "native-base";
import { AsyncStorage }  from 'react-native';
import funciones from '../funciones';
import {connect} from 'react-redux'
import * as actions from '../src/actions'

class Navbar extends Component {

    constructor (){
      super();
        this.state  ={
        }
    }
  

    logout = async() =>{
      await this.props.OnUserSession({isonline : false, userdata :  {portada : 
        'https://res.cloudinary.com/scute/image/upload/v1593834445/portada-min_arjal4.png',
        username: 'invitado', email : 'Bienvenido', avatar: 'https://res.cloudinary.com/scute/image/upload/v1566358443/recursos/default_hduxaa.png'}})
      await AsyncStorage.clear()
      this.props.navigation.navigate('AuthLoading')
    }

    //Navegar a login
    login = async() => {
        this.props.navigation.navigate('Login')
    }
  
    render(){
        return(
          <Container style ={{backgroundColor:'red', flex: 0.1}}>
              { this.props.userdata.isonline == false
              ?
            <Header style={{backgroundColor : '#23d160'}}>
                <Left>
                  <Title
                  onPress={() => {
                    this.props.navigation.navigate('Login')
                  }}>
                        Login
                    </Title>
                </Left>
                <Body>
                </Body>
                <Right>
                    <Thumbnail square small source={{uri: 
                    'https://res.cloudinary.com/scute/image/upload/v1584893480/recursos/scuteicon_j2nu7f.png'}} />
                </Right>
            </Header>
              :
            <Header style={{backgroundColor : '#23d160'}}>
                <Left>
                  <Icon
                  style={{color : 'white'}}
                  onPress={() => {
                    this.props.navigation.toggleDrawer()
                  }} 
                  name='menu' />
                </Left>
                <Body>
                </Body>
                <Right>
                  <Title onPress={this.logout}>
                    Logout
                  </Title>
                </Right>
            </Header>
              }
          </Container>
        )
    }
  
  }
  export default connect( null, actions)(Navbar)

