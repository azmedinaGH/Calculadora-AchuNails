<?php
// Le decimos a la web que vamos a responder en formato de datos (JSON)
header('Content-Type: application/json');

// 1. Credenciales de XAMPP para entrar a MySQL
$host = 'localhost';
$usuario = 'root'; // XAMPP usa 'root' por defecto
$contrasena = '';  // XAMPP no tiene contraseña por defecto
$base_de_datos = 'achunails_db'; // El nombre exacto de tu DB

// Intentamos conectar
$conexion = new mysqli($host, $usuario, $contrasena, $base_de_datos);

// Si falla la conexión, avisamos el error y detenemos todo
if ($conexion->connect_error) {
    die(json_encode(['status' => 'error', 'mensaje' => 'Error de conexión: ' . $conexion->connect_error]));
}

// 2. Recibir el "paquetito" de datos que manda tu JavaScript
$datos_recibidos = json_decode(file_get_contents('php://input'), true);

// Verificamos que no vengan vacíos
if (isset($datos_recibidos['servicio']) && isset($datos_recibidos['metodoPago']) && isset($datos_recibidos['precio'])) {
    
    $detalle = $datos_recibidos['servicio'];
    $metodo = $datos_recibidos['metodoPago'];
    $total = $datos_recibidos['precio'];

    // 3. Preparar la instrucción SQL (Usamos 'prepare' para que sea súper seguro contra hackeos)
    $stmt = $conexion->prepare("INSERT INTO ventas (detalle_servicio, metodo_pago, total) VALUES (?, ?, ?)");
    
    // Las letras "ssd" significan: String (texto), String (texto), Double (número con decimales)
    $stmt->bind_param("ssd", $detalle, $metodo, $total);

    // Ejecutamos y respondemos a la página web
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'mensaje' => '¡Venta registrada en MySQL con éxito!']);
    } else {
        echo json_encode(['status' => 'error', 'mensaje' => 'No se pudo guardar: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'mensaje' => 'Faltan datos de la venta']);
}

$conexion->close();
?>