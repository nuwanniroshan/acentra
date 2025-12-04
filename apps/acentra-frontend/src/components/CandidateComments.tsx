import { useState, useEffect } from "react";
import { AuroraBox, AuroraTypography, AuroraIconButton, AuroraAvatar, AuroraInput, AuroraList, AuroraListItem, AuroraListItemText, AuroraListItemAvatar, AuroraChip, AuroraSendIcon, AuroraUploadIcon, AuroraExpandMoreIcon, AuroraExpandLessIcon, AuroraDescriptionIcon, AuroraDownloadIcon, AuroraCloseIcon } from '@acentra/aurora-design-system';
import { API_URL, API_BASE_URL } from "@/services/clients";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchComments, addComment, deleteCommentAttachment, clearComments, type Comment } from "@/store/commentsSlice";

interface CandidateCommentsProps {
  candidateId: string;
  onAttachmentsChange?: () => void;
}

export function CandidateComments({ candidateId, onAttachmentsChange }: CandidateCommentsProps) {
  const dispatch = useAppDispatch();
  const { comments, loading } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);
  
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(true);

  useEffect(() => {
    if (candidateId) {
      dispatch(fetchComments(candidateId));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [candidateId, dispatch]);

  const handleAddComment = async () => {
    if (!candidateId || (!newComment.trim() && !attachment)) return;
    try {
      await dispatch(addComment({ 
        candidateId, 
        text: newComment, 
        attachment: attachment || undefined 
      })).unwrap();
      setNewComment("");
      setAttachment(null);
      // Refresh comments to get the full data
      dispatch(fetchComments(candidateId));
      if (attachment && onAttachmentsChange) {
        onAttachmentsChange();
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteAttachment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        await dispatch(deleteCommentAttachment(commentId)).unwrap();
        dispatch(fetchComments(candidateId));
        if (onAttachmentsChange) {
          onAttachmentsChange();
        }
      } catch (err) {
        console.error("Failed to delete attachment", err);
      }
    }
  };

  return (
    <AuroraBox sx={{ 
      borderTop: "2px solid", 
      borderColor: "divider", 
      bgcolor: "background.paper",
      display: "flex",
      flexDirection: "column",
      height: isCommentsExpanded ? "300px" : "auto"
    }}>
      <AuroraBox 
        sx={{ 
          p: 2, 
          pb: 1, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" }
        }}
        onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
      >
        <AuroraTypography variant="subtitle1" fontWeight="bold">
          Comments ({comments.length})
        </AuroraTypography>
        <AuroraIconButton size="small">
          {isCommentsExpanded ? <AuroraExpandLessIcon /> : <AuroraExpandMoreIcon />}
        </AuroraIconButton>
      </AuroraBox>
      
      {isCommentsExpanded && (
        <>
          {/* Comments List - Scrollable */}
          <AuroraBox sx={{ flexGrow: 1, overflowY: "auto", px: 2, minHeight: 0 }}>
            {comments.length === 0 ? (
              <AuroraTypography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No comments yet
              </AuroraTypography>
            ) : (
              <AuroraList sx={{ py: 0 }}>
                {[...comments].reverse().map((comment) => (
                  <AuroraListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <AuroraListItemAvatar>
                      <AuroraAvatar
                        src={comment.created_by.profile_picture ? `${API_BASE_URL}/${comment.created_by.profile_picture}` : undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        {comment.created_by.name?.charAt(0) || comment.created_by.email.charAt(0)}
                      </AuroraAvatar>
                    </AuroraListItemAvatar>
                    <AuroraListItemText
                      primary={
                        <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <AuroraTypography variant="body2" fontWeight="medium">
                            {comment.created_by.name || comment.created_by.email}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" color="text.secondary">
                            {new Date(comment.created_at).toLocaleString()}
                          </AuroraTypography>
                        </AuroraBox>
                      }
                      secondary={
                        <>
                          <span style={{ marginTop: "4px", fontSize: "14px", lineHeight: "1.5", display: "block" }}>
                            {comment.text}
                          </span>
                          {comment.attachment_path && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                              <a
                                href={`${API_URL}/comments/${comment.id}/attachment?token=${localStorage.getItem("token")}`}
                                target="_blank"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '4px 8px',
                                  border: '1px solid rgba(0, 0, 0, 0.23)',
                                  borderRadius: '16px',
                                  textDecoration: 'none',
                                  color: 'rgba(0, 0, 0, 0.87)',
                                  fontSize: '13px',
                                  cursor: 'pointer'
                                }}
                              >
                                <AuroraDescriptionIcon fontSize="small" />
                                {comment.attachment_original_name}
                              </a>
                            </span>
                          )}
                        </>
                      }
                    />
                  </AuroraListItem>
                ))}
              </AuroraList>
            )}
          </AuroraBox>

          {/* Add Comment Input - Fixed at bottom */}
          <AuroraBox sx={{ p: 2, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
            <AuroraBox sx={{ display: "flex", gap: 1, flexDirection: 'column' }}>
              {attachment && (
                  <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <AuroraChip 
                          label={attachment.name} 
                          onDelete={() => setAttachment(null)} 
                          size="small"
                      />
                  </AuroraBox>
              )}
              <AuroraBox sx={{ display: "flex", gap: 1 }}>
                  <AuroraInput
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  disabled={loading}
                  />
                  <input
                      type="file"
                      id="comment-attachment"
                      style={{ display: "none" }}
                      onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                              setAttachment(e.target.files[0]);
                          }
                      }}
                  />
                  <label htmlFor="comment-attachment">
                      <AuroraIconButton component="span" color={attachment ? "primary" : "default"}>
                          <AuroraUploadIcon />
                      </AuroraIconButton>
                  </label>
                  <AuroraIconButton 
                  color="primary" 
                  onClick={handleAddComment} 
                  disabled={(!newComment.trim() && !attachment) || loading}
                  sx={{ 
                      bgcolor: (newComment.trim() || attachment) ? "primary.main" : "action.disabledBackground",
                      color: (newComment.trim() || attachment) ? "white" : "action.disabled",
                      "&:hover": {
                      bgcolor: (newComment.trim() || attachment) ? "primary.dark" : "action.disabledBackground"
                      },
                      borderRadius: 1,
                      width: 40,
                      height: 40
                  }}
                  >
                  <AuroraSendIcon fontSize="small" />
                  </AuroraIconButton>
              </AuroraBox>
            </AuroraBox>
          </AuroraBox>
        </>
      )}
    </AuroraBox>
  );
}

// Export for use in Attachments tab
export function useComments() {
  const { comments } = useAppSelector((state) => state.comments);
  return { comments };
}
