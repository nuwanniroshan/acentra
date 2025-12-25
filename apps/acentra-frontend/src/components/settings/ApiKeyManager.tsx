import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraInput,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraTable,
  AuroraTableBody,
  AuroraTableCell,
  AuroraTableContainer,
  AuroraTableHead,
  AuroraTableRow,
  AuroraPaper,
  AuroraIconButton,
  AuroraAddIcon,
} from "@acentra/aurora-design-system";
import { Delete as DeleteIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import { apiKeysService } from "@/services/apiKeysService";
import type { ApiKey, GeneratedApiKey } from "@/services/apiKeysService";
import { useSnackbar } from "@/context/SnackbarContext";

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<GeneratedApiKey | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const data = await apiKeysService.getApiKeys();
      setKeys(data);
    } catch {
      showSnackbar("Error fetching API keys", "error");
    }
  };

  const handleGenerate = async () => {
    if (!keyName) return;
    try {
      const newKey = await apiKeysService.generateApiKey(keyName);
      setGeneratedKey(newKey);
      setKeyName("");
      fetchKeys();
    } catch {
      showSnackbar("Error generating API key", "error");
    }
  };

  const handleRevoke = async (id: string) => {
    if (window.confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      try {
        await apiKeysService.revokeApiKey(id);
        showSnackbar("API key revoked successfully", "success");
        fetchKeys();
      } catch {
        showSnackbar("Error revoking API key", "error");
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar("Copied to clipboard", "success");
  };

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", justifyContent: "flex-end", mb: 3, alignItems: "center" }}>
        <AuroraButton startIcon={<AuroraAddIcon />} onClick={() => setIsModalOpen(true)} variant="contained">
          Generate New Key
        </AuroraButton>
      </AuroraBox>

      <AuroraTableContainer component={AuroraPaper}>
        <AuroraTable>
          <AuroraTableHead>
            <AuroraTableRow>
              <AuroraTableCell>Name</AuroraTableCell>
              <AuroraTableCell>Key Preview</AuroraTableCell>
              <AuroraTableCell>Created</AuroraTableCell>
              <AuroraTableCell>Last Used</AuroraTableCell>
              <AuroraTableCell align="right">Actions</AuroraTableCell>
            </AuroraTableRow>
          </AuroraTableHead>
          <AuroraTableBody>
            {keys.length === 0 ? (
              <AuroraTableRow>
                <AuroraTableCell colSpan={5} align="center">
                  No API keys found.
                </AuroraTableCell>
              </AuroraTableRow>
            ) : (
              keys.map((key) => (
                <AuroraTableRow key={key.id}>
                  <AuroraTableCell>{key.name}</AuroraTableCell>
                  <AuroraTableCell>
                    <code>{key.maskedKey}</code>
                  </AuroraTableCell>
                  <AuroraTableCell>{new Date(key.createdAt).toLocaleDateString()}</AuroraTableCell>
                  <AuroraTableCell>
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never"}
                  </AuroraTableCell>
                  <AuroraTableCell align="right">
                    <AuroraIconButton color="error" onClick={() => handleRevoke(key.id)}>
                      <DeleteIcon />
                    </AuroraIconButton>
                  </AuroraTableCell>
                </AuroraTableRow>
              ))
            )}
          </AuroraTableBody>
        </AuroraTable>
      </AuroraTableContainer>

      <AuroraDialog open={isModalOpen} onClose={() => !generatedKey && setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <AuroraDialogTitle>
          {generatedKey ? "New API Key Generated" : "Generate New API Key"}
        </AuroraDialogTitle>
        <AuroraDialogContent>
          {generatedKey ? (
            <AuroraBox sx={{ mt: 1 }}>
              <AuroraTypography variant="body2" color="error" sx={{ mb: 2, fontWeight: "bold" }}>
                Make sure to copy your API key now. You won&apos;t be able to see it again!
              </AuroraTypography>
              <AuroraBox sx={{
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: "divider"
              }}>
                <AuroraTypography variant="body1" sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                  {generatedKey.key}
                </AuroraTypography>
                <AuroraIconButton onClick={() => handleCopy(generatedKey.key)}>
                  <CopyIcon />
                </AuroraIconButton>
              </AuroraBox>
            </AuroraBox>
          ) : (
            <AuroraBox sx={{ mt: 1 }}>
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                Give your API key a name to identify it easily.
              </AuroraTypography>
              <AuroraInput
                fullWidth
                label="Key Name"
                placeholder="e.g. Zapier Integration"
                value={keyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyName(e.target.value)}
              />
            </AuroraBox>
          )}
        </AuroraDialogContent>
        <AuroraDialogActions>
          {generatedKey ? (
            <AuroraButton onClick={() => {
              setGeneratedKey(null);
              setIsModalOpen(false);
            }} variant="contained">
              Done
            </AuroraButton>
          ) : (
            <>
              <AuroraButton onClick={() => setIsModalOpen(false)}>Cancel</AuroraButton>
              <AuroraButton onClick={handleGenerate} variant="contained" disabled={!keyName}>
                Generate
              </AuroraButton>
            </>
          )}
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
