const { createServer } = require('node:http');

const direccion = '0.0.0.0';
const puertoEscucha = process.env.PORT || 3002;

const servidor = createServer((req, res) => {
  const trozos = [];

  req.on('data', (fragmento) => {
    trozos.push(fragmento);
  });

  req.on('end', () => {

    const cuerpoRecibido = Buffer.concat(trozos).toString();
    const entrada = JSON.parse(cuerpoRecibido);

    const numeroA = Number(entrada.dato1);
    const numeroB = Number(entrada.dato2);

    const total = numeroA + numeroB;

    const salida = {
      resultado: total
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(salida));
  });
});

servidor.listen(puertoEscucha, direccion, () => {
	console.log(`Web Server corriendo en puerto ${puertoEscucha}`);
});
