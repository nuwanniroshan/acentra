import { useState, useEffect } from "react";
import { request } from "../../api";
import { useSnackbar } from "../../context/SnackbarContext";
import { AuroraBox, AuroraTypography, AuroraList, AuroraListItem, AuroraListItemText, AuroraIconButton, AuroraButton, AuroraInput, AuroraDialog, AuroraDialogTitle, AuroraDialogContent, AuroraDialogActions, AuroraGrid, AuroraSelect, AuroraMenuItem, AuroraFormControl, AuroraInputLabel, AuroraDeleteIcon, AuroraAddIcon, AuroraBusinessIcon, AuroraDomainIcon } from '@acentra/aurora-design-system';
import { ListItemSecondaryAction } from '@mui/material';

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
        request("/offices"),
        request("/departments"),
      ]);
      setOffices(offs);
      setDepartments(deps);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOffice = async () => {
    try {
      await request("/offices", {
        method: "POST",
        body: JSON.stringify({
          name: officeName,
          address: officeAddress,
          type: officeType,
        }),
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
      await request(`/offices/${id}`, { method: "DELETE" });
      showSnackbar("Office deleted", "success");
      loadData();
    } catch (err) {
      showSnackbar("Failed to delete office", "error");
    }
  };

  const handleAddDept = async () => {
    try {
      await request("/departments", {
        method: "POST",
        body: JSON.stringify({ name: deptName }),
      });
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
      await request(`/departments/${id}`, { method: "DELETE" });
      showSnackbar("Department deleted", "success");
      loadData();
    } catch (err) {
      showSnackbar("Failed to delete department", "error");
    }
  };

  return (
    <AuroraGrid container spacing={4}>
      {/* Offices Section */}
      <AuroraGrid size={{ xs: 12, md: 6 }}>
        <AuroraBox sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <AuroraTypography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AuroraBusinessIcon /> Offices & Branches
          </AuroraTypography>
          <AuroraButton startIcon={<AuroraAddIcon />} onClick={() => setOpenOfficeModal(true)}>
            Add Office
          </AuroraButton>
        </AuroraBox>
        <AuroraList sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
          {offices.map((office) => (
            <AuroraListItem key={office.id} divider>
              <AuroraListItemText
                primary={office.name}
                secondary={`${office.type} • ${office.address || "No address"}`}
              />
              <ListItemSecondaryAction>
                <AuroraIconButton 
                  edge="end" 
                  onClick={() => handleDeleteOffice(office.id)}
                  sx={{ 
                    borderRadius: 1,
                    width: 40,
                    height: 40
                  }}
                >
                  <AuroraDeleteIcon />
                </AuroraIconButton>
              </ListItemSecondaryAction>
            </AuroraListItem>
          ))}
          {offices.length === 0 && (
            <AuroraListItem>
              <AuroraListItemText secondary="No offices found" />
            </AuroraListItem>
          )}
        </AuroraList>
      </AuroraGrid>

      {/* Departments Section */}
      <AuroraGrid size={{ xs: 12, md: 6 }}>
        <AuroraBox sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <AuroraTypography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AuroraDomainIcon /> Departments
          </AuroraTypography>
          <AuroraButton startIcon={<AuroraAddIcon />} onClick={() => setOpenDeptModal(true)}>
            Add Department
          </AuroraButton>
        </AuroraBox>
        <AuroraList sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
          {departments.map((dept) => (
            <AuroraListItem key={dept.id} divider>
              <AuroraListItemText primary={dept.name} />
              <ListItemSecondaryAction>
                <AuroraIconButton 
                  edge="end" 
                  onClick={() => handleDeleteDept(dept.id)}
                  sx={{ 
                    borderRadius: 1,
                    width: 40,
                    height: 40
                  }}
                >
                  <AuroraDeleteIcon />
                </AuroraIconButton>
              </ListItemSecondaryAction>
            </AuroraListItem>
          ))}
          {departments.length === 0 && (
            <AuroraListItem>
              <AuroraListItemText secondary="No departments found" />
            </AuroraListItem>
          )}
        </AuroraList>
      </AuroraGrid>

      {/* Add Office Modal */}
      <AuroraDialog open={openOfficeModal} onClose={() => setOpenOfficeModal(false)}>
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
          <AuroraButton onClick={() => setOpenOfficeModal(false)}>Cancel</AuroraButton>
          <AuroraButton onClick={handleAddOffice} variant="contained">Add</AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Add Department Modal */}
      <AuroraDialog open={openDeptModal} onClose={() => setOpenDeptModal(false)}>
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
          <AuroraButton onClick={() => setOpenDeptModal(false)}>Cancel</AuroraButton>
          <AuroraButton onClick={handleAddDept} variant="contained">Add</AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraGrid>
  );
}
