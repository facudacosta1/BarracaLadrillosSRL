import { Producto } from './Product.js';
import { Carrito } from './cart.js';

let productos = [];
cargarProductosDesdeJson();
let carrito = new Carrito();

/*function cargarProductos() {
    const datosLocalStorage = localStorage.getItem('productos');
    if (datosLocalStorage) {
        return JSON.parse(datosLocalStorage).map(
            producto => new Producto(producto.id, producto.nombre, producto.descripcion, producto.cantidadEnStock, producto.costo)
        );
    }else{
        return [];
    }
}*/

function cargarProductosDesdeJson() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const productosJson = data.articulos_de_barracas;
            productosJson.forEach(productoJson => {
                let { identificador, nombre, descripcion, cantidad_en_stock, costo } = productoJson;
                let costoNumerico = parseFloat(costo.replace('$', '').trim()); // por qu e esta puesto con pesos adelante en el json
                let producto = new Producto(identificador, nombre, descripcion, cantidad_en_stock, 3);
                productos.push(producto);
            });
            localStorage.setItem('productos', JSON.stringify(productos));
            mostrarProductos();
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

function mostrarCarrito() {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';  // Limpiar el tbody
    carrito.productos.forEach((producto, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${producto.nombre}</td>
            <td><input type="number" name="cantidad" value="${producto.cantidad}" min="1" class="w-50" data-id="${producto.id}" /></td>
            <td>${producto.costo}</td>
            <td>${producto.costo * producto.cantidad}</td>
            <td><button class="btn btn-danger" onclick="eliminarDelCarrito('${producto.id}')">x</button></td>
        `;
        tbody.appendChild(tr);
    });
}



function agregarAlCarrito(id) {
    const producto = productos.find(producto => producto.id === id);
    if (producto && producto.cantidadEnStock > 0) {
        carrito.agregarProducto(producto);
        mostrarCarrito();
    } else {
        alert('Stock insuficiente o producto no encontrado.');
    }
}

function eliminarDelCarrito(id) {
    carrito.eliminarProducto(id);
    mostrarCarrito();
}



function comprar(metodoDePago) {
    const total = carrito.calcularTotal(metodoDePago); 
    const modalBody = document.querySelector('#exampleModal .modal-body');
    modalBody.textContent = `Total de la compra: $${total.toFixed(2)}`;
    alert(`Total de la compra: $${total.toFixed(2)}`);
    carrito.productos.forEach(producto => {
        const productoOriginal = productos.find(p => p.id === producto.id);
        productoOriginal.cantidadEnStock -= 1;  
    });
    localStorage.setItem('productos', JSON.stringify(productos));  
    carrito.productos = [];  
    mostrarProductos();
    mostrarCarrito();
}



document.getElementById('formularioProducto').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = Date.now(); 
    const nombre = document.getElementById('inputNombreProducto').value;
    const descripcion = document.getElementById('inputDescripcionProducto').value;
    const cantidadEnStock = document.getElementById('inputCantProducto').value;
    const costo = document.getElementById('inputPrecioProducto').value;
    const nuevoProducto = new Producto(id, nombre, descripcion, cantidadEnStock, costo);
    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
});

function mostrarProductos() {
    const listaProductos = document.getElementById('listaDeProductos');
    listaProductos.innerHTML = ''; 
    productos.forEach(producto => {
        const itemProducto = document.createElement('li');
        itemProducto.textContent = `${producto.nombre}: ${producto.cantidadEnStock} en stock, costo: ${producto.costo}`;
        
        const botonAgregar = document.createElement('button');
        botonAgregar.textContent = 'Agregar al Carrito';
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto.id);
        });
        
        itemProducto.appendChild(botonAgregar);
        listaProductos.appendChild(itemProducto);
    });
}


document.addEventListener('DOMContentLoaded', mostrarCarrito);

/*<div class="col d-flex align-items-start">
          <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <svg class="bi" width="1em" height="1em"><use xlink:href="#toggles2"></use></svg>
          </div>
          <div>
            <h3 class="fs-2 text-body-emphasis">${producto.nombre}</h3>
            <p>${producto.cantidadEnStock} en stock, costo: ${producto.costo}</p>
            <a href="#" class="btn btn-success">
              Comprar
            </a>
          </div>
        </div>*/

