require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin:"http://localhost:3000",
		methods:["GET","POST"]
	}
});
app.use(cors());
app.use(express.json());

let activeGames = {};
const shuffleDeck = () =>{
	const pattern = ["W","X","Y","Z"];
	const values = ["2","3","4","5","6","7","8","9","10","11","12","13","14"];
	let deck = [] ; 
	pattern.forEach(pat => {
		values.forEach(value =>{
			deck.push({values, pattern});		
		});
	});
	for (let i = deck.length -1 ; i> 0 ; i--){
		let j = Math.floor(Math.random() * (i + 1 )); 
		[deck[i] , deck[j]] = [deck[j] , deck[i]];
	} 
}

const dealCards = (players,deck) => {
	for( let player of players){
		player.hand = [deck.pop(), deck.pop()];				
	}
	
};
io.on("connection", (socket)=>{
	console.log(`${socket.id} has joined the table`);
	socket.on("joinGame", (gameID, playerName) => {
		if(!activeGames[gameID]){
			activeGames[gameID] ={
				players: [],
				deck: shuffleDeck(),
				pot: 0
			};
		}	
		const game = activeGames[gameID];	
		if (!game.players.find(p => p.id === socket.id)){
			game.players.push({id: socket.id, name: playerName, chips: 1000, hand:[]});
		}
		socket.join(gameID);
		io.to(gameID).emit("updateGame",game);
		if(game.players.length >= 2){
			dealCards(game.players,game.deck);
		}
			
	});
	socket.on("disconnect", () =>{
		for (let gameID in activeGames){
			let game = activeGames[gameID];
			game.players = game.players.filter(p => p.id !== socket.id);
			io.to(gameID).emit("updateGame", game);
		}
	});
	
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{
	console.log(`Server is running on port ${PORT}`);
});
