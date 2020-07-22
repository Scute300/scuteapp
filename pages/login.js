import React, {Component} from 'react';
import {Container, Text, Header, 
Left, Right, Button, Icon, Content, Form, Item, Input, Spinner} from "native-base";
import { AsyncStorage, Image, View, Alert }  from 'react-native';
import funciones from '../funciones'

export default class Login extends Component {

  constructor (){
    super();
      this.state  ={
        sendform : false,
        email: '',
        password : ''
      }
  }

  componentDidMount (){
    this.start()
  }

  start = async() => {
    const mytoken = await AsyncStorage.getItem('scute-user-token')
    if(mytoken !== null){
      this.props.navigation.navigate('Home')
    } else {
      this.setState({sendform : true})
    }
  }
  register = () => {

    this.props.navigation.navigate('Register')
  }

  login = async() => {
    this.setState({sendform : false})
    const login = await funciones.login(this.state.email, this.state.password)
    console.log(login)
    if(login == true){
      const me = await funciones.yo()
       if(me == true){
         const userdata = await funciones.userdata()
         if (userdata.response == true){
          this.props.navigation.navigate('AuthLoading')       
         }
       } else{
        this.setState({sendform : false, password : ''})
         await AsyncStorage.clear()
         Alert.alert('No se puede acceder en este momento')
       }
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
                    disabled={!this.state.sendform}
                    name='arrow-back' />
                </Left>
                <Right></Right>
            </Header>
            <Content>
                <View style={{alignItems: 'center', marginTop: 20, marginBottom:20}}>
                    <Image style={{ height: 150, width: 150, flex: 1 }} source={{uri:'https://res.cloudinary.com/scute/image/upload/v1584893480/recursos/scuteicon_j2nu7f.png'}} />
                </View>
                <View style={{alignItems: 'center', marginTop: 0, marginBottom:20}}>
                <Text>Accede y gana dinero dibujando</Text>
                </View>
                <Form>
                    <Item last>
                        <Input 
                        onChangeText={(email) =>
                        this.setState({email})}
                        editable={this.state.sendform}
                        maxLength={50} 
                        placeholder="Correo Electrónico"/>
                    </Item>
                    <Item last>
                        <Input 
                        onChangeText={(password) =>
                        this.setState({password})}
                        editable={this.state.sendform} 
                        maxLength={20} 
                        secureTextEntry={true}
                        placeholder="Contraseña" />
                    </Item>
                    { this.state.sendform == true
                    ?
                    <Button
                    disabled={!this.state.sendform}
                    full success onPress={this.login} 
                    >
                      <Text>Acceder</Text>
                    </Button>
                    :
                    <Button full success>
                      <Spinner/>
                    </Button>
                    }
                    <Text>¿Aún no tienes una cuenta?</Text>
                    <Text
                    onPress={this.register} 
                    disabled={!this.state.sendform}
                    style={{color: '#23d160'}}>¡Registrate!</Text>
                </Form>
            </Content>
        </Container>
      )
  }

}
