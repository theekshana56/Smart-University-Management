package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByAssignedTechnicianId(Long techId);

    List<Ticket> findByCreatedById(Long userId);

    @Query("select t from Ticket t where t.createdBy.id = :reporterId")
    List<Ticket> findByReporterId(@Param("reporterId") Long reporterId);
}
