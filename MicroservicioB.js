const { createServer, request } = require('node:http');
const { request: requestHttps } = require('node:https');
const { URL } = require('node:url');

const host = '0.0.0.0';
const puerto = process.env.PORT || 3003;

// URL publica de SumaB ya desplegado (se configura en Render como variable de entorno)
// Ej: https://sumab-tuapellido.onrender.com
const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:3002';

const servidor = createServer((req, res) => {

  // respuesta directa al preflight CORS del navegador
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  const trozos = [];

  req.on('data', (fragmento) => {
    trozos.push(fragmento);
  });

  req.on('end', () => {

    const cuerpoRecibido = Buffer.concat(trozos).toString();

    const destino = new URL('/', backendUrl);
    const esHttps = destino.protocol === 'https:';

    const opcionesSalida = {
      hostname: destino.hostname,
      port: destino.port || (esHttps ? 443 : 80),
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(cuerpoRecibido)
      }
    };

    const peticionar = esHttps ? requestHttps : request;

    const peticionSaliente = peticionar(opcionesSalida, (respuestaExterna) => {

      const trozosRespuesta = [];

      respuestaExterna.on('data', (fragmento) => {
        trozosRespuesta.push(fragmento);
      });

      respuestaExterna.on('end', () => {
        const resultadoFinal = Buffer.concat(trozosRespuesta).toString();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(resultadoFinal);
      });
    });

    peticionSaliente.write(cuerpoRecibido);
    peticionSaliente.end();
  });
});

servidor.listen(puerto, host, () => {
  console.log(`Microservicio activo en puerto ${puerto}, apuntando a ${backendUrl}`);
});
