import api from "./api";

export const submitTask = (data) =>
  api.post("/submissions", data);

export const getMySubmissions = () =>
  api.get("/submissions/my");

export const getAllSubmissions = () =>
  api.get("/submissions");

export const reviewSubmission = (id, data) =>
  api.patch(`/submissions/${id}/review`, data);