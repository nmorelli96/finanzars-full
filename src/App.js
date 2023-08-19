import React from "react";
import "./App.css";
import Fiat from "./components/Fiat.js";
import Bancos from "./components/Bancos.js";
import Crypto from "./components/Crypto.js";
//import axios from "axios";

// Set the name of the hidden property and the change event for visibility

let binance = [];
let binanceDAI = {};
let binanceUSDT = {};
//let fetchDomain = "http://localhost:4000";
//let fetchDomain = "https://uotjln-4000.preview.csb.app";
let fetchDomain = "https://finanzars-dolar.onrender.com";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fiat: { "oficial": 0, "solidario": 0, "blue": 0, "ccb": 0, "mep": 0, "ccl": 0, "mepgd30": 0, "cclgd30": 0, "time": 0 },
			bancos: [],
			binance: [],
			cryptos: [],
			uva: { "d": "0", "v": 0 },
			sortBancosConfig: { key: 'ventaTot', direction: 'ascending' },
			sortCryptoConfig: { key: 'venta', direction: 'ascending' }
		};

		this.sortBancos = this.sortBancos.bind(this);
		this.sortCrypto = this.sortCrypto.bind(this);
	}

	componentDidMount() {
		document.addEventListener("DOMContentLoaded", this.loadAPIs());
		document.addEventListener("DOMContentLoaded", this.reloadPage(5));
	}

	loadAPIs() {
		this.getFiatFromAPI();
		this.getBancosFromAPI();
		this.getBinanceP2PFromAPI("getBinanceUSDTs", "USDT", "buy");
		this.getBinanceP2PFromAPI("getBinanceUSDTb", "USDT", "sell")
		this.getBinanceP2PFromAPI("getBinanceDAIs", "DAI", "buy");
		this.getBinanceP2PFromAPI("getBinanceDAIb", "DAI", "sell");
		this.getCryptosFromAPIs();
		this.getUVAFromApi();
	}

	getFiatFromAPI() {
		return fetch(`${fetchDomain}/getFiat`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState((state) => ({
					fiat: responseJson[0]
				}));
				//console.log(this.state);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getBancosFromAPI() {
		return fetch(`${fetchDomain}/getBancos`)
			.then((response) => response.json())
			.then((responseJson) => {
				responseJson[0]["Balanz"] = responseJson[0]["balanz"];
        delete responseJson[0]["balanz"];
				responseJson[0]["Hipotecario"] = responseJson[0]["hipotecario"];
        delete responseJson[0]["hipotecario"];
        responseJson[0]["ICBC"] = responseJson[0]["icbc"];
        delete responseJson[0]["icbc"];
        responseJson[0]["Supervielle"] = responseJson[0]["supervielle"];
        delete responseJson[0]["supervielle"];
        responseJson[0]["Brubank"] = responseJson[0]["brubank"];
        delete responseJson[0]["brubank"];
        responseJson[0]["Ciudad"] = responseJson[0]["ciudad"];
        delete responseJson[0]["ciudad"];
        responseJson[0]["Provincia"] = responseJson[0]["bapro"];
        delete responseJson[0]["bapro"];
        responseJson[0]["HSBC"] = responseJson[0]["hsbc"];
        delete responseJson[0]["hsbc"];
        responseJson[0]["Macro"] = responseJson[0]["macro"];
        delete responseJson[0]["macro"];
        responseJson[0]["Patagonia"] = responseJson[0]["patagonia"];
        delete responseJson[0]["patagonia"];
        responseJson[0]["BBVA"] = responseJson[0]["bbva"];
        delete responseJson[0]["bbva"];
        responseJson[0]["Galicia"] = responseJson[0]["galicia"];
        delete responseJson[0]["galicia"];
        responseJson[0]["Santander"] = responseJson[0]["santander"];
        delete responseJson[0]["santander"];
        responseJson[0]["Reba"] = responseJson[0]["rebanking"];
        delete responseJson[0]["rebanking"];
        responseJson[0]["Nación"] = responseJson[0]["bna"];
        delete responseJson[0]["bna"];
        responseJson[0]["CambioAR"] = responseJson[0]["cambioar"];
        delete responseJson[0]["cambioar"];
        responseJson[0]["Plus"] = responseJson[0]["plus"];
        delete responseJson[0]["plus"];
				//console.log(responseJson)
				let api = responseJson[0];
				let keyValue = Object.keys(api);
				let newApi = [];
				for (let i = 0; i < Object.keys(api).length; i++) {
					newApi.push({
						id: i + 1,
						banco: keyValue[i],
						compra: api[keyValue[i]].bid,
						venta: api[keyValue[i]].totalAsk / 1.75,
						ventaTot: api[keyValue[i]].totalAsk,
						time: api[keyValue[i]].time
					})
				}
				let filteredApi = newApi.filter(elem => elem.time * 1000 > ((new Date().getTime()) - 432000000))
				//console.log(filteredApi);
				this.setState((state) => ({
					bancos: filteredApi
				}));
				//console.log(this.state);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getBinanceP2PFromAPI(route, coin, operation) {
		return fetch(`${fetchDomain}/${route}`)
			.then((response) => response.json())
			.then((responseJson) => {
				//let api = responseJson[0].data;
				let time = responseJson[0].time;
				/*let keyValue = Object.keys(api);
				let newApi = []
				for (let i = 0; i < Object.keys(api).length; i++) {
					newApi.push({
						id: i,
						trader: api[keyValue[i]].advertiser.nickName,
						tradeType: operation,
						//traderTipo: api[keyValue[i]].advertiser.userType,
						metodo: api[keyValue[i]].adv.tradeMethods["0"].tradeMethodName,
						precio: api[keyValue[i]].adv.price,
						coin: coin,
						time: time
					})
				}
				let filteredApi = newApi.find(elem => !elem.metodo.includes("Cash") && !elem.metodo.includes("Wise"))
				*/
				if (coin === 'USDT') {
					binanceUSDT['id'] = 1;
					binanceUSDT['banco'] = "Binance P2P";
					binanceUSDT['coin'] = coin;
					binanceUSDT['time'] = new Date(time);
					if (operation === 'buy') {
						binanceUSDT['venta'] = responseJson[0].price
					} else if (operation === 'sell') {
						binanceUSDT['compra'] = responseJson[0].price
					}
				} else if (coin === 'DAI') {
					binanceDAI['id'] = 2;
					binanceDAI['banco'] = "Binance P2P";
					binanceDAI['coin'] = coin;
					binanceDAI['time'] = new Date(time);
					if (operation === 'buy') {
						binanceDAI['venta'] = responseJson[0].price
					} else if (operation === 'sell') {
						binanceDAI['compra'] = responseJson[0].price
					}
				}
				//console.log(binanceUSDT)
				if (binance.length < 2) {
					binance.push(binanceUSDT);
					binance.push(binanceDAI);
				}
				//console.log(binance)

				this.setState((state) => ({
					binance: binance
				}));
				//console.log(newApi);
				//console.log(filteredApi);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getCryptosFromAPIs() {
		return fetch(`${fetchDomain}/getCryptos`)
			.then((response) => response.json())
			.then((responseJson) => {
				let api = responseJson[0].cryptos
				this.setState((state) => ({
					cryptos: api
				}));
				//console.log(api)
				//console.log(this.state);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getUVAFromApi() {
		return fetch(`${fetchDomain}/getUVA`)
			.then((response) => response.json())
			.then((responseJson) => {
				let api = responseJson[0].uva[0]
				this.setState((state) => ({
					uva: api
				}));
				//console.log(api)
				//console.log(this.state);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	sortBancos(by) {
		if (this.state.sortBancosConfig.key === by && this.state.sortBancosConfig.direction === 'ascending') {
			this.setState({
				sortBancosConfig: { key: by, direction: 'descending' }
			})
		} else {
			this.setState({
				sortBancosConfig: { key: by, direction: 'ascending' }
			})
		}
	}


	sortCrypto(by) {
		if (this.state.sortCryptoConfig.key === by && this.state.sortCryptoConfig.direction === 'ascending') {
			this.setState({
				sortCryptoConfig: { key: by, direction: 'descending' }
			})
		} else {
			this.setState({
				sortCryptoConfig: { key: by, direction: 'ascending' }
			})
		}
	}

	reloadPage(minutes) {
		window.setTimeout(function () {
			//window.location.reload();
			window.location.href = window.location.href;
		}, minutes * 60000);
	}

	render() {
		return (
			<div id="app-container">

				<Fiat
					fiat={this.state.fiat}
					uva={this.state.uva} />

				<Bancos
					bancos={this.state.bancos}
					sortBancosConfig={this.state.sortBancosConfig}
					sortBancos={this.sortBancos} />

				<Crypto
					binance={this.state.binance}
					cryptos={this.state.cryptos}
					sortCryptoConfig={this.state.sortCryptoConfig}
					sortCrypto={this.sortCrypto} />

			</div>
		);
	}
}

export default App;
