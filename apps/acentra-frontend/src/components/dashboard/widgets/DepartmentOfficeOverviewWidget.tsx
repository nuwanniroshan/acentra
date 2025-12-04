import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { candidatesService } from "@/services/candidatesService";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { AuroraCard, AuroraCardContent, AuroraBox, AuroraTypography, AuroraTable, AuroraTableBody, AuroraTableCell, AuroraTableContainer, AuroraTableHead, AuroraTableRow, AuroraChip, AuroraLiveIconFolders } from '@acentra/aurora-design-system';

export const widgetName = 'department-office-overview';

interface DepartmentData {
  id: string;
  name: string;
  jobs: number;
  candidates: number;
}

interface OfficeData {
  id: string;
  name: string;
  jobs: number;
  candidates: number;
}

export function DepartmentOfficeOverviewWidget() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [offices, setOffices] = useState<OfficeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [jobsData, candidatesData, departmentsData, officesData] = await Promise.all([
        jobsService.getJobs(),
        candidatesService.getCandidates(),
        departmentsService.getDepartments(),
        officesService.getOffices()
      ]);

      // Process departments data
      const deptMap = new Map<string, DepartmentData>();
      departmentsData.forEach((dept: any) => {
        deptMap.set(dept.id, { id: dept.id, name: dept.name, jobs: 0, candidates: 0 });
      });

      // Count jobs by department
      jobsData.forEach((job: any) => {
        if (job.department_id && deptMap.has(job.department_id)) {
          deptMap.get(job.department_id)!.jobs++;
        }
      });

      // Count candidates by department (assuming candidates have department info)
      candidatesData.data?.forEach((candidate: any) => {
        if (candidate.department_id && deptMap.has(candidate.department_id)) {
          deptMap.get(candidate.department_id)!.candidates++;
        }
      });

      setDepartments(Array.from(deptMap.values()));

      // Process offices data
      const officeMap = new Map<string, OfficeData>();
      officesData.forEach((office: any) => {
        officeMap.set(office.id, { id: office.id, name: office.name, jobs: 0, candidates: 0 });
      });

      // Count jobs by office
      jobsData.forEach((job: any) => {
        if (job.office_id && officeMap.has(job.office_id)) {
          officeMap.get(job.office_id)!.jobs++;
        }
      });

      // Count candidates by office
      candidatesData.data?.forEach((candidate: any) => {
        if (candidate.office_id && officeMap.has(candidate.office_id)) {
          officeMap.get(candidate.office_id)!.candidates++;
        }
      });

      setOffices(Array.from(officeMap.values()));

    } catch (err: any) {
      console.error('Failed to load department/office data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ height: '100%' }}>
        <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
          <AuroraTypography variant="body2">Loading...</AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    );
  }

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AuroraLiveIconFolders width={24} height={24} stroke="#1976d2" />
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
          Department & Office Overview
        </AuroraTypography>
      </AuroraBox>

      <AuroraBox sx={{ display: 'flex', gap: 3 }}>
        {/* Departments Table */}
        <AuroraCard sx={{ flex: 1 }}>
          <AuroraCardContent sx={{ p: 0 }}>
            <AuroraBox sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                Departments
              </AuroraTypography>
            </AuroraBox>
            <AuroraTableContainer>
              <AuroraTable size="small">
                <AuroraTableHead>
                  <AuroraTableRow>
                    <AuroraTableCell>Department</AuroraTableCell>
                    <AuroraTableCell align="center">Jobs</AuroraTableCell>
                    <AuroraTableCell align="center">Candidates</AuroraTableCell>
                  </AuroraTableRow>
                </AuroraTableHead>
                <AuroraTableBody>
                  {departments.length === 0 ? (
                    <AuroraTableRow>
                      <AuroraTableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <AuroraTypography variant="body2" color="text.secondary">
                          No departments found
                        </AuroraTypography>
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ) : (
                    departments.map((dept) => (
                      <AuroraTableRow key={dept.id}>
                        <AuroraTableCell>
                          <AuroraTypography variant="body2" sx={{ fontWeight: 500 }}>
                            {dept.name}
                          </AuroraTypography>
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraChip
                            label={dept.jobs}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraChip
                            label={dept.candidates}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </AuroraTableCell>
                      </AuroraTableRow>
                    ))
                  )}
                </AuroraTableBody>
              </AuroraTable>
            </AuroraTableContainer>
          </AuroraCardContent>
        </AuroraCard>

        {/* Offices Table */}
        <AuroraCard sx={{ flex: 1 }}>
          <AuroraCardContent sx={{ p: 0 }}>
            <AuroraBox sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                Offices
              </AuroraTypography>
            </AuroraBox>
            <AuroraTableContainer>
              <AuroraTable size="small">
                <AuroraTableHead>
                  <AuroraTableRow>
                    <AuroraTableCell>Office</AuroraTableCell>
                    <AuroraTableCell align="center">Jobs</AuroraTableCell>
                    <AuroraTableCell align="center">Candidates</AuroraTableCell>
                  </AuroraTableRow>
                </AuroraTableHead>
                <AuroraTableBody>
                  {offices.length === 0 ? (
                    <AuroraTableRow>
                      <AuroraTableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <AuroraTypography variant="body2" color="text.secondary">
                          No offices found
                        </AuroraTypography>
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ) : (
                    offices.map((office) => (
                      <AuroraTableRow key={office.id}>
                        <AuroraTableCell>
                          <AuroraTypography variant="body2" sx={{ fontWeight: 500 }}>
                            {office.name}
                          </AuroraTypography>
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraChip
                            label={office.jobs}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraChip
                            label={office.candidates}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </AuroraTableCell>
                      </AuroraTableRow>
                    ))
                  )}
                </AuroraTableBody>
              </AuroraTable>
            </AuroraTableContainer>
          </AuroraCardContent>
        </AuroraCard>
      </AuroraBox>
    </AuroraBox>
  );
}