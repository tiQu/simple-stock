//=============================
// REQUIRE
//=============================
const dotenv = require("dotenv")
dotenv.config()
const { connectDb } = require("./models/db")
const mongoose = require("mongoose")
const User = require("./models/Users")
const Transaction = require("./models/Transactions")
const Stock = require("./models/Stocks")

//=============================
// CONFIG
//=============================
// Connect to db
connectDb()

//=============================
// Seed DB
//=============================

const seedDb = async () => {
  await User.deleteMany({})
  await Transaction.deleteMany({})
  await Stock.deleteMany({})
  console.log("seeding users")

  // Create new users
  //-------------------
  let user1 = new User({
    email: "mahboiruss@gmail.com",
    username: "russ",
    initialCash: 50000,
    transactions: [],
  })
  let user2 = new User({
    email: "mahsistagabi@gmail.com",
    username: "gabi",
    initialCash: 50000,
    transactions: [],
  })
  let user3 = new User({
    email: "mahmantony@gmail.com",
    username: "tony",
    initialCash: 50000,
    transactions: [],
  })

  // Save/Register Users
  //-------------------
  await User.register(user1, "password")
  await User.register(user2, "password")
  await User.register(user3, "password")

  // Create transactions
  //-------------------
  let transaction1 = new Transaction({
    symbol: "AAPL",
    numShares: 31,
    quotePrice: -206.1,
    transactionDateTime: 1596589501,
  })

  let transaction2 = new Transaction({
    symbol: "TSLA",
    numShares: 325,
    quotePrice: -1.1,
    transactionDateTime: 1596589520,
  })

  let transaction3 = new Transaction({
    symbol: "TSLA",
    numShares: 325,
    quotePrice: 362.1,
    transactionDateTime: 1617145438869,
  })

  let transaction4 = new Transaction({
    symbol: "GME",
    numShares: 30,
    quotePrice: -200,
    transactionDateTime: 1617145438869,
  })

  let transaction5 = new Transaction({
    symbol: "GME",
    numShares: 24,
    quotePrice: 15.1,
    transactionDateTime: 1617145438869,
  })

  let transaction6 = new Transaction({
    symbol: "GME",
    numShares: 2,
    quotePrice: -190,
    transactionDateTime: 1617145438869,
  })

  // Create Stocks (to watch)
  //-------------------
  let stock1 = new Stock({
    symbol: "GOOGL",
    currentPrice: 2200,
  })

  let stock2 = new Stock({
    symbol: "KOPN",
    currentPrice: 350,
  })

  let stock3 = new Stock({
    symbol: "KIRK",
    currentPrice: 67,
  })

  let stock4 = new Stock({
    symbol: "BGFV",
    currentPrice: 89,
  })

  // Save stocks
  //-------------------
  await stock1.save()
  await stock2.save()
  await stock3.save()
  await stock4.save()

  // Save transactions
  //-------------------
  await transaction1.save()
  await transaction2.save()
  await transaction3.save()
  await transaction4.save()
  await transaction5.save()
  await transaction6.save()

  // Push transactions to users
  //-------------------
  await User.updateOne(
    { _id: user1 },
    {
      $push: {
        transactions: transaction1,
        watchlist: {
          $each: [stock1, stock2],
        },
      },
    }
  )

  await User.updateOne(
    { _id: user2 },
    {
      $push: {
        transactions: {
          $each: [transaction2, transaction3],
        },
        watchlist: {
          $each: [stock3, stock4],
        },
      },
    }
  )


  await User.updateOne(
    { _id: user3 },
    {
      $push: {
        transactions: {
          $each: [transaction1, transaction2, transaction3, transaction4, transaction5, transaction6],
        },
        watchlist: {
          $each: [stock1, stock4],
        },
      },
    }
  )

  // Update Money of each user
  //-------------------
  user1.initialCash += transaction1.numShares * transaction1.quotePrice
  user2.initialCash += transaction2.numShares * transaction2.quotePrice
  user2.initialCash += transaction3.numShares * transaction3.quotePrice
  user3.initialCash += transaction1.numShares * transaction1.quotePrice
  user3.initialCash += transaction2.numShares * transaction2.quotePrice
  user3.initialCash += transaction3.numShares * transaction3.quotePrice
  user3.initialCash += transaction4.numShares * transaction4.quotePrice
  user3.initialCash += transaction5.numShares * transaction5.quotePrice
  user3.initialCash += transaction6.numShares * transaction6.quotePrice
  await user1.save()
  await user2.save()
  await user3.save()
}

;(async () => {
  await seedDb()
  mongoose.connection.close()
})()
