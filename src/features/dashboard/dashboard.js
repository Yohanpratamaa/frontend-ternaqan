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
const TRX_API = process.env.REACT_APP_TRANSACTIONS_API;

const Dashboard = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [peternakCount, setPeternakCount] = useState(0);
  const [sapiCount, setSapiCount] = useState(0);
  const [trxCount, setTrxCount] = useState(0);
  const [trxPendingCount, setTrxPendingCount] = useState(0);
  const [trxCompletedCount, setTrxCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Admin data
        const adminResponse = await fetch(ADMIN_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                admins { id }
              }
            `,
          }),
        });

        if (adminResponse.ok) {
          const adminResult = await adminResponse.json();
          const admins = adminResult.data?.admins || [];
          setAdminCount(admins.length);
        } else {
          console.error("Failed to fetch admin data");
          setAdminCount(0);
        }

        // Fetch Peternak data
        const peternakResponse = await fetch(PET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                peternaks { id }
              }
            `,
          }),
        });

        if (peternakResponse.ok) {
          const peternakResult = await peternakResponse.json();
          const peternaks = peternakResult.data?.peternaks || [];
          setPeternakCount(peternaks.length);
        } else {
          console.error("Failed to fetch peternak data");
          setPeternakCount(0);
        }

        // Fetch Sapi data
        const sapiResponse = await fetch(SAPI_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                sapis { id }
              }
            `,
          }),
        });

        if (sapiResponse.ok) {
          const sapiResult = await sapiResponse.json();
          const sapis = sapiResult.data?.sapis || [];
          setSapiCount(sapis.length);
        } else {
          console.error("Failed to fetch sapi data");
          setSapiCount(0);
        }

        // PERBAIKAN: Fetch Vendor Transactions data dengan query yang benar
        if (TRX_API) {
          const trxResponse = await fetch(TRX_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query {
                  vendorTransactionsAll {
                    id
                    status
                    livestock_type
                    total
                    vendor_id
                    vendor_name
                  }
                }
              `,
            }),
          });

          if (trxResponse.ok) {
            const trxResult = await trxResponse.json();
            console.log("Dashboard TRX Response:", trxResult); // Debug log

            if (trxResult.data && trxResult.data.vendorTransactionsAll) {
              const transactions = trxResult.data.vendorTransactionsAll;

              // Total transaksi
              setTrxCount(transactions.length);

              // Hitung berdasarkan status
              const pendingTransactions = transactions.filter(
                (trx) => trx.status?.toLowerCase() === "belum"
              );
              const completedTransactions = transactions.filter(
                (trx) => trx.status?.toLowerCase() === "sudah"
              );

              setTrxPendingCount(pendingTransactions.length);
              setTrxCompletedCount(completedTransactions.length);

              console.log("Dashboard transaction counts:", {
                total: transactions.length,
                pending: pendingTransactions.length,
                completed: completedTransactions.length,
              });
            } else {
              console.log("No vendor transactions data found");
              setTrxCount(0);
              setTrxPendingCount(0);
              setTrxCompletedCount(0);
            }
          } else {
            console.error("Failed to fetch transactions:", trxResponse.status);
            setTrxCount(0);
            setTrxPendingCount(0);
            setTrxCompletedCount(0);
          }
        } else {
          console.log("TRX_API not configured");
          setTrxCount(0);
          setTrxPendingCount(0);
          setTrxCompletedCount(0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);

        // Set default values on error
        setAdminCount(0);
        setPeternakCount(0);
        setSapiCount(0);
        setTrxCount(0);
        setTrxPendingCount(0);
        setTrxCompletedCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // PERBAIKAN: Chart data dengan styling yang lebih baik
  const adminChartData = {
    labels: ["Admin"],
    datasets: [
      {
        label: "Total Admin",
        data: [adminCount],
        backgroundColor: "#1abc9c",
        borderColor: "#16a085",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 100, // Mengatur lebar bar secara eksplisit
        maxBarThickness: 80, // Batas maksimal lebar bar
      },
    ],
  };

  const sapiChartData = {
    labels: ["Sapi"],
    datasets: [
      {
        label: "Total Sapi",
        data: [sapiCount],
        backgroundColor: "#3498db",
        borderColor: "#2980b9",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 100,
        maxBarThickness: 80,
      },
    ],
  };

  const peternakChartData = {
    labels: ["Peternak"],
    datasets: [
      {
        label: "Total Peternak",
        data: [peternakCount],
        backgroundColor: "#2c3e50",
        borderColor: "#34495e",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 100,
        maxBarThickness: 80,
      },
    ],
  };

  // PERBAIKAN: Chart data untuk transaksi dengan breakdown status
  const trxChartData = {
    labels: ["Pending", "Completed", "Total"],
    datasets: [
      {
        label: "Transaksi",
        data: [trxPendingCount, trxCompletedCount, trxCount],
        backgroundColor: ["#f39c12", "#27ae60", "#9b59b6"],
        borderColor: ["#e67e22", "#229954", "#8e44ad"],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 100,
        maxBarThickness: 60,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            weight: "500",
          },
        },
        // Alternatif: mengatur lebar bar melalui categoryPercentage dan barPercentage
        categoryPercentage: 0.8, // Persentase lebar kategori (0.0 - 1.0)
        barPercentage: 0.9, // Persentase lebar bar dalam kategori (0.0 - 1.0)
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  // ...existing code...

  if (loading) {
    return (
      <div className="dashboard-root">
        <h2 className="dashboard-title">Dashboard</h2>

        {/* PERBAIKAN: Loading state yang lebih baik */}
        <div className="dashboard-loading-wrapper">
          <div className="dashboard-loading-content">
            <div className="dashboard-loading-spinner"></div>
            <div className="dashboard-loading-text">
              Memuat data dashboard...
            </div>
            <div className="dashboard-loading-subtext">
              Mengambil data dari semua modul
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ...existing code...

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: "linear-gradient(135deg, #fee, #fcc)",
            color: "#c33",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fcc",
            textAlign: "center",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">👥</div>
          <div className="dashboard-card-label">Total Admin</div>
          <div className="dashboard-card-value">{adminCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">🧑‍🌾</div>
          <div className="dashboard-card-label">Total Peternak</div>
          <div className="dashboard-card-value">{peternakCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">🐄</div>
          <div className="dashboard-card-label">Total Sapi</div>
          <div className="dashboard-card-value">{sapiCount}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">📊</div>
          <div className="dashboard-card-label">Total Transaksi</div>
          <div className="dashboard-card-value">{trxCount}</div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#7f8c8d",
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Pending: {trxPendingCount}</span>
            <span>Selesai: {trxCompletedCount}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Charts */}
      <div className="dashboard-charts-row">
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">
            <span style={{ marginRight: "8px" }}>👥</span>
            Total Admin
          </h3>
          <div style={{ height: "250px" }}>
            <Bar data={adminChartData} options={chartOptions} />
          </div>
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">
            <span style={{ marginRight: "8px" }}>🐄</span>
            Total Sapi
          </h3>
          <div style={{ height: "250px" }}>
            <Bar data={sapiChartData} options={chartOptions} />
          </div>
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">
            <span style={{ marginRight: "8px" }}>🧑‍🌾</span>
            Total Peternak
          </h3>
          <div style={{ height: "250px" }}>
            <Bar data={peternakChartData} options={chartOptions} />
          </div>
        </div>
        <div className="dashboard-chart-container">
          <h3 className="dashboard-chart-title">
            <span style={{ marginRight: "8px" }}>📊</span>
            Status Transaksi
          </h3>
          <div style={{ height: "250px" }}>
            <Bar data={trxChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
