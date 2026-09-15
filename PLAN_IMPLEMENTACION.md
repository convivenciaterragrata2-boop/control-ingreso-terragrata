# Plan de implementación – conjunto residencial

## Fase 1 – piloto
- 1 celular Android de portería.
- 5 a 10 vehículos.
- 5 a 10 chips NFC.
- Validación manual.
- Duración sugerida: 1 semana.

## Fase 2 – plataforma central
- Base de datos en la nube.
- Administración desde computador/celular.
- Vigilante con cuenta propia.
- Registro de entrada y salida.
- Bloqueo inmediato de chips.
- Reportes.

## Fase 3 – operación
- Registrar todos los vehículos.
- Entregar chip contra registro.
- Acta de entrega del chip.
- Procedimiento para chip perdido.
- Procedimiento para vehículo vendido/cambiado.
- Revisión periódica de autorizaciones.

## Fase 4 – automatización futura
La talanquera actualmente es manual. Para automatizarla se necesitará identificar el mecanismo de la talanquera y verificar si admite entrada de contacto seco/relé o un controlador de acceso. No conectar hardware directamente sin conocer voltajes, esquema y protecciones.

## Estructura de datos recomendada para la siguiente versión
RESIDENTES:
id, apartamento, nombre, teléfono, estado

VEHICULOS:
id, residente_id, placa, tipo, marca_modelo, color, estado

CHIPS:
id, uid, vehiculo_id, estado, fecha_asignacion, fecha_baja

USUARIOS:
id, nombre, rol, estado

ACCESOS:
id, fecha_hora, chip_id, vehiculo_id, usuario_id, sentido, resultado, observacion

AUDITORIA:
id, fecha_hora, usuario_id, accion, registro_afectado, detalle
