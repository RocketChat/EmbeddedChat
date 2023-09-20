import React, { useCallback, useEffect } from 'react';
import { Box } from '../../components/Box';
import { ChatInput } from '../../components/ChatInput';
import { MessageList } from '../../components/MessageList';
import { useRCContext } from '../../contexts/RCInstance';
import { useMessageStore, useUserStore } from '../../store';

const ChatRoomView = () => {
	const { RCInstance, ECOptions } = useRCContext();

	const isUserAuthenticated = useUserStore((state) => state.isUserAuthenticated);
	const setRoles = useUserStore((state) => state.setRoles);

	const setMessages = useMessageStore((state) => state.setMessages);
	const upsertMessage = useMessageStore((state) => state.upsertMessage);
	const removeMessage = useMessageStore((state) => state.removeMessage);
	const getMessagesAndRoles = useCallback(
		async (anonymousMode) => {
			try {
				if (!isUserAuthenticated && !anonymousMode) {
					return;
				}
				const { messages } = await RCInstance.getMessages(
					anonymousMode,
					ECOptions?.enableThreads
						? {
								query: {
									tmid: {
										$exists: false,
									},
								},
							}
						: undefined
				);
				if (messages) {
					console.log(messages);
					setMessages(
						messages.filter((message) => message._hidden !== true)
					);
				}
				if (!isUserAuthenticated) {
					// fetch roles only when user is authenticated
					return;
				}
				if (ECOptions.showRoles) {
					const { roles } = await RCInstance.getChannelRoles();
					// convert roles array from api into object for better search
					const rolesObj = roles.reduce(
						(obj, item) =>
							Object.assign(obj, { [item.u.username]: item }),
						{}
					);
					setRoles(rolesObj);
				}
			} catch (e) {
				console.error(e);
			}
		},
		[
			RCInstance,
			isUserAuthenticated,
			ECOptions.enableThreads,
			ECOptions.anonymousMode,
			ECOptions.showRoles,
		]
	);
	const addMessage = useCallback(
		(message) => {
			upsertMessage(message, ECOptions?.enableThreads);
		},
		[upsertMessage, ECOptions?.enableThreads]
	);
	useEffect(() => {
		RCInstance.auth.onAuthChange((user) => {
			if (user) {
				RCInstance.addMessageListener(addMessage);
				RCInstance.addMessageDeleteListener(removeMessage);
				getMessagesAndRoles();
			} else {
				getMessagesAndRoles(ECOptions.anonymousMode);
			}
		});

		return () => {
			RCInstance.close();
			RCInstance.removeMessageListener(addMessage);
			RCInstance.removeMessageDeleteListener(removeMessage);
		};
	}, [
		RCInstance,
		getMessagesAndRoles,
		addMessage,
		removeMessage,
		ECOptions.anonymousMode
	]);

	return (
		<Box>
			<MessageList />
			<ChatInput />
		</Box>
	)
}

export default ChatRoomView;