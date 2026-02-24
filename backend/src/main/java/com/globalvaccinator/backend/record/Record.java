package com.globalvaccinator.backend.record;

import com.globalvaccinator.backend.patient.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key linking back to patients.id_label
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id_label", nullable = false)
    private Patient patient;

    private String milestone;

    @Column(name = "vax_name")
    private String vaxName;

    @Column(name = "due_date")
    private LocalDate dueDate;

    private String status;

    @Column(name = "date_given")
    private LocalDate dateGiven;

    private String observations;
}