import { useState, useEffect } from "react";
import { departmentsService, type Department } from "@/services/departmentsService";
import { officesService, type Office } from "@/services/officesService";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AuroraBox,
  AuroraTypography,
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
  AuroraGrid,
  AuroraCard,
  AuroraCardContent,
  AuroraIconButton,
  AuroraDivider
} from "@acentra/aurora-design-system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DomainIcon from "@mui/icons-material/Domain";

export function OrganizationSettings() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
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
      showSnackbar("Failed to load organization data", "error");
    }
  };

  const handleAddOffice = async () => {
    if (!officeName) return;
    try {
      await officesService.createOffice({
        name: officeName,
        address: officeAddress,
        type: officeType,
      });
      showSnackbar("Office added successfully", "success");
      setOpenOfficeModal(false);
      resetOfficeForm();
      loadData();
    } catch {
      showSnackbar("Failed to add office", "error");
    }
  };

  const handleDeleteOffice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this office?")) return;
    try {
      await officesService.deleteOffice(id);
      showSnackbar("Office deleted", "success");
      loadData();
    } catch {
      showSnackbar("Failed to delete office", "error");
    }
  };

  const resetOfficeForm = () => {
    setOfficeName("");
    setOfficeAddress("");
    setOfficeType("branch");
  }

  const handleAddDept = async () => {
    if (!deptName) return;
    try {
      await departmentsService.createDepartment({ name: deptName });
      showSnackbar("Department added successfully", "success");
      setOpenDeptModal(false);
      setDeptName("");
      loadData();
    } catch {
      showSnackbar("Failed to add department", "error");
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await departmentsService.deleteDepartment(id);
      showSnackbar("Department deleted", "success");
      loadData();
    } catch {
      showSnackbar("Failed to delete department", "error");
    }
  };

  return (
    <AuroraBox sx={{ width: '100%', pb: 4 }}>
      {/* Header */}
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraTypography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Organization Settings
        </AuroraTypography>
        <AuroraTypography variant="body1" color="text.secondary">
          Manage your company structure, offices, and departments.
        </AuroraTypography>
      </AuroraBox>

      {/* Offices Section */}
      <AuroraBox sx={{ mb: 6 }}>
        <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <AuroraBox>
            <AuroraTypography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
              <DomainIcon color="primary" /> Offices & Branches
            </AuroraTypography>
            <AuroraTypography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your physical office locations and branches.
            </AuroraTypography>
          </AuroraBox>
          <AuroraButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenOfficeModal(true)}
          >
            Add Office
          </AuroraButton>
        </AuroraBox>

        <AuroraGrid container spacing={3}>
          {offices.map((office) => (
            <AuroraGrid size={{ xs: 12, md: 6, lg: 4 }} key={office.id}>
              <AuroraCard sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                <AuroraCardContent>
                  <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <AuroraBox sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: office.type === 'headquarters' ? 'primary.light' : 'action.hover',
                        color: office.type === 'headquarters' ? 'primary.main' : 'text.secondary'
                      }}>
                        <BusinessIcon />
                      </AuroraBox>
                      <AuroraBox>
                        <AuroraTypography variant="subtitle1" fontWeight="600" lineHeight={1.2}>
                          {office.name}
                        </AuroraTypography>
                        <AuroraTypography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {office.type || 'Branch'}
                        </AuroraTypography>
                      </AuroraBox>
                    </AuroraBox>
                    <AuroraIconButton size="small" color="error" onClick={() => handleDeleteOffice(office.id)}>
                      <DeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </AuroraBox>

                  <AuroraDivider sx={{ my: 1.5 }} />

                  <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <AuroraTypography variant="body2">
                      {office.address || "No address provided"}
                    </AuroraTypography>
                  </AuroraBox>
                </AuroraCardContent>
              </AuroraCard>
            </AuroraGrid>
          ))}
          {offices.length === 0 && (
            <AuroraGrid size={{ xs: 12 }}>
              <AuroraBox sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}>
                <AuroraTypography color="text.secondary">No offices found. Add your first office to get started.</AuroraTypography>
              </AuroraBox>
            </AuroraGrid>
          )}
        </AuroraGrid>
      </AuroraBox>

      <AuroraDivider sx={{ mb: 6 }} />

      {/* Departments Section */}
      <AuroraBox>
        <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <AuroraBox>
            <AuroraTypography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
              <AccountTreeIcon color="success" /> Departments
            </AuroraTypography>
            <AuroraTypography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Define the functional departments within your organization.
            </AuroraTypography>
          </AuroraBox>
          <AuroraButton
            variant="contained"
            color="secondary" // Using secondary or just standard contained
            startIcon={<AddIcon />}
            onClick={() => setOpenDeptModal(true)}
          >
            Add Department
          </AuroraButton>
        </AuroraBox>

        <AuroraGrid container spacing={3}>
          {departments.map((dept) => (
            <AuroraGrid size={{ xs: 12, md: 6, lg: 4 }} key={dept.id}>
              <AuroraCard sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                <AuroraCardContent>
                  <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AuroraBox sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'success.light',
                        color: 'success.main'
                      }}>
                        <AccountTreeIcon />
                      </AuroraBox>
                      <AuroraTypography variant="subtitle1" fontWeight="600">
                        {dept.name}
                      </AuroraTypography>
                    </AuroraBox>
                    <AuroraIconButton size="small" color="error" onClick={() => handleDeleteDept(dept.id)}>
                      <DeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </AuroraBox>
                </AuroraCardContent>
              </AuroraCard>
            </AuroraGrid>
          ))}
          {departments.length === 0 && (
            <AuroraGrid size={{ xs: 12 }}>
              <AuroraBox sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}>
                <AuroraTypography color="text.secondary">No departments found. Add your first department.</AuroraTypography>
              </AuroraBox>
            </AuroraGrid>
          )}
        </AuroraGrid>
      </AuroraBox>

      {/* Add Office Modal */}
      <AuroraDialog
        open={openOfficeModal}
        onClose={() => setOpenOfficeModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <AuroraDialogTitle>Add New Office</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ pt: 1 }}>
            <AuroraInput
              fullWidth
              label="Office Name"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              margin="normal"
              placeholder="e.g. Headquarters"
              autoFocus
            />
            <AuroraInput
              fullWidth
              label="Address"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              margin="normal"
              placeholder="e.g. 123 Main St, New York, NY"
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
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ px: 3, pb: 2 }}>
          <AuroraButton onClick={() => setOpenOfficeModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddOffice} variant="contained" disabled={!officeName}>
            Add Office
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Add Department Modal */}
      <AuroraDialog
        open={openDeptModal}
        onClose={() => setOpenDeptModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <AuroraDialogTitle>Add New Department</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ pt: 1 }}>
            <AuroraInput
              fullWidth
              label="Department Name"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              margin="normal"
              autoFocus
              placeholder="e.g. Engineering"
            />
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ px: 3, pb: 2 }}>
          <AuroraButton onClick={() => setOpenDeptModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddDept} variant="contained" disabled={!deptName}>
            Add Department
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
