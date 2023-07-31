import React, { useState, useEffect } from "react";
import Transactionlist from "./Transactionlist";
import Search from "./Search";
import AddTransaction from "./AddTransaction";
import "../stylesheets/App.css";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);

  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, search, select));
  }, [search, select, transactions]);

  const addTransaction = (newTransaction) => {
    // Send the new transaction data to the back-end
    fetch("http://localhost:8001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the state to add the new transaction to the front-end
        setTransactions((prevTransactions) => [...prevTransactions, data]);
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
      });
  };

  const deleteTransaction = (deletedTransactionId) => {
    // Send a DELETE request to the back-end to delete the transaction
    fetch(`http://localhost:8001/transactions/${deletedTransactionId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the state to remove the deleted transaction from the front-end
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== deletedTransactionId)
        );
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
      });
  };

  return (
    <div>
      <Search searchValue={search} searchFun={setSearch} />
      <AddTransaction addTransactionFun={addTransaction} />
      <Transactionlist
        transactions={filteredTransactions}
        select={select}
        selectFun={setSelect}
        deleteTransactionFun={deleteTransaction}
      />
    </div>
  );
};

const filterTransactions = (transactions, search, select) => {
  let filteredData = [...transactions];

  filteredData = filteredData.filter((transaction) => {
    return transaction.description.toLowerCase().includes(search.toLowerCase());
  });

  switch (select) {
    case "descriptionUP":
      filteredData.sort((a, b) => a.description.localeCompare(b.description));
      break;
    case "descriptionDOWN":
      filteredData.sort((a, b) => b.description.localeCompare(a.description));
      break;
    case "categoryUP":
      filteredData.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "categoryDOWN":
      filteredData.sort((a, b) => b.category.localeCompare(a.category));
      break;
    case "amountUP":
      filteredData.sort((a, b) => a.amount - b.amount);
      break;
    case "amountDOWN":
      filteredData.sort((a, b) => b.amount - a.amount);
      break;
    case "dateUP":
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "dateDOWN":
      filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      break;
  }

  return filteredData;
};

export default Account;
