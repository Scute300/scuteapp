import React, {Component} from 'react';
import {Container, Text, Header, 
Left, Body, Right, Button, Content, Footer, Icon, FooterTab, Spinner} from "native-base";
import { AsyncStorage, View , TouchableOpacity,ScrollView }  from 'react-native';
import Navbar from '../Components/navbar'
import Postbox from '../Components/postbox'
import funciones from "../funciones"
import {connect} from 'react-redux'

class Home extends Component {


  constructor (){
    super();
      this.state  ={
        page: 0,
        posts : [],
        loadmore: false,
        active : true
      }
  }
async UNSAFE_componentWillMount(){
  await this.props.navigation.addListener(
  'willFocus',
  () => {
    this.setState({page: 0, posts: []})
    this.getposts();
  }
);
  await this.getposts()
}
getposts = async() =>{
  if(this.state.active == true){
    this.setState({loadmore:true, active: false})
    await this.setState(prevState => ({ page: prevState.page + 1 }));
      const post = await funciones.getallposts(this.state.page)
      if(post.response == true && post.posts !== []){
        let arr = post.posts 
        if(Array.isArray(arr) && arr.length){
          let push = this.state.posts.concat(arr)
          this.setState({posts : push, loadmore:false, active: true})
        } else {
          this.setState({loadmore : false, active: true})
        }
      }
    }
}

  render(){
      return(
        <Container style={{flex : 1}}>
          <Navbar
          userdata={this.props.userdata}
          navigation={this.props.navigation}/>
            {this.ischargeposts(this.state.posts)}
          <Footer style={{backgroundColor: '#23d160'}}>
            {this.islogged(this.props.userdata.isonline)}
          </Footer>
        </Container>
      )
  }
  ischargeposts(posts){
    if(posts.length !== 0){
      return <Postbox 
              posts={posts}
              navigation={this.props.navigation}
              load={this.getposts.bind(this)}
              height={200}
              width={null}
              onepost={false}
              replies={null}
              />
    } else {
      return <Content/>
    }
  }
  islogged (isonline){
    if(isonline == true){
      return(
        <FooterTab>
          { this.state.loadmore == false
          ?
          <Button
          onPress={() => {this.props.navigation.navigate('Newpost')}} 
          style={{backgroundColor : "#23d160"}}>
            <Icon 
            style={{ fontSize: 45, color: 'white'}}
            type={'MaterialCommunityIcons'}
            name={'message-draw'}
            />
          </Button>
          :
          <Button
          style={{backgroundColor : "#23d160"}}>
            <Spinner color={'green'}/>
          </Button>
          }
        </FooterTab>
        )
    } else {
      return (
        <FooterTab style={{backgroundColor : "#23d160"}}>
          { this.state.loadmore == false
          ?
          <Button
          style={{backgroundColor : "transparent"}}>
          </Button>
          :
          <Button
          style={{backgroundColor : "#23d160"}}>
            <Spinner color={'green'}/>
          </Button>
          }
        </FooterTab>
      )
    }
  }
}

const mapStateToProps = state => {
  return {userdata : state.userdata}
}

export default connect(mapStateToProps)(Home)