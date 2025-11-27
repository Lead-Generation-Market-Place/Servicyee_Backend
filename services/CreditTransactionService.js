import mongoose from "mongoose";
import Professional from "../models/ProfessionalModel.js";
import CreditTransactionModel from "../models/CreditTransactionModel.js";
export async function purchaseCreditsService({
  professional_id,
  payment_data,
  user_id,
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const professional = await Professional.findById(professional_id).session(
      session
    );
    if (!professional) throw new Error("Professional not found");
    const lastTransaction = await CreditTransactionModel.findOne({
      professional_id,
    })
      .sort({ createdAt: -1 })
      .session(session);
    const balance_before = lastTransaction ? lastTransaction.balance_after : 0;
    const balance_after = balance_before + payment_data.credit_amount;
    const transaction = new CreditTransactionModel({
      type: "purchase",
      status: "completed",
      professional_id,
      user_id,
      amount: payment_data.credit_amount,
      balance_before,
      balance_after,
      price: payment_data.price,
      description: `Purchased`,
      payment_method: payment_data.method,
      payment_transaction_id: payment_data.transaction_id,
      processed_at: new Date(),
    });
    await transaction.save({ session });
    await Professional.findByIdAndUpdate(
      professional_id,
      { credit_balance: balance_after },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error?.message || "Failed to purchase credits.");
  }
}
