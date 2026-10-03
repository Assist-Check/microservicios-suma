const { createServer } = require('node:http');

const direccion = '0.0.0.0';
const puertoEscucha = process.env.PORT || 3000;

const servidor = createServer((req, res) => {

  const partes = req.url.split('/').filter(Boolean);
  // req.url = "/5/3" → partes = ["5", "3"]

  const numeroA = Number(partes[0]);
  const numeroB = Number(partes[1]);

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
