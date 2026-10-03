# Calculadora con microservicios — desplegado en Render

## Qué cambió respecto a tu versión original

Solo 2 cosas en cada archivo `.js`:
1. `127.0.0.1` → `0.0.0.0` (para que el servicio acepte conexiones de
   internet, no solo de tu propia máquina).
2. El puerto fijo (3000, 3001, etc.) ahora se lee de
   `process.env.PORT`, porque en la nube la plataforma asigna el
   puerto automáticamente — si no lo encuentra, usa el mismo puerto
   de siempre como respaldo para que lo puedas seguir probando en tu
   PC sin problema.

En los 3 `Microservicio*.js` (los gateways) hay un cambio más: en vez
de tener `hostname: '127.0.0.1', port: 3004` escrito fijo, ahora leen
una variable `BACKEND_URL` que tú configuras en Render con la URL
real de su "Suma" correspondiente una vez esté desplegada. El resto
de la lógica (CORS, leer el body, reenviar la petición) es exactamente
igual a la tuya.

La lógica de suma en los archivos `Suma*.js` no cambió en nada.

---

## Mapa de servicios

| Archivo              | Qué hace                          | Puerto local |
|-----------------------|------------------------------------|--------------|
| SumaQ.js              | Suma por query params (?dato1=&dato2=) | 3004     |
| MicroservicioQ.js     | Gateway → reenvía a SumaQ         | 3005         |
| SumaP.js              | Suma por path params (/num1/num2) | 3000         |
| MicroservicioP.js     | Gateway → reenvía a SumaP         | 3001         |
| SumaB.js              | Suma por POST body JSON           | 3002         |
| MicroservicioB.js     | Gateway → reenvía a SumaB         | 3003         |
| Body_params_Calculadora.html | Interfaz con los 3 botones | (ninguno, es estático) |

El HTML solo habla con los 3 "Microservicio" (los gateways), nunca
directo con los "Suma".

---

## Paso 1: Subir a GitHub

Sube esta carpeta completa (los 6 `.js` + el `.html` + este README)
a tu repositorio, igual que ya veníamos haciendo con GitHub Desktop.

---

## Paso 2: Desplegar los 3 backends (los "Suma")

Repite esto 3 veces, una por cada uno de: `SumaQ.js`, `SumaP.js`, `SumaB.js`

1. En Render → **New +** → **Web Service**
2. Conecta tu repositorio
3. **Root Directory**: déjalo vacío (todos los archivos están en la
   raíz del repo)
4. **Name**: un nombre único, ej. `sumaq-tunombre`
5. **Runtime**: Node
6. **Build Command**: déjalo vacío (no usamos librerías externas)
7. **Start Command**: `node SumaQ.js` (cambia el nombre del archivo
   según cuál estés desplegando)
8. **Instance Type**: Free
9. Create Web Service, espera a que diga "Live"
10. Copia la URL que te da (ej. `https://sumaq-tunombre.onrender.com`)

Anota las 3 URLs que te da Render, una por cada Suma.

---

## Paso 3: Desplegar los 3 gateways (los "Microservicio")

Mismo proceso para `MicroservicioQ.js`, `MicroservicioP.js`, `MicroservicioB.js`,
con una diferencia: antes de darle "Create Web Service", en la sección
**Environment Variables** agrega:

- **Key**: `BACKEND_URL`
- **Value**: la URL del Suma correspondiente (del Paso 2)

| Gateway            | Start Command            | BACKEND_URL apunta a... |
|----------------------|---------------------------|---------------------------|
| MicroservicioQ.js    | `node MicroservicioQ.js`  | URL de SumaQ              |
| MicroservicioP.js    | `node MicroservicioP.js`  | URL de SumaP              |
| MicroservicioB.js    | `node MicroservicioB.js`  | URL de SumaB              |

Anota también las 3 URLs de los gateways una vez estén "Live".

---

## Paso 4: Conectar el HTML con las URLs reales

Abre `Body_params_Calculadora.html`, busca estas 3 líneas cerca del
inicio del `<script>`:

```javascript
const URL_QUERY = 'http://127.0.0.1:3005';
const URL_PATH  = 'http://127.0.0.1:3001';
const URL_BODY  = 'http://127.0.0.1:3003';
```

Reemplázalas por las URLs reales que te dio Render en el Paso 3, por
ejemplo:

```javascript
const URL_QUERY = 'https://microservicioq-tunombre.onrender.com';
const URL_PATH  = 'https://microserviciop-tunombre.onrender.com';
const URL_BODY  = 'https://microserviciob-tunombre.onrender.com';
```

Guarda el archivo. Puedes simplemente abrirlo haciendo doble clic
(se abre en tu navegador) y ya debería funcionar contra los servicios
en la nube, o puedes también publicarlo como página estática en
Render/Vercel si quieres que la calculadora en sí también tenga un
link público.

---

## Paso 5: Probar y tomar capturas

Abre el HTML, llena Valor A y Valor B, prueba los 3 botones uno por
uno y confirma que el campo "Salida" muestre el resultado correcto.
Toma una captura de cada botón funcionando (3 capturas) para el PDF
de evidencia, más una captura del Dashboard de Render con los 6
servicios en estado "Live".

Nota: el plan gratuito de Render "duerme" el servicio tras un rato
sin uso — la primera prueba después de inactividad puede tardar
20-30 segundos en responder mientras despierta. Es normal, no es un
error.
