import React, {Component} from 'react';
import {Thumbnail, Content, Container, Card, CardItem, Body, Left, Right, Button, Text} from "native-base"
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableNativeFeedback,
  StyleSheet,
  Alert
} from 'react-native'
import funciones from '../funciones'
import {connect} from 'react-redux'
import Navbar from '../Components/navbar'

class Inventario extends Component{
    constructor(){
        super()
        this.state = {

        }
    }

    obtenermonedero = async()=>{
        await funciones.obtenermonedero()
    }

    render(){
        return(
            <Container>
                <Navbar
                userdata={this.props.userdata}
                navigation={this.props.navigation}
                />
                <Content>
                    {this.monedero(this.props.userdata.userdata.monedero)}
                </Content>
            </Container>
        )
    }

    monedero(monedero){
        if(monedero == null){
            return(
                <Card style={{alignItems : 'center', marginTop:15}} transparent>
                    <Thumbnail
                    source={{uri : 'https://res.cloudinary.com/scute/image/upload/v1595564381/logros/monedasandi_msautl_ddwizd.png'}}
                    />
                    <CardItem>
                        <Text>¡Vaya! Parece que aún no tienes tu monedero</Text>
                    </CardItem>
                    <CardItem>
                        <Button 
                        onPress={this.obtenermonedero}
                        rounded success>
                            <Text>Conseguir monedero</Text>
                        </Button>
                    </CardItem>
                </Card>
            )
        }
    }
}
const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps)(Inventario)