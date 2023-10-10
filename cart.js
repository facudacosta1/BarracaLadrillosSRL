export class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        this.productos.push(producto);
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(producto => producto.id !== id);
    }

    calcularTotal(metodoDePago) {
        let total = this.productos.reduce((acum, producto) => acum + producto.costo, 0);
        switch(metodoDePago) {
            case 'efectivo':
                total *= 0.9;
                break;
            case 'credito':
                total *= 1.07;
                break;
            default:
                break;
        }
        return total;
    }
}