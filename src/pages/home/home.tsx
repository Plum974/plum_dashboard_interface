import React, { useContext } from "react";
import GlobeComponent from "../../components/globe/globeComponent";
import { CustomerConfirmedCounter } from "../../components/linking/customerConfirmedCounter";
import { FliiinkerRefuseCounter } from "../../components/linking/fliiinkerRefuseCounter";
import OrderCancelled from "../../components/orderAnalytics/orderCancelledCounter";
import OrderConfirmedCounter from "../../components/orderAnalytics/orderConfirmedCounter";
import SearchCounter from "../../components/searchAnalytics/searchCounter";
import "../../styles/home.css";
import OrderEvolutionBarChart from "../../components/orderAnalytics/allOrderComponent";
import SearchAndOrdersChart from "../../components/searchAnalytics/searchAndOrdersChart";
import ClaimAndOrderChart from "../../components/claimAnalytics/claimAndOrderChart";
import LocationMapPage from "../map/locationMapPage";
import RealtimeClaimComponentCounter from "../../components/claim/RealtimeClaimComponent";
import { ColorModeContext } from "../../contexts/color-mode";

export const HomePage: React.FC = () => {
  const { mode } = useContext(ColorModeContext);

  return (
    <div>
      {/* Section des compteurs */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <CustomerConfirmedCounter />
        <FliiinkerRefuseCounter />
        <OrderConfirmedCounter />
        <SearchCounter />
        <RealtimeClaimComponentCounter />
      </div>

      {/* Section des graphiques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          width: "100%",
          marginTop: "20px",
        }}
      >
        {/* Graphique 1: Évolution des commandes */}
        <div
          style={{
            backgroundColor: mode === "dark" ? "#1f1f1f" : "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              textAlign: "center",
              color: mode === "dark" ? "#fff" : "#000",
              flexShrink: 0,
            }}
          >
            Évolution des commandes
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <OrderEvolutionBarChart />
          </div>
        </div>

        {/* Graphique 2: Recherches et commandes */}
        <div
          style={{
            backgroundColor: mode === "dark" ? "#1f1f1f" : "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              textAlign: "center",
              color: mode === "dark" ? "#fff" : "#000",
              flexShrink: 0,
            }}
          >
            Recherches et commandes
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SearchAndOrdersChart />
          </div>
        </div>

        {/* Graphique 3: Réclamations et commandes */}
        <div
          style={{
            backgroundColor: mode === "dark" ? "#1f1f1f" : "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              textAlign: "center",
              color: mode === "dark" ? "#fff" : "#000",
              flexShrink: 0,
            }}
          >
            Réclamations et commandes
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ClaimAndOrderChart />
          </div>
        </div>
      </div>
    </div>
  );
};
