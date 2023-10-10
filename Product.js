export class Producto {
    constructor(id, nombre, descripcion, cantidadEnStock, costo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidadEnStock = cantidadEnStock;
        this.costo = costo;
    }

    obtenerInfo() {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Descripción: ${this.descripcion}, Cantidad en Stock: ${this.cantidadEnStock}, Costo: ${this.costo}`;
    }

    actualizarStock(nuevaCantidad) {
        this.cantidadEnStock = nuevaCantidad;
    }

    actualizarCosto(nuevoCosto) {
        this.costo = nuevoCosto;
    }

}


//para que cada articulo se pueda eliminar por un boton propio(desafiate)
function eliminarArticulo(identificador) {
    let art = JSON.parse(localStorage.getItem("jsonArt"));
    
  
    const index = art.articles.findIndex(article => article.name === identificador);
    
 
    if (index !== -1) {
        art.articles.splice(index, 1);
        localStorage.setItem("jsonArt", JSON.stringify(art));

        location.reload();
    }
}
