package com.smartcampus.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smartcampus.model.Booking;
import com.smartcampus.model.Booking.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b " +
            "WHERE b.resource.id = :resourceId " +
            "AND b.date = :date " +
            "AND b.status IN :statuses " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(@Param("resourceId") Long resourceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") List<BookingStatus> statuses);

    default List<Booking> findConflictingBookings(Long resourceId, LocalDate date, LocalTime startTime,
            LocalTime endTime) {
        return findConflictingBookings(resourceId, date, startTime, endTime,
                Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED));
    }

    List<Booking> findAllByOrderByCreatedAtDesc();
}
