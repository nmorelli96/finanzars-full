import React from "react";
import logo from "../../public/logo.png";

class Fiat extends React.Component {
  // console.log(props);
  render() {
    const { fiat, uva } = this.props;

    return (
      <div id="fiatContainer">
        <table id="fiatTable">
          <thead>
            <tr>
              <th colSpan={2} id="fiatTitle">
                FinanzARS <img id="logo" alt="logo" src={logo} height={22}></img>
              </th>
            </tr>
            <tr id="fiatHeader">
              <th
                title={new Date(fiat.time * 1000).toLocaleString("es-AR")}
                id={"fiatClock"}
                style={{
                  color:
                    new Date().getTime() - fiat.time * 1000 > 3600000
                      ? "red"
                      : "white",
                  fontWeight: "500",
                  fontSize: "1.05em",
                }}
              >
                {new Date(fiat.time * 1000).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </th>
              <th>
                <button style={{ cursor: "default" }}>Venta</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oficial</td>
              <td>{fiat.oficial.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Solidario</td>
              <td>{fiat.solidario.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Blue</td>
              <td>{fiat.blue.toFixed(2)}</td>
            </tr>
            <tr>
              <td>MEP</td>
              <td>{fiat.mep.toFixed(2)}</td>
            </tr>
            <tr>
              <td>CCL</td>
              <td>{fiat.ccl.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="divider"></td>
            </tr>
            <tr>
              <td>UVA</td>
              <td>{uva.v}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Fiat;
