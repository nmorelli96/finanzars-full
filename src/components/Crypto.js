import React from "react";
import sortComponent from "./sortComponent";
import sortIcon from "./sortIcon";

class Crypto extends React.Component {
  render() {
    const { binance, cryptos, sortCryptoConfig } = this.props;

    let sortedCryptos = [...binance].concat([...cryptos]);
    //console.log(sortedCryptos)

    sortComponent(sortCryptoConfig, sortedCryptos);

    return (
      <div>
        <div id="cryptoContainer">
          <table id="cryptoTable">
            <thead>
              <tr>
                <th colSpan={5} id="cryptoTitle">
                  Crypto
                </th>
              </tr>
              <tr id="cryptoHeader">
                <th>
                  <button
                    type="button"
                    onClick={() => this.props.sortCrypto("banco")}
                  >
                    Exchange{" "}
                    <i
                      className={` fa-solid fa-xs ${
                        sortCryptoConfig.key === "banco"
                          ? sortIcon(
                              sortCryptoConfig.key,
                              sortCryptoConfig.direction
                            )
                          : "fa-sort"
                      }`}
                    ></i>
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => this.props.sortCrypto("coin")}
                  >
                    Coin{" "}
                    <i
                      className={` fa-solid fa-xs ${
                        sortCryptoConfig.key === "coin"
                          ? sortIcon(
                              sortCryptoConfig.key,
                              sortCryptoConfig.direction
                            )
                          : "fa-sort"
                      }`}
                    ></i>
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => this.props.sortCrypto("compra")}
                  >
                    Compra{" "}
                    <i
                      className={` fa-solid fa-xs ${
                        sortCryptoConfig.key === "compra"
                          ? sortIcon(
                              sortCryptoConfig.key,
                              sortCryptoConfig.direction
                            )
                          : "fa-sort"
                      }`}
                    ></i>
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => this.props.sortCrypto("venta")}
                  >
                    Venta{" "}
                    <i
                      className={` fa-solid fa-xs ${
                        sortCryptoConfig.key === "venta"
                          ? sortIcon(
                              sortCryptoConfig.key,
                              sortCryptoConfig.direction
                            )
                          : "fa-sort"
                      }`}
                    ></i>
                  </button>
                </th>
                <th>
                  <button type="button">Hora</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCryptos.map((exchange) => (
                <tr key={exchange.id}>
                  <td class="firstCol">{exchange.banco}</td>
                  <td>{exchange.coin}</td>
                  <td>{exchange.compra}</td>
                  <td>{exchange.venta}</td>
                  <td
                    class={"lastCol"}
                    title={new Date(exchange.time * 1000).toLocaleString(
                      "es-AR"
                    )}
                    style={{
                      color:
                        new Date().getTime() - exchange.time * 1000 > 3600000
                          ? "red"
                          : "green",
                    }}
                  >
                    {new Date(exchange.time * 1000).toLocaleTimeString(
                      "es-AR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
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
