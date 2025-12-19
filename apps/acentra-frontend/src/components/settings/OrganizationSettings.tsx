import { useState, useEffect } from "react";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraIconButton,
  AuroraButton,
  AuroraInput,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraDeleteIcon,
  AuroraAddIcon,
  AuroraPaper,
  AuroraDivider,
} from "@acentra/aurora-design-system";
import { ListItemSecondaryAction } from "@mui/material";

export function OrganizationSettings() {
  const [offices, setOffices] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [openOfficeModal, setOpenOfficeModal] = useState(false);
  const [openDeptModal, setOpenDeptModal] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Office Form State
  const [officeName, setOfficeName] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [officeType, setOfficeType] = useState("branch");

  // Dept Form State
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offs, deps] = await Promise.all([
        officesService.getOffices(),
        departmentsService.getDepartments(),
      ]);
      setOffices(offs);
      setDepartments(deps);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOffice = async () => {
    try {
      await officesService.createOffice({
        name: officeName,
        address: officeAddress,
        type: officeType,
      });
      showSnackbar("Office added successfully", "success");
      setOpenOfficeModal(false);
      setOfficeName("");
      setOfficeAddress("");
      loadData();
    } catch (err) {
      showSnackbar("Failed to add office", "error");
    }
  };

  const handleDeleteOffice = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await officesService.deleteOffice(id);
      showSnackbar("Office deleted", "success");
      loadData();
    } catch (err) {
      showSnackbar("Failed to delete office", "error");
    }
  };

  const handleAddDept = async () => {
    try {
      await departmentsService.createDepartment({ name: deptName });
      showSnackbar("Department added successfully", "success");
      setOpenDeptModal(false);
      setDeptName("");
      loadData();
    } catch (err) {
      showSnackbar("Failed to add department", "error");
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await departmentsService.deleteDepartment(id);
      showSnackbar("Department deleted", "success");
      loadData();
    } catch (err) {
      showSnackbar("Failed to delete department", "error");
    }
  };

  return (
    <AuroraBox sx={{ maxWidth: 800 }}>
      {/* Offices Section */}
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraBox
          sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
        >
          <AuroraTypography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
          Offices & Branches
          </AuroraTypography>
          <AuroraButton
            startIcon={<AuroraAddIcon />}
            onClick={() => setOpenOfficeModal(true)}
          >
            Add Office
          </AuroraButton>
        </AuroraBox>
        <AuroraPaper>
          <AuroraList>
            {offices.map((office, index) => (
              <div key={office.id}>
                <AuroraListItem>
                  <AuroraListItemText
                    primary={office.name}
                    secondary={`${office.type} • ${office.address || "No address"}`}
                  />
                  <ListItemSecondaryAction>
                    <AuroraIconButton
                      onClick={() => handleDeleteOffice(office.id)}
                      size="small"
                      color="error"
                      sx={{
                        borderRadius: 1,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <AuroraDeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </ListItemSecondaryAction>
                </AuroraListItem>
                {index < offices.length - 1 && <AuroraDivider />}
              </div>
            ))}
            {offices.length === 0 && (
              <AuroraListItem>
                <AuroraListItemText
                  primary="No offices found"
                  secondary="Add your first office to get started"
                />
              </AuroraListItem>
            )}
          </AuroraList>
        </AuroraPaper>
      </AuroraBox>

      {/* Departments Section */}
      <AuroraBox>
        <AuroraBox
          sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
        >
          <AuroraTypography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
          Departments
          </AuroraTypography>
          <AuroraButton
            startIcon={<AuroraAddIcon />}
            onClick={() => setOpenDeptModal(true)}
          >
            Add Department
          </AuroraButton>
        </AuroraBox>
        <AuroraPaper>
          <AuroraList>
            {departments.map((dept, index) => (
              <div key={dept.id}>
                <AuroraListItem>
                  <AuroraListItemText primary={dept.name} />
                  <ListItemSecondaryAction>
                    <AuroraIconButton
                      onClick={() => handleDeleteDept(dept.id)}
                      size="small"
                      color="error"
                      sx={{
                        borderRadius: 1,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <AuroraDeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </ListItemSecondaryAction>
                </AuroraListItem>
                {index < departments.length - 1 && <AuroraDivider />}
              </div>
            ))}
            {departments.length === 0 && (
              <AuroraListItem>
                <AuroraListItemText
                  primary="No departments found"
                  secondary="Add your first department to get started"
                />
              </AuroraListItem>
            )}
          </AuroraList>
        </AuroraPaper>
      </AuroraBox>

      {/* Add Office Modal */}
      <AuroraDialog
        open={openOfficeModal}
        onClose={() => setOpenOfficeModal(false)}
      >
        <AuroraDialogTitle>Add New Office</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraInput
            fullWidth
            label="Office Name"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            margin="normal"
          />
          <AuroraInput
            fullWidth
            label="Address"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
            margin="normal"
          />
          <AuroraFormControl fullWidth margin="normal">
            <AuroraInputLabel>Type</AuroraInputLabel>
            <AuroraSelect
              value={officeType}
              label="Type"
              onChange={(e) => setOfficeType(e.target.value)}
            >
              <AuroraMenuItem value="headquarters">Headquarters</AuroraMenuItem>
              <AuroraMenuItem value="branch">Branch</AuroraMenuItem>
            </AuroraSelect>
          </AuroraFormControl>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setOpenOfficeModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddOffice} variant="contained">
            Add
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Add Department Modal */}
      <AuroraDialog
        open={openDeptModal}
        onClose={() => setOpenDeptModal(false)}
      >
        <AuroraDialogTitle>Add New Department</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraInput
            fullWidth
            label="Department Name"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            margin="normal"
          />
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setOpenDeptModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddDept} variant="contained">
            Add
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
