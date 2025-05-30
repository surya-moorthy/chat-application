import WebSocket from "ws";
import { IncomingMessage } from "http";
import { Chat } from "./Chat";
import { UserManager } from "./User";

const userManager = new UserManager();
const rooms = new Map<string, Set<any>>();
const chat = new Chat(rooms, userManager);

export const handleConnection = (socket: WebSocket, req: IncomingMessage) => {
  try {
    const userId = extractUserFromRequest(req); // assume JWT token or similar
    const username = `User-${Math.floor(Math.random() * 10000)}`;

    const user = {
      socket,
      userId,
      username,
    };

    console.log(`[CONNECTED] ${username} (${userId})`);

    chat.handleMessages(user);

    socket.on("close", () => {
      console.log(`[DISCONNECTED] ${userId}`);
      userManager.removeUserSocket(username);
    });

  } catch (err) {
    console.error("WebSocket connection error:", err);
    socket.close();
  }
};

function extractUserFromRequest(req: IncomingMessage): string {
  const token = req.headers["sec-websocket-protocol"] as string;
  // TODO: verify token using JWT and extract userId
  return token; // mock for now
}
