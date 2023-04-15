export interface UserData {
    userData: UserDataClass;
}

export interface UserDataClass {
    id?: number;
    name?: string;
    email?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Clientes {
    id: number;
    cedula: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    eps: string;
    created_at: Date;
    updated_at: Date;
}

export interface Productos {
    id: number;
    nombre: string;
    precio: number;
    lote: string;
    vencimiento: Date;
    estado: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoFacturacion {
    id: number;
    descripcion: string;
    created_at: Date;
    updated_at: Date;
}

export interface ArrayProductos {
    producto_id: number;
    nombre: string;
    lote: string;
    cantidad: number;
    precio: number;
    precio_unitario: number;
}

export interface Formulas {
    id:                  number;
    cliente_id:          number;
    tipo_facturacion_id: number;
    observacion:         string;
    usuario_id:          number;
    created_at:          Date;
    updated_at:          Date;
    cliente:             Cliente;
    tipofactura:         Tipofactura;
    usuario:             Usuario;
    detalle:             Detalle[];
}

export interface Cliente {
    id:         number;
    cedula:     string;
    nombre:     string;
    direccion:  string;
    telefono:   number;
    email:      string;
    eps:        string;
    created_at: Date;
    updated_at: Date;
}

export interface Detalle {
    id:          number;
    factura_id:  number;
    producto_id: number;
    cantidad:    number;
    precio:      number;
    created_at:  Date;
    updated_at:  Date;
    producto:    Producto;
}

export interface Producto {
    id:          number;
    nombre:      string;
    precio:      number;
    lote:        string;
    vencimiento: Date;
    estado:      string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Tipofactura {
    id:          number;
    descripcion: string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Usuario {
    id:         number;
    name:       string;
    email:      string;
    created_at: Date;
    updated_at: Date;
}

