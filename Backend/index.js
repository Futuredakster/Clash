const express = require("express");
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());
const db = require("./models");


const postRouter= require("./routes/tournaments");
app.use("/tournaments",postRouter );

const usersRouter= require("./routes/users");
app.use("/users",usersRouter );

const accountsRouter= require("./routes/accounts");
app.use("/accounts",accountsRouter );





db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
// So every time the serve starts we read through the models folder and make sure
// we have every table in the folder and if not we make them in the database.