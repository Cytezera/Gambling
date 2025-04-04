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
        return deck;
}
module.export = shuffleDeck 
