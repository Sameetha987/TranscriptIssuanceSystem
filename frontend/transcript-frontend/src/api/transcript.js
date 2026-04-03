import axios from "./axios";

export const getTamperedCount = (id) =>
  axios.get(`/api/v1/transcripts/student/${id}/tampered-count`);

export const reissueTampered = (id) =>
  axios.put(`/api/v1/transcripts/student/${id}/reissue-tampered`);