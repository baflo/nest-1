import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Injectable, PipeTransform, ArgumentMetadata, UsePipes } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  /**
   * constructor to build Injectable
   * @param options validationoptions from
   */
  constructor(private options: ValidatorOptions = {}) {
  }

  /**
   * Transforms values to Events
   * @param value body of request, which needs to get validated.
   * @param metadata metadata to the class to whoich it shpuld get validated, is here always "Object", as not all properties are coming from classes.
   */
  public async transform<T>(value: T, metadata: ArgumentMetadata): Promise<T> {
    console.log({ value });
    return value;
  }
}



@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  @UsePipes(new ValidationPipe())
  findAll(@MessageBody() data: any, @ConnectedSocket() client): Observable<WsResponse<number>> {
    console.log({ data });
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
