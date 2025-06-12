import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ADMIN_API = process.env.REACT_APP_ADMIN_API;
const SAPI_API = process.env.REACT_APP_SAPI_API;
const PET_API = process.env.REACT_APP_PET_API;
const TRX_API = "http://localhost:8003/"; // Ganti jika ada service transaksi

const Dashboard = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [peternakCount, setPeternakCount] = useState(0);
  const [sapiCount, setSapiCount] = useState(0);
  const [trxCount, setTrxCount] = useState(0);

  useEffect(() => {
    // Admin
    fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            admins { id }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const admins = result.data.admins || [];
        setAdminCount(admins.length);
      });

    // Peternak
    fetch(PET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            peternaks { id }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const peternaks = result.data.peternaks || [];
        setPeternakCount(peternaks.length);
      });

    // Sapi
    fetch(SAPI_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            sapis { id }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const sapis = result.data.sapis || [];
        setSapiCount(sapis.length);
      });

    // Transaksi (jika ada service transaksi)
    fetch(TRX_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            transactions { id }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const trxs = result.data.transactions || [];
        setTrxCount(trxs.length);
      })
      .catch(() => setTrxCount(0));
  }, []);

  // Chart data: hanya satu bar per chart
  const adminChartData = {
    labels: ["Admin"],
    datasets: [
      {
        label: "Total Admin",
        data: [adminCount],
        backgroundColor: "#1976d2",
      },
    ],
  };

  const sapiChartData = {
    labels: ["Sapi"],
    datasets: [
      {
        label: "Total Sapi",
        data: [sapiCount],
        backgroundColor: "#16a085",
      },
    ],
  };

  const peternakChartData = {
    labels: ["Peternak"],
    datasets: [
      {
        label: "Total Peternak",
        data: [peternakCount],
        backgroundColor: "#f39c12",
      },
    ],
  };

  const trxChartData = {
    labels: ["Transaksi"],
    datasets: [
      {
        label: "Total Transaksi",
        data: [trxCount],
        backgroundColor: "#e74c3c",
      },
    ],
  };

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-label">Total Admin</div>
          <div className="dashboard-card-value">{adminCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-label">Total Peternak</div>
          <div className="dashboard-card-value">{peternakCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-label">Total Sapi</div>
          <div className="dashboard-card-value">{sapiCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-label">Total Transaksi</div>
          <div className="dashboard-card-value">{trxCount}</div>
        </div>
      </div>
      <div className="dashboard-charts-row">
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">Total Admin</h3>
          <Bar data={adminChartData} options={{ indexAxis: "y" }} />
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">Total Sapi</h3>
          <Bar data={sapiChartData} options={{ indexAxis: "y" }} />
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">Total Peternak</h3>
          <Bar data={peternakChartData} options={{ indexAxis: "y" }} />
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">Total Transaksi</h3>
          <Bar data={trxChartData} options={{ indexAxis: "y" }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
