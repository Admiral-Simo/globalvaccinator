package com.globalvaccinator.backend.patient;

import com.globalvaccinator.backend.record.Record;
import com.globalvaccinator.backend.visit.Visit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @Column(name = "id_label", nullable = false, unique = true)
    private String idLabel;

    @Column(nullable = false)
    private String name;

    private LocalDate dob;

    private String sexe;

    private String address;

    @Column(name = "parent_name")
    private String parentName;

    private String phone;

    private String allergies;

    private String email;

    // One patient can have many vaccination records
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Record> records;

    // One patient can have many growth/constants visits
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Visit> visits;
}