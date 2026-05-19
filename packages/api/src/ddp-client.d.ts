// Type augmentation for @rocket.chat/ddp-client
// The published .d.ts for DDPSDK is missing the stream() method declaration,
// even though it exists in the JS implementation and the SDK interface it implements.
// This augmentation adds it back so TypeScript can see it.
import type { ClientStream } from "@rocket.chat/ddp-client/dist/types/ClientStream";

declare module "@rocket.chat/ddp-client" {
  interface DDPSDK {
    stream(
      name: string,
      data: unknown,
      cb: (...data: any[]) => void
    ): ReturnType<ClientStream["subscribe"]> & { stop: () => void };
  }
}
