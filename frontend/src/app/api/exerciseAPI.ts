import axios from "./axios";

const EXERCISES_URL = "/exercises.json";

export async function fetchExercises() {
  return axios
    .get(EXERCISES_URL)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}