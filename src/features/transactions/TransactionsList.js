import React, { useEffect, useState } from "react";
import "./transactions.css";

const API_URL = process.env.REACT_APP_TRANSACTIONS_API;

console.log("API_URL:", API_URL); // Debug log untuk melihat URL yang digunakan

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk mendapatkan class status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "sudah":
        return "completed";
      case "belum":
        return "pending";
      default:
        return "pending";
    }
  };

  // Fungsi untuk mendapatkan status text yang readable
  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "sudah":
        return "Sudah";
      case "belum":
        return "Belum";
      default:
        return status;
    }
  };

  // Fungsi untuk format livestock type
  const formatLivestockType = (type) => {
    const types = {
      sapi: "Sapi",
      ayam: "Ayam",
      kambing: "Kambing",
      domba: "Domba",
    };
    return types[type] || type;
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching from:", API_URL);

      // Cek apakah API_URL tersedia
      if (!API_URL) {
        throw new Error("API_URL not configured");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              vendorTransactionsAll {
                id
                livestock_type
                status
                total
                transaction_date
                vendor_id
                vendor_name
              }
            }
          `,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      // Gunakan vendorTransactionsAll sesuai dengan response API
      if (result.data && result.data.vendorTransactionsAll) {
        console.log(
          "Setting transactions data:",
          result.data.vendorTransactionsAll
        );
        setTransactions(result.data.vendorTransactionsAll);
      } else {
        console.log("No data from API");
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching vendor transactions:", error);
      setError(error.message);

      // Fallback ke mock data jika API gagal
      setTransactions([
        {
          id: 1,
          vendor_id: 1,
          livestock_type: "sapi",
          total: 25,
          status: "belum",
          transaction_date: "2025-01-10T08:30:00Z",
          vendor_name: "Peternak Maju Jaya",
        },
        {
          id: 2,
          vendor_id: 2,
          livestock_type: "ayam",
          total: 100,
          status: "sudah",
          transaction_date: "2025-01-11T14:20:00Z",
          vendor_name: "Farm Sejahtera",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // PERBAIKAN: Fungsi untuk update status transaksi menggunakan mutation yang benar
  const updateTransactionStatus = async (transactionId) => {
    setUpdatingId(transactionId);

    try {
      console.log("Updating transaction:", transactionId);

      if (!API_URL) {
        throw new Error("API_URL not configured");
      }

      // PERBAIKAN: Menggunakan mutation updateTransactionStatus dengan parameter transaction_id
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateTransactionStatus(transaction_id: ${transactionId}, status: "sudah") {
                id
                vendor_id
                livestock_type
                total
                status
                transaction_date
                vendor_name
              }
            }
          `,
        }),
      });

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Update result:", result);

      if (result.errors) {
        console.error("GraphQL Update Errors:", result.errors);
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      // PERBAIKAN: Cek response data dari updateTransactionStatus
      if (result.data && result.data.updateTransactionStatus) {
        console.log("Update successful:", result.data.updateTransactionStatus);

        // Update state lokal dengan data yang dikembalikan dari server
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? {
                  ...transaction,
                  status: result.data.updateTransactionStatus.status,
                  // Update semua field yang mungkin berubah
                  ...result.data.updateTransactionStatus,
                }
              : transaction
          )
        );

        alert("Status transaksi berhasil diubah menjadi 'Sudah'");
      } else {
        throw new Error(
          "Failed to update status - no data returned from updateTransactionStatus"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);

      // Jangan langsung update state jika API gagal, beri user feedback yang jelas
      if (error.message.includes("GraphQL Error")) {
        alert(`Gagal mengubah status transaksi: ${error.message}`);
      } else {
        alert(`Gagal mengubah status transaksi: ${error.message}`);

        // Hanya untuk development/testing - hapus ini di production
        console.log("Attempting mock update for development...");
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, status: "sudah" }
              : transaction
          )
        );
        alert("Status transaksi berhasil diubah (mode development)");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Konfirmasi sebelum mengubah status
  const handleStatusChange = (transactionId, vendorName) => {
    const message = `Apakah Anda yakin ingin mengubah status transaksi dari "${vendorName}" menjadi "Sudah"?\n\nTransaksi ID: VTX${String(
      transactionId
    ).padStart(3, "0")}`;

    if (window.confirm(message)) {
      updateTransactionStatus(transactionId);
    }
  };

  // Refresh data setelah update berhasil
  const refreshTransactions = () => {
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Debug log untuk melihat state transactions
  console.log("Current transactions state:", transactions);

  if (loading) {
    return (
      <div className="transactions-container">
        <h2 className="transactions-title">Vendor Transactions</h2>
        <div className="transactions-loading">
          Loading vendor transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transactions</h2>

      {error && (
        <div
          className="error-banner"
          style={{
            background: "#fee",
            color: "#c33",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fcc",
          }}
        >
          <strong>API Error:</strong> {error}
          <br />
          <small>Menggunakan data mock untuk sementara.</small>
          <button
            onClick={fetchTransactions}
            style={{
              marginLeft: "10px",
              padding: "4px 8px",
              background: "#c33",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={refreshTransactions}
          className="transactions-create"
          style={{
            background: "linear-gradient(135deg, #3498db, #2980b9)",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="transactions-empty">
          <h3>Tidak ada transaksi vendor</h3>
          <p>Belum ada transaksi vendor yang tercatat dalam sistem.</p>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendor</th>
                <th>Jenis Ternak</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <strong>
                      VTX{String(transaction.id).padStart(3, "0")}
                    </strong>
                  </td>
                  <td>
                    <div className="vendor-info">
                      <div className="vendor-name">
                        {transaction.vendor_name ||
                          `Vendor ${transaction.vendor_id}`}
                      </div>
                      <div className="vendor-contact">
                        ID: {transaction.vendor_id}
                      </div>
                    </div>
                  </td>
                  <td>{formatLivestockType(transaction.livestock_type)}</td>
                  <td style={{ textAlign: "right", fontWeight: "600" }}>
                    {transaction.total} Ekor
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        transaction.status
                      )}`}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className="date-cell">
                    {formatDate(transaction.transaction_date)}
                  </td>
                  <td>
                    {transaction.status === "belum" ? (
                      <button
                        onClick={() =>
                          handleStatusChange(
                            transaction.id,
                            transaction.vendor_name ||
                              `Vendor ${transaction.vendor_id}`
                          )
                        }
                        className="transactions-action-btn edit"
                        disabled={updatingId === transaction.id}
                        style={{
                          minWidth: "100px",
                          position: "relative",
                        }}
                      >
                        {updatingId === transaction.id ? (
                          <>
                            <span style={{ opacity: 0.7 }}>Updating</span>
                            <span
                              style={{
                                marginLeft: "5px",
                                animation: "spin 1s linear infinite",
                                display: "inline-block",
                              }}
                            >
                              ⟳
                            </span>
                          </>
                        ) : (
                          "✓ Konfirmasi"
                        )}
                      </button>
                    ) : (
                      <span className="status-completed">✅ Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
