import React, { useEffect, useState } from "react";
import "./transactions.css";

const API_URL = process.env.REACT_APP_TRANSACTIONS_API || "http://localhost:4000/graphql";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk format harga ke IDR
  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi format number dengan separator
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Fungsi untuk mendapatkan class status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'completed';
      case 'pending':
      case 'waiting':
        return 'pending';
      case 'cancelled':
      case 'failed':
        return 'cancelled';
      case 'processing':
        return 'processing';
      default:
        return 'pending';
    }
  };

  // Fungsi untuk mendapatkan status text yang readable
  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'Selesai';
      case 'pending':
      case 'waiting':
        return 'Menunggu';
      case 'cancelled':
      case 'failed':
        return 'Dibatalkan';
      case 'processing':
        return 'Proses';
      default:
        return status;
    }
  };

  const fetchTransactions = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            transactions {
              id
              buyerId
              buyerName
              sellerId
              sellerName
              sapiId
              quantity
              totalAmount
              status
              createdAt
              updatedAt
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.transactions) {
          setTransactions(result.data.transactions);
        } else {
          // Mock data untuk development jika API belum ready
          setTransactions([
            {
              id: "TXN001",
              buyerId: "BUY001",
              buyerName: "Ahmad Sulaiman",
              sellerId: "SELL001", 
              sellerName: "Peternak Maju",
              sapiId: "SAPI001",
              quantity: 2,
              totalAmount: 25000000,
              status: "completed",
              createdAt: "2025-01-10T08:30:00Z",
              updatedAt: "2025-01-10T10:15:00Z"
            },
            {
              id: "TXN002",
              buyerId: "BUY002",
              buyerName: "Siti Aminah",
              sellerId: "SELL002",
              sellerName: "Farm Sejahtera",
              sapiId: "SAPI002",
              quantity: 1,
              totalAmount: 15000000,
              status: "pending",
              createdAt: "2025-01-11T14:20:00Z",
              updatedAt: "2025-01-11T14:20:00Z"
            },
            {
              id: "TXN003",
              buyerId: "BUY003",
              buyerName: "Budi Santoso",
              sellerId: "SELL003",
              sellerName: "Ternak Barokah",
              sapiId: "SAPI003",
              quantity: 3,
              totalAmount: 45000000,
              status: "processing",
              createdAt: "2025-01-12T09:45:00Z",
              updatedAt: "2025-01-12T11:30:00Z"
            },
            {
              id: "TXN004",
              buyerId: "BUY004",
              buyerName: "Dewi Kartika",
              sellerId: "SELL001",
              sellerName: "Peternak Maju",
              sapiId: "SAPI004",
              quantity: 1,
              totalAmount: 18000000,
              status: "cancelled",
              createdAt: "2025-01-13T16:10:00Z",
              updatedAt: "2025-01-13T17:45:00Z"
            }
          ]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        // Fallback ke mock data jika ada error
        setTransactions([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="transactions-container">
        <h2 className="transactions-title">Transactions List</h2>
        <div className="transactions-loading">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-container">
        <h2 className="transactions-title">Transactions List</h2>
        <div className="transactions-empty">
          <h3>Tidak ada transaksi</h3>
          <p>Belum ada transaksi yang tercatat dalam sistem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transactions List</h2>
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Pembeli</th>
              <th>Penjual</th>
              <th>Jumlah</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <strong>{transaction.id}</strong>
                </td>
                <td>{transaction.buyerName}</td>
                <td>{transaction.sellerName}</td>
                <td>{formatNumber(transaction.quantity)} Ekor</td>
                <td className="amount-cell">
                  {formatIDR(transaction.totalAmount)}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </span>
                </td>
                <td className="date-cell">
                  {formatDate(transaction.createdAt)}
                </td>
                <td>
                  <button
                    onClick={() => alert(`View details for ${transaction.id}`)}
                    className="transactions-action-btn view"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => alert(`Edit transaction ${transaction.id}`)}
                    className="transactions-action-btn edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus transaksi ${transaction.id}?`)) {
                        alert(`Delete transaction ${transaction.id}`);
                      }
                    }}
                    className="transactions-action-btn delete"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;