const {generateRoomCode , joinRoom } = require("../middleware/roomMiddleware");

module.exports = (io, activeGames) => {
	io.on("connection", (socket)=>{
		console.log(`${socket.id} has joined the table`);
		
		socket.on("createRoom", ()=> {
			const roomCode= generateRoomCode(activeGames);
			socket.emit("roomCreated", roomCode);
			activeGames[roomCode] = {	
				players:[], 
				deck: null,
				pot: 0,
				host: socket.id,
				start: false
			};
			const game = activeGames[roomCode]
			let playerName = "test test ";
			joinRoom(io, socket, game ,roomCode,  playerName);
		});


		socket.on("checkRoom", (roomCode) => {
			if (activeGames.hasOwnProperty(roomCode)){
				socket.emit("roomCreated", roomCode);
				let playerName = "test test ";
				const game = activeGames[roomCode]
				joinRoom(io,socket, game, roomCode, playerName);
			}else {
				socket.emit("roomDontExist");
			}
		});

		socket.on("getGameInfo", (roomCode) => {
			const game = activeGames[roomCode];
			socket.emit("updateGame",game); 
		});



		socket.on("startGame", (gameID) => {
			if (!activeGames[gameID]){
				console.log(`${gameID} doesnt exist`);
				console.log(activeGames);
				return ;
			}
			const game = activeGames[gameID];

			game.start = true;
			dealCards(game.players,game.deck);
			io.to(gameID).emit("updateGame",{
				...game,
				players: game.players.map(player=>({
					id: player.id,
					name: player.name,
					chips: player.chips,
					isHost: player.isHost
				}))
			});
				

		});
		socket.on("disconnect", () =>{
			for (let gameID in activeGames){
				let game = activeGames[gameID];
				game.players = game.players.filter(p => p.id !== socket.id);
				io.to(gameID).emit("updateGame", game);
			}
		});  

	})
}

