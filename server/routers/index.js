import BankAccountRouter from "./bank-account.router.js";
import BankTypeRouter from "./bank-type.router.js";
import IdentityRouter from "./identity.router.js";
import BillingRouter from "./billing.router.js";
import ReceiverRouter from "./receiver.router.js";
import DebitRouter from "./debit.router.js";
import UserRouter from "./users.router.js";
import DebtorRouter from "./debtor.router.js";
import TransferMethodRouter from "./transfer-method.router.js";
import NotifyRouter from "./notify.router.js";

import { Router } from "express";

const router = Router();

// resource name must be many (example: bank-accounts, identities)
router.use("/bank-accounts", BankAccountRouter);
router.use("/billings", BillingRouter);
router.use("/receivers", ReceiverRouter);
router.use("/bank-types", BankTypeRouter);
router.use("/identities", IdentityRouter);
router.use("/debits", DebitRouter);
router.use("/debtors", DebtorRouter);
router.use("/transfer-methods", TransferMethodRouter);
router.use("/users", UserRouter);
router.use("/notify", NotifyRouter);

export default router;
