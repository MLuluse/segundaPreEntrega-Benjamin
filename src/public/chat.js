let userElement = document.getElementById('username');
let userName = userElement.textContent.trim();
 
    let socketClient = io ()  // aca el handshake

    let chatbox = document.getElementById('chatbox')
    chatbox.addEventListener('keyup', e =>{
        if(e.key === 'Enter'){
            if(chatbox.value.trim().length > 0) {  // con el trim elimino los espacios en blanco
                socketClient.emit ('message', { 
                    user: userName,
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