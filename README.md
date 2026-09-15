# Control NFC Terragrata v2
1. Crear proyecto Supabase.
2. Ejecutar `supabase_schema.sql` completo en SQL Editor.
3. Crear un usuario en Authentication > Users.
4. Copiar su UUID y crear su fila en `profiles` con rol `admin` y el `conjunto_id` de Terragrata.
5. Copiar `config.example.js` como `config.js` y colocar URL + Publishable/anon key.
6. Subir los archivos a GitHub Pages.
7. Nunca poner service_role/secret key en el navegador.
8. Probar primero con datos ficticios.

La versión usa Auth + PostgreSQL + RLS. NFC requiere un Android/navegador compatible con Web NFC; si no, haremos una app Android nativa en la siguiente etapa.
