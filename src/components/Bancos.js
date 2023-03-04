import React from "react";
import sortComponent from "./sortComponent";
import sortIcon from "./sortIcon";

class Bancos extends React.Component {
  render() {
    const { bancos } = this.props;

    const { sortBancosConfig } = this.props;

    let sortedBancos = [...bancos];

    sortComponent(sortBancosConfig, sortedBancos);

    return (
      <div id="bancosContainer">
        <table id="bancosTable">
          <thead>
            <tr><th colSpan={5} id="bancosTitle">Bancos</th></tr>
            <tr id="bancosHeader">
              <th>
                <button
                  type="button"
                  onClick={() => this.props.sortBancos("banco")}
                >
                  Entidad{" "}
                  <i
                    className={` fa-solid fa-xs ${
                      sortBancosConfig.key === "banco"
                        ? sortIcon(
                            sortBancosConfig.key,
                            sortBancosConfig.direction
                          )
                        : "fa-sort"
                    }`}
                  ></i>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => this.props.sortBancos("compra")}
                >
                  Compra{" "}
                  <i
                    className={` fa-solid fa-xs ${
                      sortBancosConfig.key === "compra"
                        ? sortIcon(
                            sortBancosConfig.key,
                            sortBancosConfig.direction
                          )
                        : "fa-sort"
                    }`}
                  ></i>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => this.props.sortBancos("venta")}
                >
                  Venta{" "}
                  <i
                    className={` fa-solid fa-xs ${
                      sortBancosConfig.key === "venta"
                        ? sortIcon(
                            sortBancosConfig.key,
                            sortBancosConfig.direction
                          )
                        : "fa-sort"
                    }`}
                  ></i>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => this.props.sortBancos("ventaTot")}
                >
                  V+65%{" "}
                  <i
                    className={` fa-solid fa-xs ${
                      sortBancosConfig.key === "ventaTot"
                        ? sortIcon(
                            sortBancosConfig.key,
                            sortBancosConfig.direction
                          )
                        : "fa-sort"
                    }`}
                  ></i>
                </button>
              </th>
              <th>
                <button style={{ cursor: "default" }}>Hora</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBancos.map((banco) => (
              <tr key={banco.id}>
                <td class="firstCol">{banco.banco}</td>
                <td>{banco.compra.toFixed(2)}</td>
                <td>{banco.venta.toFixed(2)}</td>
                <td>{banco.ventaTot.toFixed(2)}</td>
                <td
                  class={"lastCol"}
                  title={new Date(banco.time * 1000).toLocaleString("es-AR")}
                  style={{
                    color:
                      new Date().getTime() - banco.time * 1000 > 3600000
                        ? "red"
                        : "green",
                  }}
                >
                  {new Date(banco.time * 1000).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {/*, {new Date(banco.time * 1000).toLocaleDateString('es-AR')}*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Bancos;
