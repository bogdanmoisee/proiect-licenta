import axios from "./axios";

const WORKOUTS_URL = "/workouts";

export async function postWorkout(
  workoutName: string,
  exercises: Array<any>,
  userId: string
) {
  const data = {
    name: workoutName,
    exercises: exercises,
    user_id: userId
  };

  return axios
    .post(WORKOUTS_URL, data)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function cloneWorkout(
  userId: string,
  parentId: string,
) {
  const data = {
    user_id: userId,
    parent_id: parentId
  };

  return axios
    .post(`${WORKOUTS_URL}/clone`, data)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function updateWorkout(
  workoutId: string,
  workoutName: string,
  exercises: Array<any>,
  userId: string
) {
  const data = {
    name: workoutName,
    exercises: exercises,
    user_id: userId
  };

  return axios
    .patch(`${WORKOUTS_URL}/${workoutId}`, data)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function deleteWorkout(workoutId: string) {
  return axios
    .delete(`${WORKOUTS_URL}/${workoutId}`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}


export async function deleteCloneWorkout(userId: string, parentId: string) {
  return axios
    .delete(`${WORKOUTS_URL}/clone/${parentId}`, { data: { user_id: userId } })
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function getUserWorkouts(userId: string, accessToken: string) {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return axios
    .get(`/users/${userId}/workouts`, config)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function getFeedWorkouts(userId: string, start: number) {
  return axios
    .get(`/users/${userId}/following-workouts?start=${start}&limit=5`)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function getWorkout(workoutId: string) {
  return axios
    .get(`${WORKOUTS_URL}/${workoutId}`)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}