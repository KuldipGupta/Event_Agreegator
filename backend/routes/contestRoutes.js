const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/codeforces", async (req, res) => {
  try {
    const url = "https://codeforces.com/api/contest.list?gym=false";
    const response = await axios.get(url);
    const upcoming = response.data.result
      .filter(c => c.phase === "BEFORE")
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        start: new Date(c.startTimeSeconds * 1000).toLocaleString(),
        duration: `${Math.floor(c.durationSeconds / 3600)} hrs`,
        site: "Codeforces",
        link: `https://codeforces.com/contests/${c.id}`
      }));
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Codeforces events" });
  }
});

router.get("/leetcode", async (req, res) => {
  try {
    const url = "https://leetcode.com/contest/";
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    const data = [];

    $(".text-label-1").each((i, el) => {
      const title = $(el).text().trim();
      const time = $(el).parent().next().text().trim();
      if (title && time && i < 3) {
        data.push({
          name: title,
          start: time,
          site: "LeetCode",
          link: "https://leetcode.com/contest/"
        });
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching LeetCode events" });
  }
});

router.get("/codechef", async (req, res) => {
  try {
    const url = "https://www.codechef.com/contests/";
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    const data = [];

    $("table.dataTable tbody tr").each((i, el) => {
      const tds = $(el).find("td");
      const name = $(tds[0]).text().trim();
      const start = $(tds[1]).text().trim();
      const link = `https://www.codechef.com/${$(tds[0]).find("a").attr("href")}`;

      if (name && i < 5) {
        data.push({
          name,
          start,
          site: "CodeChef",
          link
        });
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching CodeChef events" });
  }
});

module.exports = router;
