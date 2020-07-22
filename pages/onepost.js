import React, {Component} from 'react';
import {Container, Text, Header, 
Left, Body, Right, Button, 
Content, Footer, Icon, FooterTab, 
Spinner, Thumbnail, Input, Textarea, Card} from "native-base";
import { View , TouchableOpacity,ScrollView, Image, Dimensions}  from 'react-native';
import Navbar from '../Components/navbar'
import Postbox from '../Components/postbox'
import funciones from "../funciones"
import {connect} from 'react-redux'



class Onepost extends Component{
    constructor(){
        super()
        this.state = {
            post: null,
            imgWidth: 0,
            imgHeight: 0,
            comentario: '',
            replies: [],
            active : true,
            loading: true,
            page: 0,
            sendform: false
        }
    }

    componentDidMount(){
        this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                comentario: '',
                replies: [],
                active : true,
                loading: true,
                page: 0,
                sendform: false})
            this.getpost();
          }
        );
            this.getpost()
    }

    getpost = async()=> {
        let param = this.props.navigation.state.params.dato
        await this.setState({post: null})
        const post = await funciones.getonepost(param)
            if(post !== false){
                if(post.post.image !== null){
                    await this.imagesize(post.post.image)
                }
                let arr =[]
                arr.push(post.post)
                await this.setState({post : arr})
                await this.getreplys()
            }
    }

    imagesize = async(url)=>{
        await Image.getSize(url, (width, height) => {
          // calculate image width and height 
          const screenWidth = Dimensions.get('window').width
          const scaleFactor = width / screenWidth
          const imageHeight = height / scaleFactor
          this.setState({imgWidth: screenWidth, imgHeight: imageHeight})
        },(error)=>{console.log(error)})
    }

    comentar = async(id, comentario)=> {
        this.setState({sendform : true})
        const reply = await funciones.comentar(id, comentario)
        if(reply !== false){
            this.setState({replies : null})
            await this.getreplys()
        } else {
            this.setState({sendform:false})
        }
    }

    getreplys = async() =>{
        if(this.state.active == true){
            await this.setState({active: false})    
            await this.setState(prevState => ({ page: prevState.page + 1 }));
            let id = this.state.post[0]
            const replies = await funciones.getreplies(id.id, this.state.page)
            console.log(replies)
            if (replies !== false){
                let arr = replies.replies
                if(Array.isArray(arr) && arr.length){
                    let push = this.state.replies.concat(arr)
                    await this.setState({replies : push, active : true})
                } else {
                    await (this.setState({active: false}))
                }
            }
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
                {this.post(this.state.post)}
                {this.props.userdata.isonline == true
                ?
                <Footer
                style={{backgroundColor: 'transparent'}}>
                    <Thumbnail
                    square
                    source={{uri:this.props.userdata.userdata.avatar}}
                    />
                    <Textarea
                    onChangeText={(comentario) =>
                    this.setState({comentario})} 
                    rowSpan={10}  
                    style={{width : '66%', height:'100%'}}
                    placeholder={'Escribe una respuesta'}
                    >{this.state.comentario}</Textarea>
                    <Button
                    onPress={() =>{
                        let id = this.state.post[0]
                        this.comentar(id.id, this.state.comentario)
                    }}  
                    success large>
                        <Icon 
                        style={{ fontSize: 45, color: 'white'}}
                        type={'MaterialCommunityIcons'}
                        name={'message-draw'}
                        />
                    </Button>
                </Footer>
                :
                <Footer>
                    
                </Footer>
                }
            </Container>
            
        )
    }

    post(post){
        if(post == null){
            return(
                <Content>
                    <Spinner></Spinner>
                </Content>
            )
        } else {
            return (
                <Postbox
                posts={post}
                navigation={this.props.navigation}
                height={this.state.imgHeight}
                width={this.state.imgWidth}
                load={this.getreplys.bind(this)}
                onepost={true}
                replies={this.state.replies}
                />
            )
        }
    }

}
const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps)(Onepost)