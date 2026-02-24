import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

export const globalVaccinatorApi = createApi({
  reducerPath: "globalVaccinatorApi",
  // Point this to your API Gateway URL from your Terraform output
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      try {
        // Automatically grab the Cognito token via Amplify
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("No valid session found", error);
      }
      return headers;
    },
  }),
  // Define your cache tags for automatic data refetching
  tagTypes: ["Patients", "Vaccines", "Records"],

  endpoints: (builder) => ({
    // Example: Fetching patients
    getPatients: builder.query({
      query: () => "/patients",
      providesTags: ["Patients"],
    }),

    // Example: Creating a new patient record
    addPatient: builder.mutation({
      query: (newPatient) => ({
        url: "/patients",
        method: "POST",
        body: newPatient,
      }),
      invalidatesTags: ["Patients"], // Forces getPatients to refetch after a successful post
    }),
  }),
});

// Export the auto-generated React hooks
export const { useGetPatientsQuery, useAddPatientMutation } =
  globalVaccinatorApi;
