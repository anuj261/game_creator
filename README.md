
# game_server_creator



How to run application.


Step:1  Create new user in mongodb: 

db.createUser(
{	
    
    user: "admin",
	pwd: "test1234",

	roles:[{role: "userAdmin" , db:"game"}]})


Step:2 Run application
npm i
node index.js



API collection Description

Postman Collection:

https://www.getpostman.com/collections/251fe0eeb8abfe876f3b


1. User login and signup apis. (JWT not implemented currently)
POST /user/signup  Register a new user
POST /user/login   to get userid for ticket generation

2. Game details

/api/game/create -> game_id
/api/game/{game_id}/ticket/{user_name}/generate -> ticket_id
/ticket/{ticket_id} -> just print html table with ticket
/api/game/{game_id}/number/random -> pick random number for game without duplicates
/api/game/{game_id}/numbers -> returns all numbers picked for this game until now
/api/game/{game_id}/stats -> stats of the game {numbers drawn/no of tickets/no of users}

