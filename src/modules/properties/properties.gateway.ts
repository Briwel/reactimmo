import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Propriete } from './entities/propriete.entity';

@WebSocketGateway({ namespace: 'properties', cors: { origin: '*' } })
export class PropertiesGateway implements OnGatewayConnection {
  emitNewProperty(saved: Propriete) {
    this.emitCreated(saved);
  }
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const auth = client.handshake.auth as Record<string, unknown> | undefined;
    const query = client.handshake.query as Record<string, unknown> | undefined;

    const tokenVal = (auth && auth.token) ?? (query && query.token);
    if (!tokenVal || typeof tokenVal !== 'string') {
      client.disconnect(true);
      return;
    }

    const raw = tokenVal.replace(/^Bearer\s+/i, '');

    let payload: unknown;
    try {
      payload = this.jwtService.verify(raw);
    } catch {
      client.disconnect(true);
      return;
    }

    let userId: number | undefined;
    if (typeof payload === 'object' && payload !== null && 'sub' in payload) {
      const sub = (payload as Record<string, unknown>).sub;
      if (typeof sub === 'number') userId = sub;
      else if (
        typeof sub === 'string' &&
        sub.trim() !== '' &&
        /^\d+$/.test(sub)
      )
        userId = Number(sub);
    }

    if (!userId) {
      client.disconnect(true);
      return;
    }

    // Join a room unique to the user so we can emit private events
    void client.join(`user_${userId}`);
  }

  // Helpers to emit events
  emitCreated(property: unknown) {
    const p = property as Record<string, unknown> | undefined;
    let ownerId: number | undefined;

    if (
      p?.proprietaire &&
      typeof p.proprietaire === 'object' &&
      p.proprietaire !== null
    ) {
      const prop = p.proprietaire as Record<string, unknown>;
      if (typeof prop.id === 'number') ownerId = prop.id;
      else if (typeof prop.id === 'string' && /^\d+$/.test(prop.id))
        ownerId = Number(prop.id);
    }

    if (ownerId === undefined && typeof p?.proprietaireId === 'number') {
      ownerId = p.proprietaireId;
    }

    if (typeof ownerId === 'number') {
      this.server.to(`user_${ownerId}`).emit('property.created', property);
    } else {
      // Broadcast to all if owner unknown
      this.server.emit('property.created', property);
    }
  }

  emitUpdated(property: unknown) {
    const p = property as Record<string, unknown> | undefined;
    let ownerId: number | undefined;

    if (
      p?.proprietaire &&
      typeof p.proprietaire === 'object' &&
      p.proprietaire !== null
    ) {
      const prop = p.proprietaire as Record<string, unknown>;
      if (typeof prop.id === 'number') ownerId = prop.id;
      else if (typeof prop.id === 'string' && /^\d+$/.test(prop.id))
        ownerId = Number(prop.id);
    }

    if (ownerId === undefined && typeof p?.proprietaireId === 'number') {
      ownerId = p.proprietaireId;
    }

    if (typeof ownerId === 'number') {
      this.server.to(`user_${ownerId}`).emit('property.updated', property);
    } else {
      this.server.emit('property.updated', property);
    }
  }

  emitDeleted(payload: { id: number; ownerId?: number }) {
    const ownerId = payload?.ownerId;
    if (ownerId) {
      this.server
        .to(`user_${ownerId}`)
        .emit('property.deleted', { id: payload.id });
    } else {
      this.server.emit('property.deleted', { id: payload.id });
    }
  }
}
