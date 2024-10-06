import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useMessageStore, useUserStore } from '../../store';
import ActionItem from './ActionItem';
import { useRCContext } from '../../contexts/RCInstance';
import { View, Text } from 'react-native';
import { FormTextInput } from '../TextInput';
import { Button } from '../Button';

const MessageActionsSheet = () => {
	const bottomSheetRef = useRef();
	const reportInputRef = useRef();
	const [showReportForm, setShowReportForm] = useState(false);
	const { RCInstance } = useRCContext();

	const authenticatedUserId = useUserStore(state => state.userId);
	const setEditMessage = useMessageStore(state => state.setEditMessage);
	const setIsEditMessageCalled = useMessageStore(state => state.setIsEditMessageCalled);
	const selectedMessage = useMessageStore( state => {
		const selectedMessageId = state.selectedMessageId;
		return state.messages.find((message) => message._id === selectedMessageId);
	});
	const setSelectedMessage = useMessageStore(state => state.setSelectedMessage);
	const isStarred = useMemo(
		() =>
			selectedMessage &&
			selectedMessage.starred &&
			selectedMessage.starred.find((u) => u._id === authenticatedUserId),
		[selectedMessage, authenticatedUserId]
	);
	const snapPoints = useMemo(() => ["50%"], []);

	const closeBottomSheet = useCallback(() => {
		setSelectedMessage(null);
		setShowReportForm(false);
		bottomSheetRef.current?.close();
	}, [selectedMessage]);

	useEffect(() => {
		if (selectedMessage) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [selectedMessage]);

	const handleStarMessage = useCallback(async () => {
		closeBottomSheet();
		if (!isStarred) {
			await RCInstance.starMessage(selectedMessage._id);
		} else {
			await RCInstance.unstarMessage(selectedMessage._id);
		}
	}, [selectedMessage, authenticatedUserId, RCInstance, isStarred]);

	const handlePinMessage = useCallback(async () => {
		closeBottomSheet();
		const isPinned = selectedMessage.pinned;
		if (isPinned) {
			await RCInstance.unpinMessage(selectedMessage._id)
		} else {
			await RCInstance.pinMessage(selectedMessage._id);
		}
	}, [selectedMessage, RCInstance]);

	const handleDeleteMessage = useCallback(async () => {
		closeBottomSheet();
		await RCInstance.deleteMessage(selectedMessage._id);
	}, [selectedMessage, RCInstance]);

	const handleEditMessage = useCallback(() => {
		setEditMessage(selectedMessage || {});
		setIsEditMessageCalled(true);
		closeBottomSheet();
	}, [selectedMessage, closeBottomSheet, setEditMessage]);

	const handleReportMessage = useCallback(() => {
		setShowReportForm(true);
		
	}, [setShowReportForm]);

	const submitReport = useCallback(async () => {
		const description = reportInputRef.current?.state?.text;
		await RCInstance.reportMessage(selectedMessage._id, description);
		closeBottomSheet();
	}, [selectedMessage, RCInstance, closeBottomSheet]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			snapPoints={snapPoints}
			onClose={closeBottomSheet}
			backdropComponent={(props) => (
				<BottomSheetBackdrop
					{...props}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
				/>
			)}
			enablePanDownToClose
		>
			<BottomSheetScrollView>
				{
					!showReportForm ? 
						<>
							<ActionItem
								icon="edit"
								text="Edit"
								onPress={handleEditMessage}
							/>
							<ActionItem
								icon={isStarred ? "star-filled" : "star"}
								text={isStarred ? "Remove star" : "Star"}
								onPress={handleStarMessage}
							/>
							<ActionItem
								icon={"pin"}
								text={selectedMessage?.pinned ? "Unpin" : "Pin"}
								onPress={handlePinMessage}
							/>
							<ActionItem
								icon="delete"
								text="Delete"
								color="error"
								onPress={handleDeleteMessage}
							/>
							<ActionItem
								icon="warning"
								text="Report"
								color="error"
								onPress={handleReportMessage}
							/>
						</>
						:
						<View style={{ flexDirection: 'column', margin: 10, gap: 5 }}>
							<Text style={{ fontSize: 24 }}>Report Message</Text>
							<FormTextInput 
								ref={reportInputRef} 
								multiline
								rows={5}
								label={`Why do you want to report ${selectedMessage?.msg}?`}
								placeholder={`Why do you want to report ${selectedMessage?.msg}?`}/>
							<View style={{ flexDirection: 'row', gap: 5}}>
								<Button color={'primary'} title="Report" onPress={submitReport}/>
								<Button color={'secondary'} title="Cancel" onPress={closeBottomSheet}/>
							</View>
						</View> 
					
				}
			</BottomSheetScrollView>
		</BottomSheet>
	);
}

export default MessageActionsSheet;
