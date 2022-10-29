import { Server as TCPServer, Socket } from 'net';
import { Parser, ParseResult } from './parser';
import { matchPath } from './utils';

export interface Request extends Pick<ParseResult, 'method' | 'headers' | 'body'> {
  params: Record<string, string>;
  query: Record<string, string>;
}

export class Server {
  private readonly server: TCPServer;
  private readonly parser: Parser;

  public constructor(port: number) {
    this.server = new TCPServer();
    this.parser = Parser.getInstance();

    this.server.listen(port, () => console.log(`Server listening on port ${port}`));
  }

  public request(path: string, requestHandler: (request: Request) => void): void {
    this.server.addListener('connection', (socket: Socket) => {
      socket.addListener('data', (data: Buffer) => {
        const parseResult = this.parser.parse(data);
        const params = matchPath(path, parseResult.url);

        if (params === null) {
          return;
        }

        requestHandler({
          ...parseResult,
          params,
          query: {}
        });
      });
    });
  }
}
