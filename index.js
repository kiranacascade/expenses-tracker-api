const express = require("express")
const PORT = 2000;
const app = express();
// biar express bisa baca format json
app.use(express.json())
const {expensesRouter} = require("./routes/index")


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

app.use("/expenses", expensesRouter)