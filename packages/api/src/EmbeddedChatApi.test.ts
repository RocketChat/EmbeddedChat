import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import EmbeddedChatApi from './EmbeddedChatApi';

// Mocks for external dependencies to isolate the unit test
jest.mock('@rocket.chat/sdk', () => ({
    Rocketchat: class MockRocketChat {
        connect() { }
        resume() { }
        subscribeRoom() { }
        onMessage() { }
        onStreamData() { }
        subscribeNotifyUser() { }
        unsubscribeAll() { }
        disconnect() { }
    }
}));

jest.mock('@embeddedchat/auth', () => ({
    RocketChatAuth: class MockAuth {
        constructor() { }
    },
    IRocketChatAuthOptions: {}
}));

describe('EmbeddedChatApi Typing Handler', () => {
    let api: any;

    beforeEach(() => {
        api = new EmbeddedChatApi('http://localhost:3000', 'GENERAL', {} as any);
    });

    test('FIFO Async Queue: updates typing status sequentially without blocking', async () => {
        const statuses: string[][] = [];
        api.addTypingStatusListener((users: string[]) => {
            statuses.push([...users]);
        });

        // Simulate rapid firing of events
        api.handleTypingEvent({ typingUser: 'user1', isTyping: true });
        api.handleTypingEvent({ typingUser: 'user2', isTyping: true });
        api.handleTypingEvent({ typingUser: 'user1', isTyping: false });

        // Deterministic wait for the queue to drain
        await api.typingChain;

        // Verify sequential updates (FIFO) order
        expect(statuses).toEqual([
            ['user1'], // user1 starts
            ['user2', 'user1'], // user2 starts (unshifted to front)
            ['user2'], // user1 stops
        ]);

        // Verify final state
        expect(api.typingUsers).toEqual(['user2']);
    });
});
