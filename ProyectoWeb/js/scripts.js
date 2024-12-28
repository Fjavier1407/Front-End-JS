let productos = [];


fetch(".../.../db.json/productos.json"")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);  
    });


const contenedorProductos = document.querySelector("#contenedor-productos");
const numerito = document.querySelector("#numerito");
const contenedorCarritoVacio = document.querySelector(".carrito-vacio");
const contenedorCarritoProductos = document.querySelector(".productos-carrito");
const contenedorCarritoAcciones = document.querySelector(".carrito-acciones");
const total = document.querySelector("#total");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const botonComprar = document.querySelector(".carrito-acciones-comprar");


let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];


function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto", "col-12", "col-md", "col-lg-3");
        div.innerHTML = `
            <div class="card bg-light shadow-sm border-0 px-2 py-3 mb-4">
                <div class="text-center">
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${producto.titulo}</h5>
                    <p>$${producto.precio}</p>
                    <button class="btn btn-primary producto-agregar" id="${producto.id}">Añadir al carrito</button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });
    actualizarBotonesAgregar();
}


function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    actualizarNumerito();  
    cargarProductosCarrito();

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' },
    }).showToast();
}


function actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.style.display = "none";
        contenedorCarritoProductos.style.display = "block";
        contenedorCarritoAcciones.style.display = "flex";

        contenedorCarritoProductos.innerHTML = "";  
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminado" id="${producto.id}">Eliminar</button>
            `;
            contenedorCarritoProductos.appendChild(div);
        });

        actualizarBotonesEliminar(); 
        actualizarTotal(); 
    } else {
        contenedorCarritoVacio.style.display = "block";
        contenedorCarritoProductos.style.display = "none";
        contenedorCarritoAcciones.style.display = "none";
    }
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toFixed(2)}`;
}


function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminado");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idBoton = e.currentTarget.id;
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            
            if (index !== -1) {
                
                if (productosEnCarrito[index].cantidad > 1) {
                    productosEnCarrito[index].cantidad--;
                } else {
                    
                    productosEnCarrito.splice(index, 1);
                }

                
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                
                
                actualizarNumerito();
                cargarProductosCarrito();
            }
        });
    });
}


botonVaciar.addEventListener("click", () => {
    productosEnCarrito = [];  
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));  
    actualizarNumerito();  
    cargarProductosCarrito();  
});


botonComprar.addEventListener("click", () => {
    productosEnCarrito = [];  
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));  
    actualizarNumerito();  
    cargarProductosCarrito();  
    alert("¡Compra realizada con éxito!");  
});


cargarProductosCarrito();


function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            agregarAlCarrito(e);
        });
    });
}
