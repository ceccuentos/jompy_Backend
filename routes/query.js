
const {Router} = require('express');
const { readQuery } = require('../controllers/query')
const router = Router();

router.route('/').get(readQuery)


module.exports = router