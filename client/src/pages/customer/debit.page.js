import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { CustomerLayout } from "../../components/common/customer-layout.component.js";
import DebitTable from "../../components/dashboard/debit.component";
import DebtorTable from "../../components/dashboard/debtor.component.js";

function DebitPage({ setAuth }) {
  const params = useParams();
  const selected = useRef();

  useEffect(() => {
    if (params.side === "personal") selected.current = "3";
    else if (params.side === "other") selected.current = "4";
    else selected.current = "5";
  }, []);
  
  return (
    <CustomerLayout selected={selected.current} setAuth={setAuth}>
      {params.side === "debtor" && <DebtorTable></DebtorTable>}
      {params.side === "personal" && (
        <DebitTable side={params.side}></DebitTable>
      )}
      {params.side === "other" && <DebitTable side={params.side}></DebitTable>}
    </CustomerLayout>
  );
}

export default DebitPage;
