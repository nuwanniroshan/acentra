import { useState } from 'react';
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraTextField,
  AuroraGrid,
  AuroraCard,
  AuroraCardContent,
  AuroraIconButton,
} from '@acentra/aurora-design-system';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface Department {
  id: string;
  name: string;
  description: string;
  headCount: number;
}

export function DepartmentSettings() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      description: 'Software development and technical operations',
      headCount: 45,
    },
    {
      id: '2',
      name: 'Human Resources',
      description: 'Talent acquisition and employee relations',
      headCount: 12,
    },
    {
      id: '3',
      name: 'Sales',
      description: 'Business development and customer acquisition',
      headCount: 28,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleAddDepartment = () => {
    setIsEditing(true);
    setEditingDepartment({
      id: Date.now().toString(),
      name: '',
      description: '',
      headCount: 0,
    });
  };

  const handleEditDepartment = (department: Department) => {
    setIsEditing(true);
    setEditingDepartment(department);
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const handleSaveDepartment = () => {
    if (editingDepartment) {
      const exists = departments.find((d) => d.id === editingDepartment.id);
      if (exists) {
        setDepartments(departments.map((d) => (d.id === editingDepartment.id ? editingDepartment : d)));
      } else {
        setDepartments([...departments, editingDepartment]);
      }
      setIsEditing(false);
      setEditingDepartment(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingDepartment(null);
  };

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <AuroraBox>
          <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Departments
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Manage your organization's departments and teams
          </AuroraTypography>
        </AuroraBox>
        {!isEditing && (
          <AuroraButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDepartment}
          >
            Add Department
          </AuroraButton>
        )}
      </AuroraBox>

      {isEditing && editingDepartment ? (
        <AuroraCard sx={{ mb: 3, border: 2, borderColor: 'primary.main' }}>
          <AuroraCardContent>
            <AuroraTypography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {departments.find((d) => d.id === editingDepartment.id) ? 'Edit Department' : 'Add New Department'}
            </AuroraTypography>
            <AuroraGrid container spacing={2}>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="Department Name"
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                  placeholder="e.g., Engineering"
                />
              </AuroraGrid>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="Head Count"
                  type="number"
                  value={editingDepartment.headCount}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, headCount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </AuroraGrid>
              <AuroraGrid size={{ xs: 12 }}>
                <AuroraTextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editingDepartment.description}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                  placeholder="Brief description of the department"
                />
              </AuroraGrid>
            </AuroraGrid>
            <AuroraBox sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <AuroraButton variant="outlined" onClick={handleCancel}>
                Cancel
              </AuroraButton>
              <AuroraButton
                variant="contained"
                onClick={handleSaveDepartment}
                disabled={!editingDepartment.name}
              >
                Save Department
              </AuroraButton>
            </AuroraBox>
          </AuroraCardContent>
        </AuroraCard>
      ) : null}

      <AuroraGrid container spacing={2}>
        {departments.map((department) => (
          <AuroraGrid key={department.id} size={{ xs: 12, md: 6 }}>
            <AuroraCard
              sx={{
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <AuroraCardContent>
                <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AuroraBox
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'success.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'success.main',
                      }}
                    >
                      <AccountTreeIcon />
                    </AuroraBox>
                    <AuroraBox>
                      <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                        {department.name}
                      </AuroraTypography>
                      <AuroraTypography variant="caption" color="text.secondary">
                        {department.headCount} {department.headCount === 1 ? 'employee' : 'employees'}
                      </AuroraTypography>
                    </AuroraBox>
                  </AuroraBox>
                  <AuroraBox sx={{ display: 'flex', gap: 0.5 }}>
                    <AuroraIconButton size="small" onClick={() => handleEditDepartment(department)}>
                      <EditIcon fontSize="small" />
                    </AuroraIconButton>
                    <AuroraIconButton size="small" color="error" onClick={() => handleDeleteDepartment(department.id)}>
                      <DeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </AuroraBox>
                </AuroraBox>
                <AuroraTypography variant="body2" color="text.secondary">
                  {department.description}
                </AuroraTypography>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>
        ))}
      </AuroraGrid>

      {departments.length === 0 && !isEditing && (
        <AuroraBox
          sx={{
            textAlign: 'center',
            py: 8,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <AccountTreeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <AuroraTypography variant="h6" color="text.secondary" gutterBottom>
            No departments yet
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first department to get started
          </AuroraTypography>
          <AuroraButton variant="contained" startIcon={<AddIcon />} onClick={handleAddDepartment}>
            Add Department
          </AuroraButton>
        </AuroraBox>
      )}
    </AuroraBox>
  );
}
