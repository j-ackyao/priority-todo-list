import Server from './Server'


const PORT = 4321;

const server: Server = new Server(PORT);

server.start();