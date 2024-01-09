const express = require('express');
const router = express.Router();
const chatController = require('./controllers/chatController');

router.post('/chat/message', chatController.sendMessage);

router.get('/loaderio-a10337aaa2696cf102ad6a27ad6091d4', (req, res) => {
  res.send('loaderio-a10337aaa2696cf102ad6a27ad6091d4');
});

module.exports = router;
