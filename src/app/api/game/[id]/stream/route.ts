import { inMemoryGameRepository } from '@/lib/game-repository';
import { gameEvents } from '@/lib/game-events';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<Response> {
  const { id } = await params;
  const game = inMemoryGameRepository.findById(id);

  if (!game) {
    return new Response('Game not found', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      const initialData = `data: ${JSON.stringify(game)}\n\n`;
      controller.enqueue(encoder.encode(initialData));

      // Subscribe to updates
      const unsubscribe = gameEvents.subscribe(id, (updatedGame) => {
        try {
          const data = `data: ${JSON.stringify(updatedGame)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch {
          // Stream closed
          unsubscribe();
        }
      });

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 15000);

      // Cleanup when client disconnects
      _request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
