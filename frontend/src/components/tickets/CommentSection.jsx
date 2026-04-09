export default function CommentSection({ comments, currentUser, draft, onDraft, onPost, onEdit, onDelete }) {
  return (
    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
      <strong>Comments</strong>
      {(comments || []).map((comment) => {
        const currentUserId = currentUser?.id == null ? null : String(currentUser.id);
        const commentAuthorId = comment.author?.id == null ? null : String(comment.author.id);
        const currentUserEmail = currentUser?.email == null ? null : String(currentUser.email).toLowerCase();
        const commentAuthorEmail = comment.author?.email == null ? null : String(comment.author.email).toLowerCase();
        const isOwnerById = currentUserId !== null && currentUserId === commentAuthorId;
        const isOwnerByEmail = currentUserEmail !== null && currentUserEmail === commentAuthorEmail;
        const canModify = isOwnerById || isOwnerByEmail;
        return (
          <div key={comment.id} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{comment.author?.name || "Unknown"}</div>
            <div>{comment.content}</div>
            {canModify ? (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button type="button" className="btnMini" onClick={() => onEdit(comment)}>Edit</button>
                <button type="button" className="btnMini danger" onClick={() => onDelete(comment.id)}>Delete</button>
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" placeholder="Add comment..." value={draft || ""} onChange={(e) => onDraft(e.target.value)} />
        <button type="button" className="btnMini" onClick={onPost}>Post</button>
      </div>
    </div>
  );
}
