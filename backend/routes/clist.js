const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIST_USERNAME = process.env.CLIST_USERNAME;
const CLIST_API_KEY = process.env.CLIST_API_KEY;

router.get('/contests', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const url = `https://clist.by/api/v4/contest/?username=${CLIST_USERNAME}&api_key=${CLIST_API_KEY}&start__gte=${start}&start__lte=${end}&order_by=start`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('CLIST API error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch contests', error: err.message });
  }
});

module.exports = router;