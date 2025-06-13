import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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

      // PERBAIKAN: Ganti alert dengan SweetAlert untuk error
      await Swal.fire({
        icon: "warning",
        title: "Gagal Memuat Data",
        html: `
          <p>Terjadi kesalahan saat memuat data transaksi:</p>
          <p><strong>${error.message}</strong></p>
          <p>Menggunakan data mock untuk sementara.</p>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#3498db",
        customClass: {
          popup: "swal-wide",
        },
      });

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

      // Show loading alert
      Swal.fire({
        title: "Memproses...",
        html: "Sedang mengupdate status transaksi",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

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

        // PERBAIKAN: Ganti alert dengan SweetAlert untuk success
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          html: `
            <p>Status transaksi berhasil diubah menjadi <strong>"Sudah"</strong></p>
            <p>ID Transaksi: VTX${String(transactionId).padStart(3, "0")}</p>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "#27ae60",
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(
          "Failed to update status - no data returned from updateTransactionStatus"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);

      // PERBAIKAN: Ganti alert dengan SweetAlert untuk error
      if (error.message.includes("GraphQL Error")) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Update Status",
          html: `
            <p>Terjadi kesalahan GraphQL:</p>
            <p><strong>${error.message}</strong></p>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "#e74c3c",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal Update Status",
          html: `
            <p>Terjadi kesalahan saat mengupdate status:</p>
            <p><strong>${error.message}</strong></p>
          `,
          footer: "<small>Mencoba mode development...</small>",
          confirmButtonText: "OK",
          confirmButtonColor: "#e74c3c",
        });

        // Hanya untuk development/testing - hapus ini di production
        console.log("Attempting mock update for development...");
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, status: "sudah" }
              : transaction
          )
        );

        // Success alert untuk mock update
        await Swal.fire({
          icon: "info",
          title: "Mode Development",
          html: `
            <p>Status transaksi berhasil diubah (mode development)</p>
            <p>ID Transaksi: VTX${String(transactionId).padStart(3, "0")}</p>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "#3498db",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // PERBAIKAN: Konfirmasi sebelum mengubah status dengan SweetAlert
  const handleStatusChange = async (transactionId, vendorName) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi Update Status",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Vendor:</strong> ${vendorName}</p>
          <p><strong>ID Transaksi:</strong> VTX${String(transactionId).padStart(
            3,
            "0"
          )}</p>
          <p><strong>Status akan diubah:</strong> Belum → <span style="color: #27ae60; font-weight: bold;">Sudah</span></p>
        </div>
        <p>Apakah Anda yakin ingin melanjutkan?</p>
      `,
      showCancelButton: true,
      confirmButtonText: "✓ Ya, Konfirmasi",
      cancelButtonText: "✕ Batal",
      confirmButtonColor: "#27ae60",
      cancelButtonColor: "#e74c3c",
      reverseButtons: true,
      customClass: {
        popup: "swal-wide",
      },
    });

    if (result.isConfirmed) {
      updateTransactionStatus(transactionId);
    }
  };

  // Refresh data setelah update berhasil
  const refreshTransactions = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Refresh Data",
      text: "Apakah Anda ingin memuat ulang data transaksi?",
      showCancelButton: true,
      confirmButtonText: "🔄 Ya, Refresh",
      cancelButtonText: "Batal",
      confirmButtonColor: "#9b59b6", // Gunakan warna ungu
      cancelButtonColor: "#95a5a6",
    });

    if (result.isConfirmed) {
      // Set loading state
      setLoading(true);

      fetchTransactions();

      // Show success message after refresh
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Data Diperbarui",
          text: "Data transaksi berhasil dimuat ulang",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
          confirmButtonColor: "#9b59b6", // Gunakan warna ungu
        });
      }, 100);
    }
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
        <div className="transactions-loading-wrapper">
          <div className="transactions-loading-content">
            <div className="transactions-loading-spinner"></div>
            <div className="transactions-loading-text">
              Memuat data transaksi vendor...
            </div>
            <div className="transactions-loading-subtext">
              Mohon tunggu sebentar
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Vendor Transactions</h2>

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

      {/* ALTERNATIF: Refresh Button dengan inline style ungu */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={refreshTransactions}
          style={{
            background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
            color: "white",
            padding: "16px 32px",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1.1rem",
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 8px 20px rgba(155, 89, 182, 0.3)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px) scale(1.02)";
            e.target.style.boxShadow = "0 12px 25px rgba(155, 89, 182, 0.4)";
            e.target.style.background =
              "linear-gradient(135deg, #8e44ad, #9b59b6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 8px 20px rgba(155, 89, 182, 0.3)";
            e.target.style.background =
              "linear-gradient(135deg, #9b59b6, #8e44ad)";
          }}
          disabled={loading}
        >
          <span
            style={{
              display: "inline-block",
              animation: loading ? "refreshRotate 1s linear infinite" : "none",
            }}
          >
            🔄
          </span>
          {loading ? "Refreshing..." : "Refresh Data"}
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
