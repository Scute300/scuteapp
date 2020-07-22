import React, {Component} from 'react';
import {Content, Card, Text, Thumbnail, CardItem, 
Left, Body, Icon, Right, Button} from 'native-base'
import {Image} from 'react-native'
import moment from 'moment'

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

export default class Postbox extends Component {
    constructor(){
        super()
        this.state = {
        }
    }

    render(){
        return(
                <Content
                onScroll={({nativeEvent}) => {
                  if(this.props.load !== null){  
                        if (isCloseToBottom(nativeEvent)) {
                            this.props.load();
                        }
                    }
                }}
                style={{marginTop : 10}}>
                    {this.parsedata(this.props.posts)}
                    {this.parsereplys(this.props.onepost, this.props.replies)}
                </Content>
        )
    }

    parsedata(posts){
        return posts.map((data) => {
                const time = moment(data.created_at).startOf('hour').fromNow(); 
            return(
                <Card>
                    <CardItem>
                    <Left>
                        <Thumbnail source={{uri: data.user.avatar}} />
                        <Body>
                            <Text>{data.user.username}</Text>
                            <Text note>{time}</Text>
                        </Body>
                    </Left>
                    </CardItem>
                    <CardItem>
                        <Text>{data.post}</Text>
                    </CardItem>
                    {this.postimage(data.image)}
                    <CardItem>
                        <Left>
                            <Button 
                            onPress={() =>{
                                let dato = data.id 
                                this.props.navigation.navigate('Onepost', {dato})
                            }}
                            transparent>
                                <Icon 
                                style={{color : '#23d160'}}
                                type={"FontAwesome"}
                                name={"comment"}></Icon>
                                <Text
                                style={{color : '#23d160'}}
                                >{data.replies}</Text>
                            </Button>
                        </Left>
                        <Body>
                            <Button transparent>
                                <Icon 
                                style={{color : '#23d160'}}
                                type={"FontAwesome"}
                                name={"star"}></Icon>
                                <Text
                                style={{color : '#23d160'}}
                                >{data.favorites}</Text>
                            </Button>
                        </Body>
                        <Right>
                            <Button 
                            transparent>
                                <Icon 
                                style={{color : '#23d160'}}
                                type={"FontAwesome"}
                                name={"gift"}></Icon>
                                <Text 
                                style={{color : '#23d160'}}>0</Text>
                            </Button>
                        </Right>
                    </CardItem>
                </Card>

            )
        })
    }

    postimage(image){
        if (image !== null){
            return(
                <CardItem cardBody>
                    <Thumbnail source={{uri: image}} style={{height: this.props.height, width: this.props.width, flex: 1}}/>
                </CardItem>
            )
        }
    }

    parsereplys(onepost, replies){
        if(onepost == true && replies.length !== 0){
                return replies.map((data) => {
                        const time = moment(data.created_at).startOf('hour').fromNow(); 
                    return(
                        <Card>
                            <CardItem>
                            <Left>
                                <Thumbnail source={{uri: data.user.avatar}} />
                                <Body>
                                    <Text>{data.user.username}</Text>
                                    <Text note>{time}</Text>
                                </Body>
                            </Left>
                            </CardItem>
                            <CardItem>
                                <Text>{data.reply}</Text>
                            </CardItem>
                        </Card>
                )
            })

        }
    }

}