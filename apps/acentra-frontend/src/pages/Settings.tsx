import { useState } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraTabs,
  AuroraTab,
} from "@acentra/aurora-design-system";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferenceSettings } from "@/components/settings/PreferenceSettings";
import { OrganizationSettings } from "@/components/settings/OrganizationSettings";
import { PipelineSettings } from "@/components/settings/PipelineSettings";
import { FeedbackTemplatesPage } from "@/components/settings/FeedbackTemplatesPage";
import { AdminUsers } from "./AdminUsers";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabContainerBoxProps {
  children: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <AuroraBox sx={{ py: 3 }}>{children}</AuroraBox>}
    </div>
  );
}

export function Settings() {
  const [value, setValue] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const isHR = user.role === "hr";

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const TabContainerBox = ({ children }: TabContainerBoxProps) => (
    <AuroraBox
      sx={{
        p: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        minHeight: "300px",
      }}
    >
      {children}
    </AuroraBox>
  );

  return (
    <AuroraBox sx={{ maxWidth: 1024, mx: "auto" }}>
      <AuroraTypography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Settings
      </AuroraTypography>

      <AuroraBox sx={{ borderBottom: 1, borderColor: "divider" }}>
        <AuroraTabs value={value} onChange={handleChange}>
          <AuroraTab label="Profile" />
          <AuroraTab label="Preference" />
          {(isAdmin || isHR) && <AuroraTab label="Organization" />}
          {isAdmin && <AuroraTab label="User Management" />}
          {isAdmin && <AuroraTab label="Pipeline" />}
          {(isAdmin || isHR) && <AuroraTab label="Feedback Templates" />}
        </AuroraTabs>
      </AuroraBox>

      <TabPanel value={value} index={0}>
        <TabContainerBox>
          <ProfileSettings />
        </TabContainerBox>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TabContainerBox>
          <PreferenceSettings />
        </TabContainerBox>
      </TabPanel>

      {(isAdmin || isHR) && (
        <TabPanel value={value} index={2}>
          <TabContainerBox>
            <OrganizationSettings />
          </TabContainerBox>
        </TabPanel>
      )}

      {isAdmin && (
        <TabPanel value={value} index={3}>
          <TabContainerBox>
            <AdminUsers embedded />
          </TabContainerBox>
        </TabPanel>
      )}

      {isAdmin && (
        <TabPanel value={value} index={4}>
          <TabContainerBox>
            <PipelineSettings />
          </TabContainerBox>
        </TabPanel>
      )}

      {(isAdmin || isHR) && (
        <TabPanel value={value} index={5}>
          <TabContainerBox>
            <FeedbackTemplatesPage />
          </TabContainerBox>
        </TabPanel>
      )}
    </AuroraBox>
  );
}
