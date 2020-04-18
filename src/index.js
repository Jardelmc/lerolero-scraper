require("dotenv").config();
const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const mongoose = require("mongoose");
const database = require("./database");

const PhraseSchema = mongoose.Schema(
  {
    phrase: {
      type: String,
    },
    used: Boolean,
  },
  { collection: "lerolero_phrases" }
);

const PhraseMongo = new mongoose.model("PhraseMongo", PhraseSchema);

const screen = {
  width: 640,
  height: 480,
};

async function BuildDriver(celOwner) {
  const options = new chrome.Options();

  options.addArguments("-disable-popup-blocking");

  const driver = await new selenium.Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();

  return driver;
}

async function startScrap() {
  const driver = await BuildDriver();

  await driver.get("https://lerolero.com");

  return driver;
}

function init(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function sleep(ms) {
  await init(ms);
}

async function scraper(driver) {
  const allPhrasesDatabase = await PhraseMongo.find();

  let allPhrases = [];

  allPhrasesDatabase.forEach((frase) => {
    allPhrases.push(frase.phrase);
  });

  let count = allPhrases.length;
  while (true) {
    try {
      const sitePhrase = driver
        .findElement(selenium.By.className("sentence-exited"))
        .getText();

      sitePhrase.then((text) => {
        if (!allPhrases.includes(text)) {
          PhraseMongo.create({ phrase: text, used: false });
          count += 1;
          console.log(`Frases adicionadas: ${count}`);

          allPhrases.push(text);
        }
      });

      driver.findElement(selenium.By.id("gerar-frase")).click();

      await sleep(3000);
    } catch (error) {
      console.log(error);

      await sleep(3000);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////

async function getDriver() {
  const driver = await startScrap();

  return driver;
}

const driver = getDriver().then((driver) => {
  scraper(driver);
});
