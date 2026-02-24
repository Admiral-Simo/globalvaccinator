package com.globalvaccinator.backend.visit;

import com.globalvaccinator.backend.patient.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "visits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key linking back to patients.id_label
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id_label", nullable = false)
    private Patient patient;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    private Double weight;

    private Double height;

    private Double imc;
}