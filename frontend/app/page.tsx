"use client";

import { useState } from "react";
import {
  useGetPatientsQuery,
  useAddPatientMutation,
} from "@/lib/features/apiSlice"; // Adjust path if needed

export default function Home() {
  // 1. Fetching Hook
  const { data: patients, isLoading, isError, error } = useGetPatientsQuery({});

  // 2. Mutation Hook
  const [addPatient, { isLoading: isAdding }] = useAddPatientMutation();

  // 3. Form State
  const [idLabel, setIdLabel] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 4. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // The .unwrap() lets us catch errors cleanly if the backend rejects the request
      await addPatient({
        idLabel,
        name,
        email,
        dob: "1990-01-01", // Hardcoded for this quick test
        sexe: "M",
      }).unwrap();

      // Clear the form after a successful save
      setIdLabel("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Failed to save the patient: ", err);
      alert("Failed to add patient. Check the console for CORS or 401 errors.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-8 dark:bg-black font-sans">
      {/* --- ADD PATIENT FORM --- */}
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900 mb-8 border border-zinc-200 dark:border-zinc-800">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Add New Patient
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              National ID / Label
            </label>
            <input
              type="text"
              required
              value={idLabel}
              onChange={(e) => setIdLabel(e.target.value)}
              placeholder="e.g. PAT-12345"
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="mt-2 rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isAdding ? "Saving..." : "Save Patient"}
          </button>
        </form>
      </div>

      {/* --- PATIENTS LIST --- */}
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
          Global Vaccinator Dashboard
        </h1>

        {isLoading && (
          <p className="text-blue-500 font-medium animate-pulse">
            Loading patients from Spring Boot...
          </p>
        )}

        {isError && (
          <div className="rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
            <p className="font-bold">Error fetching data</p>
            <p className="text-sm break-words">{JSON.stringify(error)}</p>
          </div>
        )}

        {patients && (
          <ul className="space-y-3 text-black dark:text-zinc-300">
            {patients.length === 0 ? (
              <p className="text-zinc-500 italic">
                No patients found. The database is empty.
              </p>
            ) : (
              patients.map((patient: any) => (
                <li
                  key={patient.idLabel}
                  className="flex justify-between items-center rounded-lg border border-zinc-200 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <div>
                    <p className="font-bold text-lg">{patient.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      ID: {patient.idLabel} | {patient.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
