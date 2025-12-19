import Document from "../models/Document.js";
import Transaction from "../models/Transaction.js";

export const uploadDocument = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Check transaction ownership
    const transaction = await Transaction.findOne({
      _id: transactionId,
      createdBy: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doc = await Document.create({
      transaction: transactionId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
