import { AuroraBox, AuroraTypography, AuroraIconButton, AuroraAvatar, AuroraList, AuroraListItem, AuroraListItemText, AuroraListItemAvatar, AuroraDescriptionIcon, AuroraDownloadIcon, AuroraCloseIcon } from '@acentra/aurora-design-system';
import { API_URL } from "@/services/clients";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCommentAttachment, fetchComments } from "@/store/commentsSlice";

interface CandidateAttachmentsProps {
  candidateId: string;
}

export function CandidateAttachments({ candidateId }: CandidateAttachmentsProps) {
  const dispatch = useAppDispatch();
  const { comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);

  const attachments = comments.filter(c => c.attachment_path);

  const handleDeleteAttachment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        await dispatch(deleteCommentAttachment(commentId)).unwrap();
        dispatch(fetchComments(candidateId));
      } catch (err) {
        console.error("Failed to delete attachment", err);
      }
    }
  };

  return (
    <AuroraBox>
      <AuroraTypography variant="h6" gutterBottom>Attachments</AuroraTypography>
      {attachments.length === 0 ? (
        <AuroraTypography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No attachments found
        </AuroraTypography>
      ) : (
        <AuroraList>
          {attachments.map((comment) => (
            <AuroraListItem key={comment.id} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
              <AuroraListItemAvatar>
                <AuroraAvatar sx={{ bgcolor: "primary.light" }}>
                  <AuroraDescriptionIcon />
                </AuroraAvatar>
              </AuroraListItemAvatar>
              <AuroraListItemText
                primary={comment.attachment_original_name}
                secondary={
                  <>
                    <AuroraTypography variant="caption" display="block">
                      Uploaded by {comment.created_by.name || comment.created_by.email} on {new Date(comment.created_at).toLocaleDateString()}
                    </AuroraTypography>
                    <AuroraTypography variant="caption" display="block">
                      Size: {comment.attachment_size ? (comment.attachment_size / 1024).toFixed(2) : '0'} KB
                    </AuroraTypography>
                  </>
                }
              />
              <AuroraBox>
                <a
                  href={`${API_URL}/comments/${comment.id}/attachment?token=${localStorage.getItem("token")}`}
                  target="_blank"
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  <AuroraDownloadIcon />
                </a>
                {(user?.id === comment.created_by.id || user?.role === 'admin') && (
                   <AuroraIconButton 
                     color="error"
                     onClick={() => handleDeleteAttachment(comment.id)}
                   >
                     <AuroraCloseIcon />
                   </AuroraIconButton>
                )}
              </AuroraBox>
            </AuroraListItem>
          ))}
        </AuroraList>
      )}
    </AuroraBox>
  );
}
