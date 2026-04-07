package com.smartcampus.service;

import com.smartcampus.dto.ResolutionRequest;
import com.smartcampus.dto.TicketRequestDTO;
import com.smartcampus.dto.TicketResponseDTO;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Auth.User;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.TicketAttachment;
import com.smartcampus.model.TicketStatus;
import com.smartcampus.repository.Auth.UserRepository;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public Ticket createTicket(User creator, TicketRequestDTO request) {
        Ticket ticket = new Ticket();
        ticket.setCreatedBy(creator);
        ticket.setResourceLocation(requireText(request.getResourceLocation(), "Resource/location is required"));
        ticket.setCategory(requireText(request.getCategory(), "Category is required"));
        ticket.setDescription(requireText(request.getDescription(), "Description is required"));
        ticket.setPriority(requireText(request.getPriority(), "Priority is required"));
        ticket.setPreferredContact(requireText(request.getPreferredContact(), "Preferred contact details are required"));
        ticket.setStatus(TicketStatus.OPEN);

        List<String> attachmentUrls = fileStorageService.storeTicketImages(request.getImages());

        List<TicketAttachment> attachments = new ArrayList<>();
        for (String url : attachmentUrls) {
            if (url == null || url.isBlank()) continue;
            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicket(ticket);
            attachment.setImageUrl(url.trim());
            attachments.add(attachment);
        }
        ticket.setAttachments(attachments);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> listForUser(User user) {
        String role = user.getRole() == null ? "" : user.getRole().toUpperCase(Locale.ROOT);
        if ("ADMIN".equals(role) || "STAFF".equals(role)) {
            return ticketRepository.findAll();
        }
        if ("TECHNICIAN".equals(role)) {
            return ticketRepository.findByAssignedTechnicianId(user.getId());
        }
        return ticketRepository.findByCreatedById(user.getId());
    }

    @Transactional
    public Ticket assignTechnician(Long ticketId, Long technicianId, User actor) {
        requireRole(actor, "ADMIN");
        Ticket ticket = getTicket(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found"));
        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new IllegalArgumentException("Assigned user must have TECHNICIAN role");
        }
        ticket.setAssignedTechnician(technician);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket updateStatus(Long ticketId, ResolutionRequest request, User actor) {
        Ticket ticket = getTicket(ticketId);
        TicketStatus nextStatus = TicketStatus.valueOf(requireText(request.getStatus(), "Status is required").toUpperCase(Locale.ROOT));

        if ("ADMIN".equalsIgnoreCase(actor.getRole()) && nextStatus == TicketStatus.REJECTED) {
            String reason = requireText(request.getRejectionReason(), "Rejection reason is required");
            ticket.setStatus(TicketStatus.REJECTED);
            ticket.setRejectionReason(reason);
            return ticketRepository.save(ticket);
        }

        if ("TECHNICIAN".equalsIgnoreCase(actor.getRole())) {
            if (ticket.getAssignedTechnician() == null || !ticket.getAssignedTechnician().getId().equals(actor.getId())) {
                throw new IllegalArgumentException("You can only update tickets assigned to you");
            }
            if (nextStatus == TicketStatus.IN_PROGRESS && ticket.getStatus() == TicketStatus.OPEN) {
                ticket.setStatus(TicketStatus.IN_PROGRESS);
            } else if (nextStatus == TicketStatus.RESOLVED && ticket.getStatus() == TicketStatus.IN_PROGRESS) {
                ticket.setResolutionNotes(requireText(request.getResolutionNotes(), "Resolution notes are required"));
                ticket.setStatus(TicketStatus.RESOLVED);
            } else {
                throw new IllegalArgumentException("Invalid technician transition");
            }
            return ticketRepository.save(ticket);
        }

        if ("ADMIN".equalsIgnoreCase(actor.getRole()) && nextStatus == TicketStatus.CLOSED && ticket.getStatus() == TicketStatus.RESOLVED) {
            ticket.setStatus(TicketStatus.CLOSED);
            return ticketRepository.save(ticket);
        }

        throw new IllegalArgumentException("You do not have permission to perform this status update");
    }

    @Transactional
    public Comment addComment(Long ticketId, String content, User actor) {
        Ticket ticket = getTicket(ticketId);
        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(actor);
        comment.setContent(requireText(content, "Comment content is required"));
        return commentRepository.save(comment);
    }

    public List<Comment> listComments(Long ticketId) {
        getTicket(ticketId);
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    @Transactional
    public Comment updateComment(Long commentId, String content, User actor) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!canModifyComment(comment, actor)) {
            throw new IllegalArgumentException("You cannot edit this comment");
        }
        comment.setContent(requireText(content, "Comment content is required"));
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, User actor) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!canModifyComment(comment, actor)) {
            throw new IllegalArgumentException("You cannot delete this comment");
        }
        commentRepository.delete(comment);
    }

    public Ticket getTicket(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
    }

    public Map<String, Object> toTicketResponse(Ticket ticket) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", ticket.getId());
        payload.put("resourceLocation", ticket.getResourceLocation());
        payload.put("category", ticket.getCategory());
        payload.put("description", ticket.getDescription());
        payload.put("priority", ticket.getPriority());
        payload.put("preferredContact", ticket.getPreferredContact());
        payload.put("status", ticket.getStatus().name());
        payload.put("resolutionNotes", ticket.getResolutionNotes());
        payload.put("rejectionReason", ticket.getRejectionReason());
        payload.put("createdAt", ticket.getCreatedAt());
        payload.put("updatedAt", ticket.getUpdatedAt());
        payload.put("createdBy", simpleUser(ticket.getCreatedBy()));
        payload.put("assignedTechnician", ticket.getAssignedTechnician() == null ? null : simpleUser(ticket.getAssignedTechnician()));
        payload.put("attachments", ticket.getAttachments().stream().map(TicketAttachment::getImageUrl).toList());
        return payload;
    }

    public Map<String, Object> toCommentResponse(Comment comment) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", comment.getId());
        payload.put("ticketId", comment.getTicket().getId());
        payload.put("content", comment.getContent());
        payload.put("createdAt", comment.getCreatedAt());
        payload.put("updatedAt", comment.getUpdatedAt());
        payload.put("author", simpleUser(comment.getAuthor()));
        return payload;
    }

    private Map<String, Object> simpleUser(User user) {
        Map<String, Object> value = new HashMap<>();
        value.put("id", user.getId());
        value.put("name", user.getName());
        value.put("email", user.getEmail());
        value.put("role", user.getRole());
        return value;
    }

    public TicketResponseDTO toTicketResponseDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setResourceLocation(ticket.getResourceLocation());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setPreferredContact(ticket.getPreferredContact());
        dto.setStatus(ticket.getStatus().name());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setReporterId(ticket.getCreatedBy().getId());
        dto.setAssignedTechnicianId(ticket.getAssignedTechnician() == null ? null : ticket.getAssignedTechnician().getId());
        dto.setAssignedTechnicianName(ticket.getAssignedTechnician() == null ? null : ticket.getAssignedTechnician().getName());
        dto.setAttachments(ticket.getAttachments().stream().map(TicketAttachment::getImageUrl).toList());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        return dto;
    }

    private boolean canModifyComment(Comment comment, User actor) {
        if ("ADMIN".equalsIgnoreCase(actor.getRole())) return true;
        return comment.getAuthor().getId().equals(actor.getId());
    }

    private void requireRole(User user, String role) {
        if (user == null || user.getRole() == null || !role.equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Forbidden");
        }
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(message);
        return value.trim();
    }
}
