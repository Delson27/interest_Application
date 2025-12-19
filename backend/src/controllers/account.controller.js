import Account from "../models/Account.js";

// CREATE account
export const createAccount = async (req, res) => {
  try {
    const { customerName, email, phone, address, accountType } = req.body;

    if (!customerName || !accountType) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const account = await Account.create({
      customerName,
      email,
      phone,
      address,
      accountType,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all accounts (created by logged-in user)
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single account
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE account
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE account
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
