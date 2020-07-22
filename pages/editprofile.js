import React, {Component} from 'react';
import {Container, Content, Text, Button,
Textarea, Thumbnail, Icon, Form, Label, Picker, DatePicker, 
Footer,Spinner } from "native-base";
import Navbar from '../Components/navbar'
import {View, Alert, BackHandler,ToastAndroid, AsyncStorage }  from 'react-native';
import funciones from "../funciones"
import {connect} from 'react-redux'
import * as actions from '../src/actions'
import moment from 'moment'
import { Divider } from 'react-native-elements';

class Editprofile extends Component {
    constructor(){
        super()
        this.state = {
            editable: false,
            image: null,
            base64: null,
            selected :'',
            chosenDate: '' ,
            bio: '',
            sendform : false,


        }
    }

    componentDidMount(){
        this.initialcomprobation()
    }


    initialcomprobation = async()=>{
        const mytoken = await AsyncStorage.getItem('scute-user-token')
        if(mytoken !== null){
          this.props.navigation.navigate('AuthLoadingScreen')
        } 
    }


    handleBackButton() {
        ToastAndroid.show('Actualizando tus datos', ToastAndroid.SHORT);
        return true;
    }


    onValueChange = (value: string) => {
        this.setState({
          selected: value
        });
      }
    setDate = (newDate) => {
        const formatdate = moment(newDate).format('YYYY-MM-DD')
        this.setState({ chosenDate: formatdate });
      }

    guardaravatar = async(base64) => {
        this.setState({sendform : true })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const guardar = await funciones.guardaravatar(base64)
        if(guardar == true){
            const reload = await funciones.yo()
            if(reload == true){
                const userdata = await funciones.userdata()
                if(userdata.response == true){
                    this.setState({image : null, base64: null, sendform : false})
                    await this.props.OnUserSession({isonline : true, userdata : userdata.usuario})
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                   
                }
            } else {
                this.setState({sendform : false })
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                Alert.alert('Error del servidor, intentalo más tarde')
            }
        } else {
            this.setState({sendform : false })
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            Alert.alert('Por ahora no se puede guardar')
        }
    }

    editimage = async(quitar) => {
        if(quitar == false){
            const data = await funciones.profilepicturepreview()
                if(data == false){
                    this.setState({image : null, base64 : null})
                } else {
                    this.setState({
                        image : data.image,
                        base64 : data.base64
                    })
                }
        }else {
            this.setState({
                image:null,
                base64:null
            })
        }
    }

    editprofiledata = async() => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({sendform : true})
        const editar = await funciones.guardardatos(this.state.bio, this.state.chosenDate,this.state.selected)
        if(editar == true){
            const reload = await funciones.yo()
            if(reload == true){
                const userdata = await funciones.userdata()
                if(userdata.response == true){
                    await this.props.OnUserSession({isonline : true, userdata : userdata.usuario})
                    this.setState({sendform : false})
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                }
            }
        } else {
            this.setState({sendform : false })
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            Alert.alert('Error interno del servidor')
        }
    }

    render(){
        return(
            <Container>
                <Navbar
                navigation={this.props.navigation}
                />
                <Content style={{marginTop : 20}}>
                    { this.state.image == null
                    ?
                    <View style={{alignItems: 'center', marginBottom:20}}>
                       <Thumbnail
                       large
                       source ={{uri : this.props.userdata.userdata.avatar}}
                       />
                    </View>
                    :
                    <View style={{alignItems: 'center', marginBottom:20}}>
                       <Thumbnail
                       large
                       source ={{uri : this.state.image}}
                       />
                    </View>
                    }
                    {this.state.image == null
                    ?
                    <View style={{alignItems: 'center', marginTop: 0, marginBottom:20}}>
                        <Icon
                        onPress={() => {this.editimage(false)}}
                        type='FontAwesome5'
                        name='edit'
                        style={{color : '#23d160'}}
                        />
                    </View>
                    :
                    <View style={{alignItems: 'center', marginTop: 0, marginBottom:20}}>
                        { this.state.sendform == false
                        ?
                        <Icon
                        onPress={() => {this.editimage(true)}}
                        type='FontAwesome'
                        name='close'
                        style={{color : '#e83d56'}}
                        />
                        :
                        <Icon
                        type='FontAwesome'
                        name='close'
                        style={{color : '#e83d56'}}
                        />
                        }
                        { this.state.sendform == false
                        ?
                        <Icon
                        onPress={() => {this.guardaravatar(this.state.base64)}}
                        type='FontAwesome'
                        name='check-circle'
                        style={{color : '#23d160'}}
                        />
                        :
                        <Icon
                        type='FontAwesome'
                        name='check-circle'
                        style={{color : '#23d160'}}
                        />
                        }
                    </View>
                    }
                    <Form>
                        <Label>Cumpleaños</Label>
                        <DatePicker
                            minimumDate={new Date(1970, 1, 1)}
                            maximumDate={new Date(2006, 12, 31)}
                            locale={"es"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            placeHolderText={this.props.userdata.userdata.cumpleaños}
                            textStyle={{ color: "green" }}
                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                            onDateChange={this.setDate}
                            disabled={false}
                            
                            />
                            <Divider style={{ backgroundColor: '#23d160' }} />
                            <Label>
                                País
                            </Label>
                            <Picker
                            mode="dropdown"
                            style={{ width: '100%' }}
                            editable={this.state.sendform}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}
                            >
                            <Picker.Item label={this.props.userdata.userdata.location} value="key0" />
                            <Picker.Item label="Mexico" value="Mexico" />
                            <Picker.Item label="Colombia" value="Colombia" />
                            <Picker.Item label="Venezuela" value="Venezuela" />
                            <Picker.Item label="Argentina" value="Argentina" />
                            <Picker.Item label="Chile" value="Chile" />
                            <Picker.Item label="Peru" value="Peru" />
                            <Picker.Item label="Ecuador" value="Ecuador" />
                            </Picker>
                            <Divider style={{ backgroundColor: '#23d160' }} />
                            <Label>
                                Describete en 200 Caracteres
                            </Label>
                            <Textarea
                            placeholder={this.props.userdata.userdata.bio}
                            onChangeText={(bio) =>
                            this.setState({bio})}
                            maxLength={200}
                            >{this.props.userdata.userdata.bio}</Textarea>
                            <Divider style={{ backgroundColor: '#23d160' }} />
                    </Form>
                </Content>
                <Footer>
                    { this.state.sendform == false
                    ?
                    <Button
                    onPress={this.editprofiledata}
                    disabled={this.state.sendform} 
                    style={{position : 'absolute', width : '100%', height : '100%'}}
                    full success>
                        <Text>Guardar cambios</Text>
                    </Button>
                    :
                    <Button 
                    style={{position : 'absolute', width : '100%', height : '100%'}}
                    full success> 
                    <Spinner />
                    </Button>
                    }
                </Footer>
                </Container>
                
        )
    }
}
const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps, actions)(Editprofile)