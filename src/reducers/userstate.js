export default (state = {isonline: false, userdata : {portada : 
'https://res.cloudinary.com/scute/image/upload/v1593834445/portada-min_arjal4.png',
username: 'invitado', email : 'Bienvenido', avatar: 'https://res.cloudinary.com/scute/image/upload/v1566358443/recursos/default_hduxaa.png'}}, action) => {
    switch(action.type){
        case 'OnUserSession':
            return action.payload
        default :
        return state
    }
}