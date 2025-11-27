import { useState, useEffect } from "react";
import { AuroraBox, AuroraTypography, AuroraButton, AuroraInput, AuroraIconButton, AuroraList, AuroraListItem, AuroraListItemText, AuroraDialog, AuroraDialogTitle, AuroraDialogContent, AuroraDialogActions, AuroraPaper, AuroraDivider } from '@acentra/aurora-design-system';
import { ListItemSecondaryAction } from '@mui/material';
import { Add, Edit, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { request } from "../../api";
import { useSnackbar } from "../../context/SnackbarContext";

interface PipelineStatus {
  id: string;
  value: string;
  label: string;
  order: number;
}

export function PipelineSettings() {
  const [statuses, setStatuses] = useState<PipelineStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PipelineStatus | null>(null);
  const [formData, setFormData] = useState({ value: "", label: "" });
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const data = await request("/pipeline-statuses");
      setStatuses(data);
    } catch (err) {
      showSnackbar("Failed to load pipeline statuses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (status?: PipelineStatus) => {
    if (status) {
      setEditingStatus(status);
      setFormData({ value: status.value, label: status.label });
    } else {
      setEditingStatus(null);
      setFormData({ value: "", label: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStatus(null);
    setFormData({ value: "", label: "" });
  };

  const handleSubmit = async () => {
    try {
      if (editingStatus) {
        await request(`/pipeline-statuses/${editingStatus.id}`, {
          method: "PATCH",
          body: JSON.stringify({ label: formData.label }),
        });
        showSnackbar("Status updated successfully", "success");
      } else {
        // Calculate next order
        const maxOrder = Math.max(...statuses.map(s => s.order), -1);
        await request("/pipeline-statuses", {
          method: "POST",
          body: JSON.stringify({
            value: formData.value,
            label: formData.label,
            order: maxOrder + 1,
          }),
        });
        showSnackbar("Status created successfully", "success");
      }
      loadStatuses();
      handleCloseDialog();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to save status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this status?")) return;
    try {
      await request(`/pipeline-statuses/${id}`, { method: "DELETE" });
      showSnackbar("Status deleted successfully", "success");
      loadStatuses();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to delete status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === statuses.length - 1) return;

    const newStatuses = [...statuses];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap order values
    const tempOrder = newStatuses[index].order;
    newStatuses[index].order = newStatuses[targetIndex].order;
    newStatuses[targetIndex].order = tempOrder;

    // Swap positions in array
    [newStatuses[index], newStatuses[targetIndex]] = [newStatuses[targetIndex], newStatuses[index]];
    
    setStatuses(newStatuses); // Optimistic update

    try {
      await request("/pipeline-statuses/order", {
        method: "PUT",
        body: JSON.stringify({
          orders: newStatuses.map(s => ({ id: s.id, order: s.order }))
        }),
      });
    } catch (err) {
      showSnackbar("Failed to update order", "error");
      loadStatuses(); // Revert on error
    }
  };

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <AuroraTypography variant="h6">Pipeline Stages</AuroraTypography>
        <AuroraButton
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Stage
        </AuroraButton>
      </AuroraBox>

      <AuroraPaper variant="outlined">
        <AuroraList>
          {statuses.map((status, index) => (
            <div key={status.id}>
              <AuroraListItem>
                <AuroraListItemText
                  primary={status.label}
                  secondary={`Value: ${status.value}`}
                />
                <ListItemSecondaryAction>
                  <AuroraIconButton 
                    onClick={() => handleMove(index, "up")} 
                    disabled={index === 0}
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      width: 32,
                      height: 32
                    }}
                  >
                    <ArrowUpward fontSize="small" />
                  </AuroraIconButton>
                  <AuroraIconButton 
                    onClick={() => handleMove(index, "down")} 
                    disabled={index === statuses.length - 1}
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      width: 32,
                      height: 32
                    }}
                  >
                    <ArrowDownward fontSize="small" />
                  </AuroraIconButton>
                  <AuroraIconButton 
                    onClick={() => handleOpenDialog(status)} 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      borderRadius: 1,
                      width: 32,
                      height: 32
                    }}
                  >
                    <Edit fontSize="small" />
                  </AuroraIconButton>
                  <AuroraIconButton 
                    onClick={() => handleDelete(status.id)} 
                    size="small" 
                    color="error"
                    sx={{ 
                      borderRadius: 1,
                      width: 32,
                      height: 32
                    }}
                  >
                    <Delete fontSize="small" />
                  </AuroraIconButton>
                </ListItemSecondaryAction>
              </AuroraListItem>
              {index < statuses.length - 1 && <AuroraDivider />}
            </div>
          ))}
          {statuses.length === 0 && !loading && (
            <AuroraListItem>
              <AuroraListItemText primary="No pipeline stages defined" />
            </AuroraListItem>
          )}
        </AuroraList>
      </AuroraPaper>

      <AuroraDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <AuroraDialogTitle>{editingStatus ? "Edit Stage" : "Add New Stage"}</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <AuroraInput
              label="Stage Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
              required
            />
            <AuroraInput
              label="Internal Value (ID)"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              fullWidth
              required
              disabled={!!editingStatus}
              helperText={editingStatus ? "Cannot be changed after creation" : "Unique identifier for this stage (e.g., 'phone_screen')"}
            />
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={handleCloseDialog}>Cancel</AuroraButton>
          <AuroraButton 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.label || !formData.value}
          >
            Save
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
