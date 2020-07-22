
import React, {Component} from 'react';
import funciones from '../funciones'
import {connect} from 'react-redux'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage,
  Image,
  Alert
} from 'react-native'
import {Spinner} from 'native-base'
import * as actions from '../src/actions'


class AuthLoadingScreen extends Component{
    constructor(){
      super();
      this.state = {
        version : false,
        conection: false,
      }
    }
    componentDidMount(){
      this._loadData()
    }
  
  
    render(){
      return(
        <View style={{flex: 2, 
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10}}>
        <Spinner color={'green'}/>
        </View>
      )
    }
    _loadData = async() =>{
      try{
        const value = await AsyncStorage.getItem('scute-user-token')
        if (value == null){
          this.props.navigation.navigate('App')
        } else {
          const data = await funciones.yo()
          if(data == true){
              const userdata = await funciones.userdata()
                if(userdata.response == true){
                    await this.props.OnUserSession({isonline : true, userdata : userdata.usuario})
                    this.props.navigation.navigate('App')
                }
          } else {
            await AsyncStorage.clear()
            Alert.alert('No puedes ingresar en este momento')
          }
        }
    } catch(error){
      console.log(error)
    }
    }
    
  }
const mapStateToProps = state => {
    return {userdata : state.userdata}
  }
  
  export default connect(mapStateToProps , actions)(AuthLoadingScreen)