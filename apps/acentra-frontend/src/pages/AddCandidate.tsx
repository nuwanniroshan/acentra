import { useState, useRef, useEffect } from "react";
import { ActionPermission } from "@acentra/shared-types";
import { useAuth } from "@/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  AuroraBox,
  AuroraTypography,
  AuroraInput,
  AuroraButton,
  AuroraIconButton,
  AuroraPaper,
  AuroraCameraAltIcon,
  AuroraAddIcon,
  AuroraCloseIcon,
  AuroraDragIndicatorIcon,
  AuroraExpandMoreIcon,
  AuroraArrowBackIcon,
} from "@acentra/aurora-design-system";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { candidatesService } from "@/services/candidatesService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import { AuroraFileUpload } from "@/components/AuroraFileUpload";

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
}

export function AddCandidate() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const tenant = useTenant();
  const { hasPermission } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hasPermission(ActionPermission.CREATE_CANDIDATES)) {
      showSnackbar("You do not have permission to add candidates", "error");
      navigate(`/${tenant}/dashboard`);
    }
  }, [hasPermission, navigate, tenant, showSnackbar]);

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<string>("");

  // Education
  const [education, setEducation] = useState<EducationEntry[]>([
    {
      id: "1",
      institution: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  ]);

  // Experience
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    {
      id: "1",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  ]);

  // Additional Information
  const [desiredSalary, setDesiredSalary] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [website, setWebsite] = useState("");

  // Documents
  const [cv, setCv] = useState<File | null>(null);

  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        location: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const updateEducation = (
    id: string,
    field: keyof EducationEntry,
    value: string
  ) => {
    setEducation(
      education.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceEntry,
    value: string
  ) => {
    setExperience(
      experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmit = async (isDraft = false) => {
    // Validate required fields
    const name = `${firstName} ${lastName}`.trim();
    if (!name || (!isDraft && !cv)) {
      showSnackbar("Please fill in name and upload CV", "error");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("current_address", currentAddress);
    formData.append("jobId", jobId || "");
    if (cv) formData.append("cv", cv);

    if (profilePicture) formData.append("profile_picture", profilePicture);
    if (education.length > 0)
      formData.append("education", JSON.stringify(education));
    if (experience.length > 0)
      formData.append("experience", JSON.stringify(experience));
    if (desiredSalary) formData.append("desired_salary", desiredSalary);
    if (referredBy) formData.append("referred_by", referredBy);
    if (website) formData.append("website", website);

    try {
      await candidatesService.createCandidate({
        name,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        current_address: currentAddress,
        jobId: jobId || "",
        cv: cv || undefined,
        profile_picture: profilePicture || undefined,
        education,
        experience,
        desired_salary: desiredSalary ? parseFloat(desiredSalary) : undefined,
        referred_by: referredBy,
        website,
      });

      showSnackbar(
        isDraft ? "Candidate saved as draft" : "Candidate added successfully",
        "success"
      );
      navigate(`/${tenant}/ats/jobs/${jobId}`);
    } catch {
      showSnackbar("Failed to add candidate", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuroraBox sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <AuroraTypography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Add New Candidate
      </AuroraTypography>

      <AuroraButton
        startIcon={<AuroraArrowBackIcon />}
        onClick={() => navigate(`/${tenant}/ats/jobs/${jobId}`)}
        sx={{ mb: 3 }}
      >
        Back to Job
      </AuroraButton>

      {/* Personal Information */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
          <AuroraTypography component="span" sx={{ fontWeight: 700 }}>
            Personal Information
          </AuroraTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <AuroraBox
              sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}
            >
              {/* Avatar Upload */}
              <AuroraBox
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <AuroraBox
                  onClick={() => profilePictureInputRef.current?.click()}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    border: "2px dashed",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "background.default",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.main", transform: "scale(1.02)" },
                  }}
                >
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <AuroraCameraAltIcon
                        sx={{ fontSize: 32, color: "text.secondary", mb: 1 }}
                      />
                      <AuroraTypography
                        variant="caption"
                        color="text.secondary"
                      >
                        Upload Avatar
                      </AuroraTypography>
                    </>
                  )}
                </AuroraBox>
                <input
                  ref={profilePictureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: "none" }}
                />
              </AuroraBox>

              {/* Name Fields */}
              <AuroraBox
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <AuroraBox sx={{ display: "flex", gap: 2 }}>
                  <AuroraInput
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <AuroraInput
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </AuroraBox>
                <AuroraBox sx={{ display: "flex", gap: 2 }}>
                  <AuroraInput
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AuroraInput
                    fullWidth
                    label="Phone No"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </AuroraBox>
              </AuroraBox>
            </AuroraBox>

            <AuroraInput
              fullWidth
              label="Current Address"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              multiline
              rows={2}
            />
          </AuroraBox>
        </AccordionDetails>
      </Accordion>

      {/* Education */}
      <Accordion>
        <AccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
          <AuroraTypography component="span" sx={{ fontWeight: 700 }}>Education</AuroraTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {education.map((edu, index) => (
              <AuroraPaper
                key={edu.id}
                variant="outlined"
                sx={{ p: 2, position: "relative", borderRadius: 2 }}
              >
                <AuroraBox
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AuroraDragIndicatorIcon
                    sx={{ color: "text.secondary", cursor: "grab" }}
                  />
                  <AuroraTypography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    Education {index + 1}
                  </AuroraTypography>
                  {education.length > 1 && (
                    <AuroraIconButton
                      size="small"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <AuroraCloseIcon fontSize="small" />
                    </AuroraIconButton>
                  )}
                </AuroraBox>
                <AuroraBox
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <AuroraBox sx={{ display: "flex", gap: 2 }}>
                    <AuroraInput
                      fullWidth
                      label="Institution Name"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, "institution", e.target.value)
                      }
                    />
                    <AuroraInput
                      fullWidth
                      label="Degree/Field of Study"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                    />
                  </AuroraBox>
                  <AuroraBox sx={{ display: "flex", gap: 2 }}>
                    <AuroraInput
                      fullWidth
                      label="Location"
                      value={edu.location}
                      onChange={(e) =>
                        updateEducation(edu.id, "location", e.target.value)
                      }
                    />
                    <AuroraInput
                      fullWidth
                      label="Time period"
                      placeholder="e.g., 2018 - 2022"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, "startDate", e.target.value)
                      }
                    />
                  </AuroraBox>
                </AuroraBox>
              </AuroraPaper>
            ))}
            <AuroraButton
              startIcon={<AuroraAddIcon />}
              onClick={addEducation}
              sx={{ alignSelf: "flex-start" }}
            >
              Add More
            </AuroraButton>
          </AuroraBox>
        </AccordionDetails>
      </Accordion>

      {/* Experience */}
      <Accordion>
        <AccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
          <AuroraTypography component="span" sx={{ fontWeight: 700 }}>Experience</AuroraTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {experience.map((exp, index) => (
              <AuroraPaper
                key={exp.id}
                variant="outlined"
                sx={{ p: 2, position: "relative", borderRadius: 2 }}
              >
                <AuroraBox
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AuroraDragIndicatorIcon
                    sx={{ color: "text.secondary", cursor: "grab" }}
                  />
                  <AuroraTypography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    Experience {index + 1}
                  </AuroraTypography>
                  {experience.length > 1 && (
                    <AuroraIconButton
                      size="small"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <AuroraCloseIcon fontSize="small" />
                    </AuroraIconButton>
                  )}
                </AuroraBox>
                <AuroraBox
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <AuroraBox sx={{ display: "flex", gap: 2 }}>
                    <AuroraInput
                      fullWidth
                      label="Institution Name"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                    />
                    <AuroraInput
                      fullWidth
                      label="Position"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, "position", e.target.value)
                      }
                    />
                  </AuroraBox>
                  <AuroraBox sx={{ display: "flex", gap: 2 }}>
                    <AuroraInput
                      fullWidth
                      label="Location"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, "location", e.target.value)
                      }
                    />
                    <AuroraInput
                      fullWidth
                      label="Time period"
                      placeholder="e.g., Jan 2020 - Present"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </AuroraBox>
                </AuroraBox>
              </AuroraPaper>
            ))}
            <AuroraButton
              startIcon={<AuroraAddIcon />}
              onClick={addExperience}
              sx={{ alignSelf: "flex-start" }}
            >
              Add More
            </AuroraButton>
          </AuroraBox>
        </AccordionDetails>
      </Accordion>

      {/* Additional Information */}
      <Accordion>
        <AccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
          <AuroraTypography component="span" sx={{ fontWeight: 700 }}>
            Additional Information
          </AuroraTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <AuroraBox sx={{ display: "flex", gap: 2 }}>
              <AuroraInput
                fullWidth
                label="Desired Salary"
                type="number"
                value={desiredSalary}
                onChange={(e) => setDesiredSalary(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <AuroraTypography sx={{ mr: 1 }}>$</AuroraTypography>
                  ),
                }}
              />
              <AuroraInput
                fullWidth
                label="Referred by"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
              />
            </AuroraBox>
            <AuroraInput
              fullWidth
              label="Website/portfolio"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </AuroraBox>
        </AccordionDetails>
      </Accordion>

      {/* Documents */}
      <Accordion>
        <AccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
          <AuroraTypography component="span" sx={{ fontWeight: 700 }}>Documents</AuroraTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AuroraBox sx={{ p: 1 }}>
            <AuroraTypography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Candidate CV/Resume
            </AuroraTypography>

            <AuroraFileUpload
              label="Drop Resume here"
              description="PDF files (Max 5MB)"
              maxSize={5 * 1024 * 1024}
              onFileSelect={(f) => setCv(f)}
              value={cv}
            />

            <AuroraTypography
              variant="caption"
              color="info.main"
              sx={{ display: "block", mt: 2, fontWeight: 500 }}
            >
              * Document is required for AI screening and evaluation features.
            </AuroraTypography>
          </AuroraBox>
        </AccordionDetails>
      </Accordion>

      {/* Action Buttons */}
      <AuroraBox
        sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 5 }}
      >
        <AuroraButton
          onClick={() => navigate(`/${tenant}/ats/jobs/${jobId}`)}
          disabled={submitting}
          sx={{ px: 4 }}
        >
          Cancel
        </AuroraButton>
        <AuroraButton
          variant="contained"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          sx={{ px: 6 }}
        >
          {submitting ? "Submitting..." : "Add Candidate"}
        </AuroraButton>
      </AuroraBox>
    </AuroraBox>
  );
}
