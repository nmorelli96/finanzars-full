import React from 'react';
import sortComponent from './sortComponent';

class Crypto extends React.Component {
	render() {

		const {
			binance,
			cryptos,
			sortCryptoConfig
		} = this.props;

		let sortedCryptos = [...binance].concat([...cryptos])
		//console.log(sortedCryptos)

		sortComponent(sortCryptoConfig, sortedCryptos);

		return (
			<div>
				<div id="cryptoContainer">
					<div id="cryptoTitle">Crypto</div>
					<table id="cryptoTable">
						<thead>
							<tr id="cryptoHeader">
								<th>
									<button type="button" onClick={() => this.props.sortCrypto('banco')}>
										Exchange <i class="fa-solid fa-sort fa-xs"></i>
									</button>
								</th>
								<th>
									<button type="button" onClick={() => this.props.sortCrypto('coin')}>
										Coin <i class="fa-solid fa-sort fa-xs"></i>
									</button>
								</th>
								<th>
									<button type="button" onClick={() => this.props.sortCrypto('compra')}>
										Compra <i class="fa-solid fa-sort fa-xs"></i>
									</button>
								</th>
								<th>
									<button type="button" onClick={() => this.props.sortCrypto('venta')}>
										Venta <i class="fa-solid fa-sort fa-xs"></i>
									</button>
								</th>
								<th>
									<button type="button">
										Hora
									</button>
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedCryptos.map(exchange => (
								<tr key={exchange.id}>
									<td class="firstCol">{exchange.banco}</td>
									<td>{exchange.coin}</td>
									<td>{exchange.compra}</td>
									<td>{exchange.venta}</td>
									<td class={"lastCol"}
										title={new Date(exchange.time * 1000).toLocaleString('es-AR')}
										style={{ color: new Date().getTime() - (exchange.time * 1000) > 3600000 ? 'red' : 'green' }}>
										{new Date(exchange.time * 1000).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Crypto;