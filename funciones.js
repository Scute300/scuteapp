import React, {Component} from 'react';
import axios from 'axios'
import { Alert }  from 'react-native';
import { AsyncStorage, Image, View, ToastAndroid }  from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

//funciones de login y registro
const Toastmessage = (message) =>{
        ToastAndroid.show(message, ToastAndroid.SHORT);
        return true;
}
const register = async(name, username, email, password, confirmpassword) => {
    let data = null
    if(password == confirmpassword){
            await axios.post('https://scutebackend.herokuapp.com/signup', {
                name: name,
                username: username,
                email: email,
                password: password
            }) .then(response => {
                data = response.data.data.token
            }) .catch(error => {
                Alert.alert(error.response.data.message)
            })
        if(data !== null){
            await AsyncStorage.setItem('scute-user-token', data)
            return true
        } else {
            return false
        }
    } else {
        Alert.alert('Las contraseñas deben ser iguales')
        return false
    }
        
}

const login = async(email, password) => {
    let info = null
    await axios.post('https://scutebackend.herokuapp.com/login', {
        email : email,
        password: password
    }).then(response  => {
        info = response.data.data.token
    }).catch(error => {
        Alert.alert(error.response.data.message)
    })

    if (info !== null ){
        await AsyncStorage.setItem('scute-user-token', info)
        return true 
    } else {
        return false 
    }
}


const yo = async() => {
    let data = null
    const token = await AsyncStorage.getItem('scute-user-token')
    await axios.get('https://scutebackend.herokuapp.com/account/me', 
        {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
        .then(response  => {
            data = JSON.stringify(response.data.data)
        }).catch(error => {
            Alert.alert(error.response.data.message)
        })
        const comprobation = await AsyncStorage.getItem('scute-personal-data')
        if(comprobation !== null){
            await AsyncStorage.removeItem('scute-personal-data')
        }
        if(data !== null){
            await AsyncStorage.setItem('scute-personal-data',data)
            return true
        }else {
            return false
        }
}

//FUnciones de home y userbar
const userdata = async() => {
    const mydata = await AsyncStorage.getItem('scute-personal-data')
    if(mydata == null){
        return {response : false, usuario:null}
    } else {
        const userdata = await JSON.parse(mydata)
        return {response : true, usuario:userdata}
    }
}

const token = async() => {
    const scutetoken = await AsyncStorage.getItem('scute-user-token')
    if(scutetoken == null){
        return false
    } else{
        return true
    }
}

//funciones de edición de usuario

const profilepicturepreview = async()=> {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if(status !== "granted"){
        Alert.alert('¡Necesitas dar permisos para acceder a esta función!')
        return false
    } else {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true
        })
        if(result.cancelled !== true){
            let base64 = `data:image/jpg;base64,${result.base64}`
            return {image : result.uri, base64: base64}
        } else {
            return false    
        }
    }

}

const guardaravatar = async(base64) => {
    let boolean = null
    const token = await AsyncStorage.getItem('scute-user-token')
    await axios.put('https://scutebackend.herokuapp.com/account/updateProfilePic', {
        avatar : base64
    }, {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
    .then(response => {
        boolean = true
    })
    .catch(error => {
        boolean = false
    })

    if(boolean == true){
        return true
    } else {
        return false
    }

}

const guardardatos = async(bio, edad, location) => {
    const token = await AsyncStorage.getItem('scute-user-token')
    let boolean = false 
    await axios.put('https://scutebackend.herokuapp.com/account/update_profile',{
        bio : bio,
        cumpleaños: edad,
        location: location
    },  {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
    .then(response => {
        boolean = true
    }).catch(error => {
        boolean = false
    })

    return boolean
}

//Funciones de posteo
const newpost = async(post, base64) =>{
    let boolean = false
    const token = await AsyncStorage.getItem('scute-user-token')
    await axios.post('https://scutebackend.herokuapp.com/post',{
        post: post,
        image: base64
    },  {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
    .then(response =>{
        boolean = true
    }).catch(error => {
        boolean = false
    })
    return boolean
}

const getallposts = async(page) =>{
    let boolean = null
    let posts = []
    await axios.get('https://scutebackend.herokuapp.com/timeline/'+page)
    .then(response => {
        boolean = true
        posts = response.data.data.data
    }).catch(error =>{
        boolean = false
    })
    if(boolean == false || boolean == null ){
        return {response : false}
    } else {
        return {response : true, posts: posts}
    }

}

const getonepost = async(id) =>{
    let boolean = null
    let post = []
    await axios.get('https://scutebackend.herokuapp.com/posts/'+id)
    .then(response => {
        boolean = true
        post = response.data.data
    }).catch(error =>{
        boolean = false
    })
    
    if(boolean == true){
        return {response : true, post: post}
    }else {
        return false
    }
}

const getreplies = async(id, page )=>{
    let boolean = null
    let replies = []
    await axios.get('https://scutebackend.herokuapp.com/postreplies/'+id, 
    {params : {foo: page}})
    .then(response => {
        replies = response.data.data.data
        boolean = true
    }).catch(error => {
        boolean = false
    })

    if(boolean == true){
        return {response:true, replies :replies}
    } else{
        return false
    }
}

const comentar = async(id, comentario)=> {
    const token = await AsyncStorage.getItem('scute-user-token')
    let boolean = false
    await axios.post('https://scutebackend.herokuapp.com/posts/reply/'+id,{
        reply : comentario
    },  {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
    .then(response => {
        boolean = {data : response.data}
    }).catch(error => {
        ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        boolean = false
    })

    return boolean

}

const obtenermonedero = async() =>{
    const token = await AsyncStorage.getItem('scute-user-token')
    await axios.get('https://scutebackend.herokuapp.com/tienda/monedero'
    ,  {headers: {Authorization: `Bearer ${token}`}, timeout:60000})
    .then(response => {
        console.log('hola mundo')
    }).catch(error =>{
        console.log(error)
    })
}

//funciones de monedero
export default {register,login,userdata,yo,
    token,profilepicturepreview,guardaravatar,
    guardardatos, Toastmessage, newpost, getallposts,
    getonepost, comentar, getreplies, obtenermonedero}