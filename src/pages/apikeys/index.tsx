import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { apiKeysColumns } from "./_component/column";
import CreateApiKeyDialog from "./_component/create-apikey";

const ApiKeys = () => {
  return (
    <PageLayout
      title="Api Keys"
      subtitle="View and manage your UploadNest API keys."
      rightAction={
        <CreateApiKeyDialog>
          <Button className="!pr-7">
            <PlusIcon />
            Create Key
          </Button>
        </CreateApiKeyDialog>
      }
    >
      <div className="w-full h-auto">
        <DataTable data={[]} columns={apiKeysColumns} showSearch={false} />
      </div>
    </PageLayout>
  );
};

export default ApiKeys;
