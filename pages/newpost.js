import React, {Component} from 'react';
import {TouchableOpacity, BackHandler,
ToastAndroid, AsyncStorage} from 'react-native'
import {Container, Text, Header, 
Left, Body, Right, Button, Content, 
Icon, Card, CardItem, Thumbnail, 
Textarea, Spinner,} from "native-base";
import funciones from "../funciones"
import {connect} from 'react-redux'


class Newpost extends Component{
    constructor(){
        super()
        this.state = {
            image: null,
            base64: null,
            texto: '',
            sendform: false
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
        ToastAndroid.show('Posteando...', ToastAndroid.SHORT);
        return true;
    }
    prewiew = async() => {
        const image = await funciones.profilepicturepreview()
        if(image !== false){
            this.setState({image : image.image, base64 : image.base64})
        } else {
            this.setState({image : null, base64: null})
        }
    }
    post = async() =>{
        this.setState({sendform : true})
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const post = await funciones.newpost(this.state.texto, this.state.base64)
        if(post == true){
            this.setState({image: null,base64:null, sendform : false, texto: '' })
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            this.props.navigation.navigate('App')
        } else {
            this.setState({image: null,base64:null, sendform : false, texto: '' })
            funciones.Toastmessage('Error temporal del servidor.')
        }
    }
    render(){
        return(
            <Container>
                <Header style={{backgroundColor : '#23d160'}}>
                    <Left>
                        <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
                            <Icon
                            style={{color: 'white'}}
                            type={"AntDesign"}
                            name={"arrowleft"}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body/>
                    <Right/>
                </Header>
                    <Content>
                    <Card>
                        <CardItem>
                                <Thumbnail
                                source={{uri : this.props.userdata.userdata.avatar }}
                                />
                                <Textarea 
                                onChangeText={(texto) =>
                                this.setState({texto})}
                                editable={this.sendform}
                                placeholder={'Escribe algo rapido...'}
                                maxLength={300}
                                style={{width : '75%', borderColor: 'gray'}}>
                                    {this.state.texto}
                                </Textarea>
                                <TouchableOpacity onPress={this.prewiew}>
                                    <Icon
                                    style={{color:'#23d160', fontSize: 30}}
                                    type={"Entypo"}
                                    name={"images"}/>
                                </TouchableOpacity>
                        </CardItem>
                        {this.imagepreview(this.state.image, this.state.base64)}
                            {this.state.sendform == false
                            ?
                            <Button 
                            onPress={this.post}
                            block success>
                                <Text>
                                    Publicar
                                </Text>
                            </Button>
                            :
                            <Button block success>
                                <Spinner/>
                            </Button>
                            }
                    </Card>
                </Content>
            </Container>
        )
    }

    imagepreview(image,base64, send){
        if(image !== null && base64 !== null ){
            return(
                <CardItem>
                    <Thumbnail small
                    source={{uri : image}}/><Icon
                    onPress={() => {this.setState({image:null, base64: null})}}
                    type='FontAwesome'
                    name='close'
                    style={{color : '#e83d56', fontSize: 16, marginBottom:20}}
                    />
                </CardItem>
            )
        }
    }
}

const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps)(Newpost)