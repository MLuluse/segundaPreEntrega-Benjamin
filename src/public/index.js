const socketClient = io()  //handshake

const table = document.getElementById('productsTable')

//traigo el boton y agrego el evento
document.getElementById('addProduct').addEventListener('click', () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        category: document.getElementById("category").value,
        stock: document.getElementById("stock").value,
        thumbnail: document.getElementById("thumbnail").value,
        status: document.getElementById("status").value
    }
    //ruta que crea el producto
    fetch("/api/products", {
        method: "post",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then (result => result.json())
    .then (result => {
        if (result.status === 'error') throw new Error(result.error)
    })  
    .then (() => fetch('/api/products'))
    .then (result => result.json())
    .then ( result => {
        if ( result.status === 'error')throw new Error(result.error)
        socketClient.emit('productList', result.payload)

        alert(`Nuevo producto agregado`)
         document.getElementById("title").value = ''
         document.getElementById("description").value = ''
         document.getElementById("price").value = ''
         document.getElementById("code").value = ''
         document.getElementById("category").value = ''
         document.getElementById("stock").value = ''
         document.getElementById("thumbnail").value = ''
         document.getElementById("status").value = ''
    })
    .catch(error => {
        console.log (`Error en la subida de producto`)
    } )
})

deleteProduct = (pid) => {
    fetch (`/api/products/${pid}`, {
        method:'delete'
    })
    .then(result => result.json())
    .then (result => {
        if (result.status ==='error') throw new Error(result.error)
        socketClient.emit('productList', result.payload)
        alert(`todo salio bien el products ${pid} se borro`)
    })

}
socketClient.on('updatedProducts', productList => {
    console.log(productList)
    table.innerHTML =
    `<tr>
    <td></td>
    <td>Title</td>
    <td>Description</td>
    <td>Price</td>
    <td>Code</td>
    <td>Category</td>
    <td>Stock</td>
    <td>Thumbnail</td>
    <td>Status</td>
    </tr>`

    for(product of productList){
        let tr = document.createElement('tr')
        tr.innerHTML=
                     `<td>${product.title}</td>
                     <td>${product.description}</td>
                     <td>${product.price}</td>
                     <td>${product.code}</td>
                     <td>${product.category}</td>
                     <td>${product.stock}</td>
                     <td>${product.thumbnail}</td>
                     <td>${product.status}</td>
                     <td>
                         <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                             ❌
                         </button>
                     </td> `;

        table.getElementsByTagName('tbody')[0].appendChild(tr);
    }
    
})