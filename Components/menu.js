import React, {Component} from 'react';
import {Thumbnail, Content} from "native-base"
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Alert
} from 'react-native'
import { Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import {DrawerItems} from "react-navigation-drawer"
import funciones from '../funciones'
import {connect} from 'react-redux'

class CustomDrawerContentComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      usuario : {portada : 'https://res.cloudinary.com/scute/image/upload/v1593834445/portada-min_arjal4.png',
      avatar : 'https://res.cloudinary.com/scute/image/upload/v1566358443/recursos/default_hduxaa.png',
    username:'No loggeado', email: 'unmail'}
    }
  }
  componentDidMount(){
  }
  


  render() {
    const ripple = TouchableNativeFeedback.Ripple('#adacac', false);
    return (
      <View style={{ flex: 1 }}>

        <ScrollView >
          <ImageBackground style={{
            flex: 1,
            height : '100%',
            width : '100%',
            resizeMode: "cover",
            justifyContent: "center"}} source={{uri : this.props.userdata.userdata.portada}}>
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
          >
            <View style={styles.containHeader}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Thumbnail large source={{uri: this.props.userdata.userdata.avatar}} />
                  <Text style={{ color: '#f9f9f9', marginTop: '3%', fontFamily: 'sans-serif-condensed' }}>{`Hola ${this.props.userdata.userdata.username}`}</Text>
                  <Text style={{ color: '#f9f9f9', fontFamily: 'sans-serif-condensed' }}>{`${this.props.userdata.userdata.email}`}</Text>
                </View>
            </View>
          </SafeAreaView>
            </ImageBackground>
          <DrawerItems
          {...this.props} />
        </ScrollView>

      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containHeader: {
    paddingTop: '4%',
    paddingBottom: '4%'
  },
  containDrawerOption: {
    paddingLeft: '6%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '1%',
    paddingBottom: '5%',
    backgroundColor: '#e6e6e6',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50
  },
  actionText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
    marginRight: '3%',
    marginLeft: '3%',
  },
  closeBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 17,
  },
  closeText: {
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
    marginRight: '3%',
    marginLeft: '3%',
  }
}); 
const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps)(CustomDrawerContentComponent)