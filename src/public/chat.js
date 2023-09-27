Swal.fire({
    title:'Authentication',
    input: 'text',
    text:'Set a username for the chat',
    inputValidator: value =>{
        return !value.trim() && 'Please, write a valid username' //esto te pide solo en ok
    }, 
    allowOutsideClick: false // esto hace que no funcione si haces click afuera del sweet alert
}).then(result =>{  // esto va a dar una promesa por eso agarro el resultado con then  y lo asigno a una variable usuario
    let user = result.value  
    document.getElementById('username').innerHTML = user
    let socketClient = io ()  // aca el handshake

    let chatbox = document.getElementById('chatbox')
    chatbox.addEventListener('keyup', e =>{
        if(e.key === 'Enter'){
            if(chatbox.value.trim().length > 0) {  // con el trim elimino los espacios en blanco
                socketClient.emit ('message', { 
                    user,  // como el user el value que se va a emitir es user, puede solo ponerse user
                    message: chatbox.value 
                })
                chatbox.value = ""



            }
        }
    })

    socketClient.on('logs', data => {
        const divlogs = document.getElementById('log')
        let messages = ''
        data.reverse().forEach(message => {
            messages += `<p><i>${message.user} </i>: ${message.message} </p>`
        })
        divlogs.innerHTML = messages
    })
})