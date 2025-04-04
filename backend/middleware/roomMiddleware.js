const generateRoomCode = (activeGames) =>{
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let code; 
	do {
		code = Array.from({ length:4 } , () => chars[Math.floor(Math.random() * chars.length)]).join("");
	}while (activeGames[code]);	
	return code;
};
const joinRoom = (io,socket,game,roomCode, playerName) =>{
	if (!game){
		console.log("game doesnt exist");
	}
	if (!game.players){
		game.players=[];
	}
	if (!game.players.find(p => p.id === socket.id)) {
		game.players.push({
			id: socket.id,
			name: playerName,
			chips: 1000,
			hand: [],
			isHost: game.players.length === 0
		});
	}
	socket.join(roomCode);
	io.to(roomCode).emit("updateGame",game);
};

module.exports = { generateRoomCode, joinRoom } ;
