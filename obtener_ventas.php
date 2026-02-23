<?php
// Le decimos a la web que vamos a devolver un paquete de datos (JSON)
header('Content-Type: application/json');

$host = 'localhost';
$usuario = 'root';
$contrasena = '';
$base_de_datos = 'achunails_db';

$conexion = new mysqli($host, $usuario, $contrasena, $base_de_datos);

if ($conexion->connect_error) {
    die(json_encode(['error' => 'Error de conexión a la base de datos']));
}

// Le pedimos a MySQL todas las ventas, ordenadas por fecha (la más reciente primero)
$sql = "SELECT * FROM ventas ORDER BY fecha_registro DESC";
$resultado = $conexion->query($sql);

$ventas = [];

// Si hay resultados, los metemos uno por uno en nuestro arreglo $ventas
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $ventas[] = $fila;
    }
}

// Convertimos el arreglo a formato JSON y se lo enviamos al Dashboard
echo json_encode($ventas);

$conexion->close();
?>