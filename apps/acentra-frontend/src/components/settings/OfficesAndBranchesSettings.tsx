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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

export function OfficesAndBranchesSettings() {
  const [offices, setOffices] = useState<Office[]>([
    {
      id: '1',
      name: 'Headquarters',
      address: '123 Main St',
      city: 'San Francisco',
      country: 'USA',
    },
    {
      id: '2',
      name: 'New York Office',
      address: '456 Park Ave',
      city: 'New York',
      country: 'USA',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);

  const handleAddOffice = () => {
    setIsEditing(true);
    setEditingOffice({
      id: Date.now().toString(),
      name: '',
      address: '',
      city: '',
      country: '',
    });
  };

  const handleEditOffice = (office: Office) => {
    setIsEditing(true);
    setEditingOffice(office);
  };

  const handleDeleteOffice = (id: string) => {
    setOffices(offices.filter((o) => o.id !== id));
  };

  const handleSaveOffice = () => {
    if (editingOffice) {
      const exists = offices.find((o) => o.id === editingOffice.id);
      if (exists) {
        setOffices(offices.map((o) => (o.id === editingOffice.id ? editingOffice : o)));
      } else {
        setOffices([...offices, editingOffice]);
      }
      setIsEditing(false);
      setEditingOffice(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingOffice(null);
  };

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <AuroraBox>
          <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Offices & Branches
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Manage your organization's office locations and branches
          </AuroraTypography>
        </AuroraBox>
        {!isEditing && (
          <AuroraButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddOffice}
          >
            Add Office
          </AuroraButton>
        )}
      </AuroraBox>

      {isEditing && editingOffice ? (
        <AuroraCard sx={{ mb: 3, border: 2, borderColor: 'primary.main' }}>
          <AuroraCardContent>
            <AuroraTypography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {offices.find((o) => o.id === editingOffice.id) ? 'Edit Office' : 'Add New Office'}
            </AuroraTypography>
            <AuroraGrid container spacing={2}>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="Office Name"
                  value={editingOffice.name}
                  onChange={(e) => setEditingOffice({ ...editingOffice, name: e.target.value })}
                  placeholder="e.g., Headquarters"
                />
              </AuroraGrid>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="Address"
                  value={editingOffice.address}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                  placeholder="e.g., 123 Main St"
                />
              </AuroraGrid>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="City"
                  value={editingOffice.city}
                  onChange={(e) => setEditingOffice({ ...editingOffice, city: e.target.value })}
                  placeholder="e.g., San Francisco"
                />
              </AuroraGrid>
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraTextField
                  fullWidth
                  label="Country"
                  value={editingOffice.country}
                  onChange={(e) => setEditingOffice({ ...editingOffice, country: e.target.value })}
                  placeholder="e.g., USA"
                />
              </AuroraGrid>
            </AuroraGrid>
            <AuroraBox sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <AuroraButton variant="outlined" onClick={handleCancel}>
                Cancel
              </AuroraButton>
              <AuroraButton
                variant="contained"
                onClick={handleSaveOffice}
                disabled={!editingOffice.name || !editingOffice.city}
              >
                Save Office
              </AuroraButton>
            </AuroraBox>
          </AuroraCardContent>
        </AuroraCard>
      ) : null}

      <AuroraGrid container spacing={2}>
        {offices.map((office) => (
          <AuroraGrid key={office.id} size={{ xs: 12, md: 6 }}>
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
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      }}
                    >
                      <BusinessIcon />
                    </AuroraBox>
                    <AuroraBox>
                      <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                        {office.name}
                      </AuroraTypography>
                    </AuroraBox>
                  </AuroraBox>
                  <AuroraBox sx={{ display: 'flex', gap: 0.5 }}>
                    <AuroraIconButton size="small" onClick={() => handleEditOffice(office)}>
                      <EditIcon fontSize="small" />
                    </AuroraIconButton>
                    <AuroraIconButton size="small" color="error" onClick={() => handleDeleteOffice(office.id)}>
                      <DeleteIcon fontSize="small" />
                    </AuroraIconButton>
                  </AuroraBox>
                </AuroraBox>
                <AuroraBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: 'text.secondary' }}>
                  <LocationOnIcon fontSize="small" sx={{ mt: 0.5 }} />
                  <AuroraBox>
                    <AuroraTypography variant="body2">{office.address}</AuroraTypography>
                    <AuroraTypography variant="body2">
                      {office.city}, {office.country}
                    </AuroraTypography>
                  </AuroraBox>
                </AuroraBox>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>
        ))}
      </AuroraGrid>

      {offices.length === 0 && !isEditing && (
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
          <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <AuroraTypography variant="h6" color="text.secondary" gutterBottom>
            No offices yet
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first office location to get started
          </AuroraTypography>
          <AuroraButton variant="contained" startIcon={<AddIcon />} onClick={handleAddOffice}>
            Add Office
          </AuroraButton>
        </AuroraBox>
      )}
    </AuroraBox>
  );
}
