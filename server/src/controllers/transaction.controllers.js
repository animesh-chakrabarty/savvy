const moment = require("moment");
const TransactionModel = require("../models/transaction.models");

// add transaction - POST - /
const addTransaction = async (req, res) => {
  const currentTime = moment();
  const { userId } = req;
  // preprocessing of time
  const formattedTime = currentTime.format(
    `${currentTime.hour()}:${currentTime.minute()}:${currentTime.second()}`
  );

  const timeStamp_obj = {
    day: currentTime.format("DD"),
    month: currentTime.format("MM"),
    year: currentTime.format("YYYY"),
    time: formattedTime,
  };

  req.body.timeStamp = timeStamp_obj;
  req.body.userId = userId;
  const data = req.body;
  const trasactionDetails = await TransactionModel.create(data);
  res.status(200).json(trasactionDetails);
};

// fetch transactions by date - GET - date/:date
const fetchTransactionsByDate = async (req, res) => {
  const { date } = req.params;
  const { userId } = req;

  const [day, month, year] = date.split("-");
  const date_obj = {
    day,
    month,
    year,
  };
  try {
    const listOfTransactions = await TransactionModel.find({
      userId,
      "timeStamp.day": date_obj.day,
      "timeStamp.month": date_obj.month,
      "timeStamp.year": date_obj.year,
    });
    // if user have no transactions
    if (!listOfTransactions.length) {
      return res.status(200).json({
        message: `User has no transaction on ${date_obj.day}/${date_obj.month}/${date_obj.year}`,
      });
    }
    res.status(200).json(listOfTransactions);
  } catch (error) {
    res.status(500).json({ message: "error retriving transactions", error });
  }
};

// fetch transaction by month - GET  - month/:month
const fetchTransactionsByMonth = async (req, res) => {
  const { userId } = req;
  const { month: monthFromParam } = req.params;
  const [month, year] = monthFromParam.split("-");
  const month_obj = {
    month,
    year,
  };

  try {
    const listOfTransactionsByMonth = await TransactionModel.find({
      userId,
      "timeStamp.month": month_obj.month,
      "timeStamp.year": month_obj.year,
    });

    if (!listOfTransactionsByMonth.length) {
      return res.status(200).json({
        msg: `User has no transaction on month ${month_obj.month}/${month_obj.year}`,
      });
    }
    res.status(200).json(listOfTransactionsByMonth);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving transactions", err });
  }
};

const deleteTransactionById = async () => {};
const fetchRecentTransactions = async () => {};
const updateTransactionById = async () => {};

module.exports = {
  fetchTransactionsByDate,
  addTransaction,
  fetchTransactionsByMonth,
  deleteTransactionById,
  fetchRecentTransactions,
  updateTransactionById,
};
