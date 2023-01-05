import { useParams } from "react-router-dom";
import DebitTable from "../../components/dashboard/debit.component";
import DebtorTable from "../../components/dashboard/debtor.component.js";
import ContentLayout from "../../components/common/content-layout.component.js";

function DebitPage() {
  const params = useParams();
  
  return (
    <ContentLayout>
      {params.side === "debtor" && <DebtorTable></DebtorTable>}
      {params.side === "personal" && (
        <DebitTable side={params.side}></DebitTable>
      )}
      {params.side === "other" && <DebitTable side={params.side}></DebitTable>}
    </ContentLayout>
  );
}

export default DebitPage;
