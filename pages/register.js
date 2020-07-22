import React, {Component} from 'react';
import {Container, Text, Header, 
Left, Body, Right, Button, Title, Icon, Content, Form, Item, Input, Spinner} from "native-base";
import axios from 'axios';
import funciones from "../funciones"
import { AsyncStorage, Image, View, Alert }  from 'react-native';

export default class Register extends Component {
  

  constructor (){
    super();
      this.state  ={
        sendform : false,
        email: '',
        name: '',
        username: '',
        password: '',
        confirmpassword: ''
      }
  }

  componentDidMount (){
    this.start()
  }

  
  registro = async() => {
      this.setState({sendform : true})
      const registrar = await funciones.register(this.state.name, 
        this.state.username, this.state.email, this.state.password, 
        this.state.confirmpassword)
      if (registrar == true) {
        this.setState({sendform : false})
        const me = await funciones.yo()
        this.props.navigation.navigate('AuthLoading')
      } else {
          this.setState({sendform : false})
      }
  }
  
  start = async() => {
    this.setState({sendform : true})
    const mytoken = await AsyncStorage.getItem('scute-user-token')
    if(mytoken !== null){
      this.props.navigation.navigate('Home')
    } else {
      this.setState({sendform : false})
    }
  }

  render(){
      return(
        <Container>
            <Header style={{backgroundColor : '#23d160'}}>
                <Left>
                    <Icon
                    onPress={() => {
                      this.props.navigation.navigate('App')
                    }}  
                    disabled={this.state.sendform}
                    name='arrow-back' />
                </Left>
                <Right></Right>
            </Header>
            <Content>
                <View style={{alignItems: 'center', marginTop: 20, marginBottom:20}}>
                    <Image style={{ height: 85, width: 85, flex: 1 }} source={{uri:'https://res.cloudinary.com/scute/image/upload/v1584893480/recursos/scuteicon_j2nu7f.png'}} />
                </View>
                <View style={{alignItems: 'center', marginTop: 0, marginBottom:20}}>
                <Text>Registrate y gana dinero dibujando</Text>
                </View>
                <Form>
                    <Item last>
                        <Input
                        onChangeText={(email) =>
                        this.setState({email})}
                        editable={!this.state.sendform}
                        maxLength={50} 
                        placeholder="Correo Electrónico"/>
                    </Item>
                    <Item last>
                        <Input 
                        onChangeText={(name) =>
                        this.setState({name})}
                        editable={!this.state.sendform}
                        maxLength={10}
                        placeholder="Nombre no mayor a 10 Caracteres"/>
                    </Item>
                    <Item last>
                        <Input
                        onChangeText={(username) =>
                        this.setState({username})}
                        editable={!this.state.sendform} 
                        maxLength={10}
                        placeholder="Username No mayor a 10 caracteres"/>
                    </Item>
                    <Item last>
                        <Input 
                        onChangeText={(password) =>
                        this.setState({password})}
                        editable={!this.state.sendform}
                        maxLength={20}
                        secureTextEntry={true}
                        placeholder="Contraseña de 8 a 20 caracteres" />
                    </Item>
                    <Item last>
                        <Input 
                        onChangeText={(confirmpassword) =>
                        this.setState({confirmpassword})}
                        editable={!this.state.sendform}
                        secureTextEntry={true}
                        maxLength={20}
                        placeholder="Confirmar contraseña" />
                    </Item>
                    { this.state.sendform == false
                    ?
                    <Button 
                    disabled={this.state.sendform}
                    full success onPress={this.registro}>
                        <Text>Registrarse</Text>
                    </Button>
                    :
                    <Button 
                    full success>
                        <Spinner/>
                    </Button>
                    }
                    <Text>¿Ya tienes una cuenta?</Text>
                    <Text
                    onPress={() => {
                      this.props.navigation.navigate('Login')
                    }}  
                    style={{color: '#23d160'}}>¡Accede!</Text>
                </Form>
            </Content>
        </Container>
      )
  }

}