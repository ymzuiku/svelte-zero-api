interface Post {
	body: {
		pong: string;
	};
}

export function post({ body }: Post) {
	return {
		body: {
			thePong: body.pong
		}
	};
}
