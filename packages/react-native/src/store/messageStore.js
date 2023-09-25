import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';

const useMessageStore = create((set, get) => ({
	messages: [],
	threadMessages: [],
	filtered: false,
	editMessage: {},
  isEditMessageCalled: false,
	selectedMessageId: null,
	messageToReport: NaN,
	showReportMessage: false,
	isRecordingMessage: false,
	isThreadOpen: false,
	threadMainMessage: null,
	setSelectedMessage: (messageOrId) => {
		set({ selectedMessageId: messageOrId?._id || messageOrId || null });
	},
	setFilter: (filter) => set(() => ({ filtered: filter })),
	setMessages: (messages) => set(() => ({ messages })),
	upsertMessage: (message, enableThreads = false) => {
		if (message.tmid && enableThreads) {
			if (get().threadMainMessage?._id === message.tmid) {
				set((state) => ({
					threadMessages: upsertMessage(
						state.threadMessages,
						message
					),
				}));
			}
		} else {
			set((state) => ({
				messages: upsertMessage(state.messages, message),
			}));
		}
	},
	removeMessage: (messageId) => {
		const threadMessage = get().threadMessages.find(
			(m) => m._id === messageId
		);
		const message = get().messages.find((m) => m._id === messageId);
		if (threadMessage) {
			return set((state) => ({
				threadMessages: cloneArray(state.threadMessages).filter(
					(m) => m._id !== messageId
				),
			}));
		}
		if (message) {
			return set((state) => ({
				messages: cloneArray(state.messages).filter(
					(m) => m._id !== messageId
				),
			}));
		}
	},
	replaceMessage: (oldMessageId, newMessage) =>
		set((state) => {
			const idx = state.messages.findIndex((m) => m._id === oldMessageId);
			if (idx !== -1) {
				return [...state.messages].splice(idx, idx, newMessage);
			}
		}),
	setEditMessage: (editMessage) => set(() => ({ editMessage })),
  setIsEditMessageCalled: (called) => set(() => ({ isEditMessageCalled: called})),
	setMessageToReport: (messageId) =>
		set(() => ({ messageToReport: messageId })),
	toggleShowReportMessage: () => {
		set((state) => ({ showReportMessage: !state.showReportMessage }));
	},
	toogleRecordingMessage: () => {
		set((state) => ({
			isRecordingMessage: !state.isRecordingMessage,
		}));
	},
	openThread: (message) => {
		set(() => ({
			isThreadOpen: true,
			threadMainMessage: message,
			threadMessages: [],
		}));
	},
	closeThread: () => {
		set(() => ({
			isThreadOpen: false,
			threadMainMessage: null,
			threadMessages: [],
		}));
	},
	setThreadMessages: (messages) => set(() => ({ threadMessages: messages })),
}));

export default useMessageStore;
