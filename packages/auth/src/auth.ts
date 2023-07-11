import { Axios } from 'axios';
import RocketChatAuth from './RocketChatAuth';

const rocketChatAuth = ({
	host
}: {
	host: string;
}) => {
	return new RocketChatAuth(host);
}

export {
	rocketChatAuth
}
