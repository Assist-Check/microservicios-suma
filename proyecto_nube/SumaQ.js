const { createServer } = require('node:http');
const { URL } = require('node:url');

const direccion = '0.0.0.0';
const puertoEscucha = process.env.PORT || 3004;

const servidor = createServer((req, res) => {

  const urlCompleta = new URL(req.url, `http://${req.headers.host}`);

  const numeroA = Number(urlCompleta.searchParams.get('dato1'));
  const numeroB = Number(urlCompleta.searchParams.get('dato2'));

  const total = numeroA + numeroB;

  const salida = {
    resultado: total
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(salida));
});

servidor.listen(puertoEscucha, direccion, () => {
	console.log(`Web Server corriendo en puerto ${puertoEscucha}`);
});
