import React, { useState } from "react";
import {
  AuroraBox,
  AuroraTextField,
  AuroraButton,
  AuroraStack,
  AuroraTypography,
  AuroraChip,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSearchIcon,
  AuroraFilterListIcon,
  alpha,
} from "@acentra/aurora-design-system";
import { Popover, Badge } from "@mui/material";

export interface FilterOption {
  value: string;
  label: string;
}

export interface AdvancedFilterProps {
  onFilterChange: (filters: any) => void;
  searchPlaceholder?: string;
  options: {
    statuses?: FilterOption[];
    departments?: FilterOption[];
    branches?: FilterOption[];
    recruiters?: FilterOption[];
    jobs?: FilterOption[];
  };
  type: "jobs" | "candidates";
}

export function AdvancedFilter({ onFilterChange, searchPlaceholder, options, type }: AdvancedFilterProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (name: string, value: any) => {
    const newFilters = { ...filters, [name]: value };
    if (!value || value === "all") {
      delete newFilters[name];
    }
    setFilters(newFilters);
    onFilterChange({ ...newFilters, search });
  };

  const handleApplySearch = () => {
    onFilterChange({ ...filters, search });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplySearch();
    }
  };

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilters({});
    setSearch("");
    onFilterChange({});
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange({ ...newFilters, search });
  };

  const open = Boolean(anchorEl);
  const activeFilterCount = Object.keys(filters).length;

  return (
    <AuroraBox sx={{ mb: 3 }}>
      <AuroraStack direction="row" spacing={2} alignItems="center">
        <AuroraTextField
          placeholder={searchPlaceholder || "Search..."}
          size="small"
          value={search}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: <AuroraSearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
          }}
        />
        <AuroraButton variant="outlined" onClick={handleApplySearch}>
          Search
        </AuroraButton>

        <Badge badgeContent={activeFilterCount} color="primary">
          <AuroraButton
            variant="outlined"
            startIcon={<AuroraFilterListIcon />}
            onClick={handleOpenFilters}
            sx={{
              bgcolor: open ? alpha("#3385F0", 0.05) : "transparent",
              borderColor: open ? "primary.main" : "divider"
            }}
          >
            Filters
          </AuroraButton>
        </Badge>

        {activeFilterCount > 0 && (
          <AuroraButton variant="text" size="small" color="secondary" onClick={clearFilters}>
            Clear all
          </AuroraButton>
        )}
      </AuroraStack>

      {/* Active Filter Chips */}
      <AuroraStack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
        {Object.entries(filters).map(([key, value]) => {
          let label = "";
          let valueLabel = value;

          if (key === "status") {
            label = "Status";
            valueLabel = options.statuses?.find(o => o.value === value)?.label || value;
          } else if (key === "department") {
            label = "Dept";
            valueLabel = options.departments?.find(o => o.value === value)?.label || value;
          } else if (key === "branch") {
            label = "Office";
            valueLabel = options.branches?.find(o => o.value === value)?.label || value;
          } else if (key === "assigneeId") {
            label = "Recruiter";
            valueLabel = options.recruiters?.find(o => o.value === value)?.label || value;
          } else if (key === "jobId") {
            label = "Job";
            valueLabel = options.jobs?.find(o => o.value === value)?.label || value;
          }

          return (
            <AuroraChip
              key={key}
              label={`${label}: ${valueLabel}`}
              onDelete={() => removeFilter(key)}
              size="small"
              sx={{
                bgcolor: alpha("#3385F0", 0.08),
                color: "primary.main",
                fontWeight: 600,
                border: `1px solid ${alpha("#3385F0", 0.2)}`
              }}
            />
          );
        })}
      </AuroraStack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { p: 3, width: 320, mt: 1, borderRadius: 2, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }
        }}
      >
        <AuroraStack spacing={3}>
          <AuroraTypography variant="subtitle2" fontWeight="bold">
            Filter by
          </AuroraTypography>

          <AuroraFormControl fullWidth size="small">
            <AuroraInputLabel>Status</AuroraInputLabel>
            <AuroraSelect
              value={filters.status || "all"}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <AuroraMenuItem value="all">All Statuses</AuroraMenuItem>
              {options.statuses?.map((opt) => (
                <AuroraMenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </AuroraMenuItem>
              ))}
            </AuroraSelect>
          </AuroraFormControl>

          {type === "jobs" && (
            <>
              <AuroraFormControl fullWidth size="small">
                <AuroraInputLabel>Department</AuroraInputLabel>
                <AuroraSelect
                  value={filters.department || "all"}
                  label="Department"
                  onChange={(e) => handleFilterChange("department", e.target.value)}
                >
                  <AuroraMenuItem value="all">All Departments</AuroraMenuItem>
                  {options.departments?.map((opt) => (
                    <AuroraMenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>

              <AuroraFormControl fullWidth size="small">
                <AuroraInputLabel>Office/Branch</AuroraInputLabel>
                <AuroraSelect
                  value={filters.branch || "all"}
                  label="Office/Branch"
                  onChange={(e) => handleFilterChange("branch", e.target.value)}
                >
                  <AuroraMenuItem value="all">All Offices</AuroraMenuItem>
                  {options.branches?.map((opt) => (
                    <AuroraMenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
            </>
          )}

          {type === "candidates" && (
            <AuroraFormControl fullWidth size="small">
              <AuroraInputLabel>Job</AuroraInputLabel>
              <AuroraSelect
                value={filters.jobId || "all"}
                label="Job"
                onChange={(e) => handleFilterChange("jobId", e.target.value)}
              >
                <AuroraMenuItem value="all">All Jobs</AuroraMenuItem>
                {options.jobs?.map((opt) => (
                  <AuroraMenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </AuroraMenuItem>
                ))}
              </AuroraSelect>
            </AuroraFormControl>
          )}

          <AuroraFormControl fullWidth size="small">
            <AuroraInputLabel>Assigned Recruiter</AuroraInputLabel>
            <AuroraSelect
              value={filters.assigneeId || "all"}
              label="Assigned Recruiter"
              onChange={(e) => handleFilterChange("assigneeId", e.target.value)}
            >
              <AuroraMenuItem value="all">All Recruiters</AuroraMenuItem>
              {options.recruiters?.map((opt) => (
                <AuroraMenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </AuroraMenuItem>
              ))}
            </AuroraSelect>
          </AuroraFormControl>

          <AuroraButton fullWidth variant="contained" onClick={handleCloseFilters}>
            Apply Filters
          </AuroraButton>
        </AuroraStack>
      </Popover>
    </AuroraBox>
  );
}
