require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = require('./router');

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get('/loaderio-a10337aaa2696cf102ad6a27ad6091d4', (req, res) => {
  res.send('loaderio-a10337aaa2696cf102ad6a27ad6091d4');
});
app.use(express.static(__dirname + '/../client/build'));


app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
