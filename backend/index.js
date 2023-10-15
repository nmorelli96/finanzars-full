import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('directory-name', __dirname);
const PORT = process.env.PORT || 4000;
import mongoose from "mongoose";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

//import cors from "cors";
app.use(express.static(path.resolve(__dirname, "../build")));
//app.use(cors());

const uri = process.env.REACT_APP_MONGODB_URI;

mongoose.connect(`mongodb+srv://${uri}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

app.use("/", router);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

import { fiatModel } from "./fiatModel.js";
import banco from "./bancosModel.js";
import { binanceSellUSDT, binanceBuyUSDT, binanceSellDAI, binanceBuyDAI } from "./binanceModel.js";
import { cryptosModel } from "./cryptosModel.js";
import bcraUVA from "./bcraModel.js"

function routeAPIs(route, collection) {
  router.route(route).get(function (req, res) {
    collection.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });
}

routeAPIs("/getFiat", fiatModel);
routeAPIs("/getBancos", banco);
routeAPIs("/getBinanceUSDTs", binanceSellUSDT);
routeAPIs("/getBinanceUSDTb", binanceBuyUSDT);
routeAPIs("/getBinanceDAIs", binanceSellDAI);
routeAPIs("/getBinanceDAIb", binanceBuyDAI);
routeAPIs("/getCryptos", cryptosModel);
routeAPIs("/getUVA", bcraUVA);

router.route("/nasdaq").get(async (req, res) => {
  try {
    const result = await fetchNasdaq();
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.route("*").get( function (req, res) {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

function fetchFiat() {
  fetch("https://criptoya.com/api/dolar")
    .then((response) => response.json())
    .then((responseJson) => {
      fiatModel.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    });
}

function fetchBancos() {
  fetch("https://criptoya.com/api/bancostodos")
    .then((response) => response.json())
    .then((responseJson) => {
      banco.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) })
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    });
}

function fetchBinance(operation, coin, model) {
  fetch(`https://criptoya.com/api/binancep2p/${operation}/${coin}/ars/15`)
    .then((response) => response.json())
    .then((responseJson) => {
      let originalData = responseJson.data;
      let filteredData = originalData.find(elem =>
        elem.adv.tradeMethods[0].tradeMethodName.includes("Mercadopago") || 
        elem.adv.tradeMethods[0].tradeMethodName.includes("Lemon") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Reba") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Brubank") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Belo") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Uala"));
      //let test = filteredData.advertiser.nickName;
      //console.log(test)
      responseJson.data = filteredData;
      responseJson['trader'] = responseJson.data.advertiser.nickName;
      responseJson['tradeMethod'] = responseJson.data.adv.tradeMethods[0].tradeMethodName;
      responseJson['price'] = responseJson.data.adv.price;
      delete responseJson.data;
      model.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

function fetchCryptos() {
  return Promise.all([
    fetch('https://criptoya.com/api/belo/usdt/ars').then(resp => resp.json()),
    fetch('https://criptoya.com/api/buenbit/dai/ars').then(resp => resp.json()),
    fetch('https://criptoya.com/api/lemoncash/usdt').then(resp => resp.json()),
    fetch('https://criptoya.com/api/ripio/usdc').then(resp => resp.json()),
    fetch('https://criptoya.com/api/satoshitango/dai/ars').then(resp => resp.json()),
  ]).then((responseJson) => {
    let exchanges = ['Belo', 'Buenbit', 'Lemon', 'Ripio', 'SatoshiTango'];
    let coins = ['USDT', 'DAI', 'USDT', 'USDC', 'DAI'];
    let api = responseJson;
    let newApi = [];
    for (let i = 0; i < Object.keys(api).length; i++) {
      newApi.push({
        id: i + 3,
        banco: exchanges[i],
        coin: coins[i],
        compra: api[i].totalBid.toFixed(2),
        venta: api[i].totalAsk.toFixed(2),
        time: api[i].time
      })
    }
    let mappedJson = {
      "cryptos": newApi
    }
    cryptosModel.findOneAndReplace({}, mappedJson, { returnDocument: 'after' },
      function (err, res) { err ? console.log(err) : console.log(res) }
    )
  })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

function fetchUVA() {
  fetch('https://api.estadisticasbcra.com/uva', fetchUVAOptions)
    .then((response) => response.json())
    .then((responseJson) => {
      /*let mappedJson = responseJson.map(elem => ({
        "fecha": elem.d,
        "valor": elem.v
      }))
    */
      let lastUVA = responseJson[responseJson.length - 1];
      //console.log(lastUVA);
      let mappedJson = {
        "uva": lastUVA
        //responseJson.filter(elem => elem.d > new Date(new Date().getTime() - 86400000 - 21600000).toJSON().slice(0, 10))
      }
      /*.reduce((obj, fecha) => {
        obj[fecha.d] = fecha.v;
        return obj;
      }, {});*/
      bcraUVA.findOneAndReplace({}, mappedJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

var fetchUVAOptions = {
  method: 'GET',
  headers: {
    'Authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU0MzU5MTgsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtb3JlbGxpbmljb2xhczk2QGdtYWlsLmNvbSJ9._CuSglwVRZNdDAe6HAn-bLJOTH54nYoiLPc_kYU279MdfPm1W6LYmdb7ELtlIesE1aD2mCdnxsJU7cdqa6kvbQ'
    //'Authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTczMjczMjksInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtb3JlbGxpbmljb2xhczk2QGhvdG1haWwuY29tIn0.m8UJCXEXY4Xw92Ehb8n1dEtrnHFz-2sMvCRkNDJPz9_8EthT2iw_jyoHumLF8hY1gTpXYgxZKMKbVj7mlrDqdg'
  }
}


/* Acciones USA */

const NasdaqModel = mongoose.model('Nasdaq', {
  data: Object,
});

async function fetchNasdaq() {
  const usaList = ["AMZN", "AAPL", "GOOGL", "KO", "NIO", "COIN", "PBR", "BB", "AMD", "BABA", "DIS", "MELI", "VIST", "TSLA", "SHOP", "MSFT", "JNJ", "BBD", "INTC", "AGRO", "NKE", "NVDA", "HMY", "UPST", "VALE", "AXP", "TS", "OXY", "BRK/B", "T", "ABNB", "ARCO", "GOLD", "META", "BRFS", "PYPL", "BITF", "SE", "X", "GLOB", "PFE", "PAAS", "BAC", "SATL", "ZM", "JMIA", "CAAP", "WMT", "C", "HUT", "JPM", "ETSY", "QCOM", "XOM", "PG", "TGT", "ERJ", "MMM", "WFC", "JD", "TEF", "ITUB", "VZ", "GE", "MO", "MCD", "WBA", "HD", "AZN", "ERIC", "COST", "V", "HSY", "CDE", "CVX", "TWLO", "TSM", "SPOT", "NFLX", "SQ", "TRIP", "CAT", "TX", "CRM", "BA", "BIDU", "BG", "DOCU", "PEP", "DESP", "ADBE", "FSLR", "GM", "MU", "AAL", "UNH", "LYG", "BIOX", "MOS", "NUE", "LRCX", "RIO", "IBM", "ABBV", "SBS", "PSX", "NG", "ABEV", "UAL", "F", "UL", "GGB", "FCX", "MSTR", "AIG", "CSCO", "MA", "AMGN", "BP", "XP", "HOG", "CBD", "PHG", "SONY", "DE", "SBUX", "LMT", "UGP", "SHEL", "MRK", "CX", "USB", "SID", "SNOW", "NEM", "TXN", "GSK", "PANW", "BBVA", "ABT", "NOK", "MSI", "TMO", "DOW", "EBAY", "HON", "SPGI", "YY", "RBLX", "INFY", "FDX", "SNAP", "SAN", "ORCL", "LLY", "ADI", "TM", "GS", "DD", "BHP", "EBR", "HL", "NTES", "HAL", "VOD", "NTCO", "PKX", "AEM", "GLW", "UBER", "GPRK", "TTE", "SLB", "AMAT", "UNP", "GILD", "GFI", "WB", "RTX", "BIIB", "ELP", "PBI", "XRX", "ORAN", "HDB", "SYY", "BSBR", "TV", "EA", "HSBC", "AVY", "BK", "CL", "CAH", "AKO/B", "MDT", "E", "KMB", "SCCO", "IBN", "KB", "GRMN"];

  try {
    console.log("pre-fetch");
    const response = await fetch('https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=100&download=true', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
      },
    });
    console.log("post-fetch")

    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData && "data" in jsonData && "rows" in jsonData.data) {
        const filteredRows = jsonData.data.rows.filter(row => usaList.includes(row.symbol));
        const filteredData = {
          data: {
            asOf: null,
            headers: jsonData.data.headers,
            rows: filteredRows,
          },
        };
        return filteredData;
      } else {
        throw new Error("Invalid JSON response format");
      }
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    throw error;
  }
}

/* Acciones USA */


fetchFiat();
fetchBancos();
fetchBinance("buy", "usdt", binanceSellUSDT);
fetchBinance("sell", "usdt", binanceBuyUSDT);
fetchBinance("buy", "dai", binanceSellDAI);
fetchBinance("sell", "dai", binanceBuyDAI);
fetchCryptos();
fetchUVA();

setInterval(function () {
  fetchFiat();
  fetchBancos();
}, 300000);

setInterval(function () {
  fetchBinance("buy", "usdt", binanceSellUSDT);
  fetchBinance("sell", "usdt", binanceBuyUSDT);
  fetchBinance("buy", "dai", binanceSellDAI);
  fetchBinance("sell", "dai", binanceBuyDAI);
  fetchCryptos()
}, 300000);

setInterval(function () {
  fetchUVA();
}, 900000);