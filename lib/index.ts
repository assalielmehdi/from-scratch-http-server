import { Request, Server } from './server';

const server = new Server(1337);

server.request('/test/:id', (request: Request) => {
  console.log(request);
});
