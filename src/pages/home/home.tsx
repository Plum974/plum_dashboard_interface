import React from "react";
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

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* Section des compteurs */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <SearchCounter />
        <OrderConfirmedCounter />
        <OrderCancelled />
        <CustomerConfirmedCounter />
        <FliiinkerRefuseCounter />
        <RealtimeClaimComponentCounter />
      </div>

      {/* Section des graphiques */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Graphique 1: Évolution des commandes */}
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "400px",
            maxWidth: "500px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
            Évolution des commandes
          </h3>
          <OrderEvolutionBarChart />
        </div>

        {/* Graphique 2: Recherches et commandes */}
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "400px",
            maxWidth: "500px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
            Recherches et commandes
          </h3>
          <SearchAndOrdersChart />
        </div>

        {/* Graphique 3: Réclamations et commandes */}
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "400px",
            maxWidth: "500px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
            Réclamations et commandes
          </h3>
          <ClaimAndOrderChart />
        </div>
      </div>
    </div>
  );
};
