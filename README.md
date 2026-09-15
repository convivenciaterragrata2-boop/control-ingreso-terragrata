# Control NFC – primera versión

## Qué incluye
- PWA instalable en Android.
- Lectura de Web NFC cuando el navegador/dispositivo lo permite.
- Registro de vehículos y chips.
- Activación/bloqueo de vehículos.
- Validación de acceso.
- Historial local de hasta 2.000 eventos.
- Exportación CSV.
- Modo de prueba sin NFC.

## Importante
Esta versión es un **prototipo local**: los datos quedan almacenados en el navegador del dispositivo mediante localStorage. No es todavía una base de datos centralizada.

Para una operación real del conjunto, la siguiente versión debe incorporar:
1. Base de datos central (por ejemplo Supabase).
2. Usuarios y contraseñas/roles.
3. Sincronización entre celulares de vigilancia y administración.
4. Auditoría y copias de seguridad.
5. Política de tratamiento de datos personales.
6. Control de concurrencia para evitar registros duplicados.
7. Integración futura con un controlador electrónico si la talanquera se automatiza.

## Cómo probarlo
1. Publica esta carpeta en un servidor HTTPS.
2. Abre la dirección desde Chrome en un Android compatible con Web NFC.
3. Pulsa "Probar sin NFC" para verificar la interfaz.
4. En "Vehículos", pulsa "Cargar vehículos de ejemplo".
5. Para NFC real, registra el identificador del chip que entregue el navegador al leerlo.
6. Registra un vehículo con ese ID y vuelve a la pantalla "Ingreso".

## Seguridad
No guardes nombres, teléfonos ni otros datos sensibles dentro del chip. El chip debe funcionar como identificador; la información debe estar en la plataforma.

## Talanquera manual
La plataforma NO acciona una talanquera. Después de una validación verde, el vigilante levanta manualmente la talanquera. Esto es intencional para probar el flujo sin instalar hardware.

## Nota sobre Web NFC
Web NFC tiene restricciones de navegador, sistema operativo y HTTPS. Si el Android no expone Web NFC, puede utilizarse un lector NFC externo o una aplicación Android nativa en una segunda etapa.
