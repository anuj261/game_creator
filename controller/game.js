const mongoose = require('mongoose');

require('../models/game');
require('../models/user');
require('../models/ticket');
const Game = mongoose.model('Game');
const User = mongoose.model('User');
const Ticket = mongoose.model('Ticket');

const utility = require('../lib/utils');

/**
 * Create a game
 * @param {*} req 
 * @param {*} res game_id
 */
function createGame(req, res, next) {
    const payload = req.body;
    const gameQuery = {}

    if(!payload.total_number || typeof payload.total_number != "number"){
        return res.status(400).json({ error: 'Total numbers in a game is required.' });
    }

    gameQuery.name=payload.name;
    gameQuery.available_numbers=[]
    
    for(let i =1; i<=payload.total_number; i++){
        gameQuery.available_numbers.push(i)
    }


    Game.create(gameQuery, (err, gameResults) => {
      if (err) {
        console.log(`error while creating question ${err || err.stack}`);
        
        if(err.code==11000){
          return res.status(400).json({ error: 'Duplicate question' });
        }
        return res.status(400).json({ error: 'something went wrong, please try again later' });
      }
      res.status(200).json({   game_id: gameResults["_id"], result: 'Game Created successfully'});
    });
  }

/**
 * To generate new ticket for a particular user in a game
 * @param {*} req user_name and game_id
 * @param {*} res New Ticket id
 */
function createTicket(req, res) {
    let userQuery = {}
    userQuery["user_name"]= req.params && req.params.user_name
    let gameQuery = {}
    if( req.params && req.params.game_id && mongoose.Types.ObjectId.isValid(req.params.game_id)){
        gameQuery["_id"]= req.params.game_id
    }else{
        return res.status(400).json({ error: 'Invalid game id' });
    }

    Promise.all([
        User.find(userQuery),
        Game.find(gameQuery)
        ]).then(([userResults, gameResults]) => {
        
        if(!gameResults || gameResults && gameResults.length<1){
             return res.status(400).json({ error: 'Invalid game id' });
        }else if(!userResults || userResults && userResults.length<1){
             return res.status(400).json({ error: 'Invalid user name' });
        }else{
            let ticketQuery= Object.assign({}, userQuery)
            ticketQuery["game_id"]=req.params["game_id"]

            return Ticket.create(ticketQuery)
        }
        }).then((ticketResult)=>{
            return res.status(200).json({   Ticket_id: ticketResult["_id"], result: 'Game Created successfully'});
        }).catch((err) => {
            return res.status(400).json({ error: 'Ticket creation failed' });
        });
  }

/**
 * To fetch details of ticket in html message
 * @param {*} req ticked id
 * @param {*} res genrate html msg of ticket data
 */
function ticketById(req, res) {

    let query = {}
    if( req.params && req.params.ticket_id && mongoose.Types.ObjectId.isValid(req.params.ticket_id)){
        query["_id"]= req.params && req.params.ticket_id
    }else{
        return res.status(400).json({ error: 'Invalid ticket id' });
    }
    
    Ticket.findOne(query, (err, ticketResult) => {
      if (err) {
        console.log(`error while fetching question ${err || err.stack}`);
        return res.status(400).json({ error: 'something went wrong, please try again later' });
      }else if(!ticketResult || ticketResult && ticketResult.length<1){
        return res.status(400).json({ error: 'Invalid ticket id' });
      }
      let htmlMsg=`<html><head><title> Welcome to game server</title></head><body><h1>Ticket Details</h1><p>Ticket Number : ${ticketResult["_id"]}</p><p> Game Id : ${ticketResult["game_id"]}</p><p>User Name : ${ticketResult.user_name}</p><p>Keep Playing.</p></body></html>`
      console.log("Ticket details :", htmlMsg)
      res.status(200).json({  htmlMsg });
    });
  }

/**
 *  Get unique random generated for a particular game id.
 * @param {*} req game id
 * @param {*} res return persisted random number
 */
function getRandomNumber(req, res) {
    var random_number;
    let gameQuery = {}
    if( req.params && req.params.game_id && mongoose.Types.ObjectId.isValid(req.params.game_id)){
        gameQuery["_id"]= req.params.game_id
    }else{
        return res.status(400).json({ error: 'Invalid game id' });
    }


    Game.findOne(gameQuery)
    .then((gameResults) => {
        if(!gameResults || gameResults && gameResults.length<1){
             return res.status(400).json({ error: 'Invalid game id' });
        }else{
            
            let high= gameResults.available_numbers.length
            randomIndex=Math.floor(Math.random() * (1 + high - 0)) + 0;
            random_number=gameResults.available_numbers[randomIndex]

            //To check if number available at the time of upadate to avoid duplicate
            gameQuery["available_numbers"]={ "$in": [random_number] }

            return Game.updateOne(gameQuery,{$push:{allocated_numbers:random_number},$pull:{available_numbers:random_number}})
        }
        }).then((updateResult)=>{
                if(updateResult.n && updateResult.nModified && updateResult.ok){
                    return res.status(200).json({ "Lucky Number":random_number, message: 'Number generated successfully'});
                }else{
                    return res.status(400).json({ error: 'Retry after sometime' });
                }
         })
        .catch((err) => {
            return res.status(400).json({ error: 'Number Generation Failed',err });
        });
   
  }

  /**
   * Fetch allocated numbers for the particular game from game collection.
   * @param {*} req  game_id
   * @param {*} res  numbers drawn till now
   */
  function getAllocatedNumbers(req, res) {
    var random_number;
    let gameQuery = {}
    if( req.params && req.params.game_id && mongoose.Types.ObjectId.isValid(req.params.game_id)){
        gameQuery["_id"]= req.params.game_id
    }else{
        return res.status(400).json({ error: 'Invalid game id' });
    }


    Game.findOne(gameQuery)
    .then((gameResults) => {
        if(!gameResults || gameResults && gameResults.length<1){
             return res.status(400).json({ error: 'Invalid game id' });
        }else{
             return res.status(200).json({ "Number Used":gameResults["allocated_numbers"], message: 'All numbers picked for this game until now'});
        }
        })
        .catch((err) => {
            return res.status(400).json({ error: 'Number Generation Failed',err });
        });
   
  }

  /**
   *  To provide the status of game on the basis of game id.
   * @param {*} req game_id
   * @param {*} res stats
   */
  function stats(req, res) {
     let ticketQuery = {}
     let gameQuery = {}
     if( req.params && req.params.game_id && mongoose.Types.ObjectId.isValid(req.params.game_id)){
         gameQuery["_id"]= req.params.game_id
         ticketQuery["game_id"]= req.params && req.params.game_id
     }else{
         return res.status(400).json({ error: 'Invalid game id' });
     }
 
     Promise.all([
         Game.findOne(gameQuery),
         Ticket.find(ticketQuery).count(),
         Ticket.find(ticketQuery).distinct('user_name')
         ]).then(([gameResults,ticketCount,UserCount]) => {
         if(!gameResults || gameResults && gameResults.length<1){
              return res.status(400).json({ error: 'Invalid game id' });
         }else{
             stats={"Name":gameResults.name,"Numbers drawn": gameResults.allocated_numbers,"No. of Tickets":ticketCount,
             "No. of Users":UserCount && UserCount.length
             }
             return res.status(400).json(stats);
         }
         }).catch((err) => {
             return res.status(400).json({ error: 'Ticket creation failed' });
         });
   }
  
  module.exports = {
    createGame,
    createTicket,
    ticketById,
    getRandomNumber,
    getAllocatedNumbers,
    stats
  }