import axios from "./axios";

export async function fetchAllUsers(
  userId: string
) {
  return axios
    .get(`users/${userId}/other-users`)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function fetchFollowingUsers(
  userId: string,
  currentUserId: string,
) {
  return axios
    .get(`users/${userId}/following-users?current_user_id=${currentUserId}`)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function fetchUser(
  userId: string,
  accessToken: string
) {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return axios
    .get(`users/${userId}`, config)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function followUser(
  userId: string,
  accessToken: string
) {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return axios
    .post(`users/${userId}/follow`, {}, config)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}

export async function unfollowUser(
  userId: string,
  accessToken: string
) {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return axios
    .post(`users/${userId}/unfollow`, {}, config)
    .then((response: any)=> {
      return response.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
}