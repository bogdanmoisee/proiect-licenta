import { Box, Card, List, Pagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useParams } from "react-router-dom";
import UserItemList from "./UserItemList";
import {
  User,
  fetchAllUsersAsync,
  fetchFollowingUsersAsync,
  resetAllUsers,
  selectAllUsers,
} from "./userSlice";
import { Statuses } from "../exercises/exerciseSlice";

const FollowingUsersCard = () => {
  const { id } = useParams();
  const users = useAppSelector(selectAllUsers);
  const status = useAppSelector((state) => state.users.status);
  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users && users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    if (id && currentUserId) {
      dispatch(fetchFollowingUsersAsync({ userId: id, currentUserId }));
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        m: 2,
        width: "100%",
        p: 2,
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {status === Statuses.UpToDate &&
          (users?.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 1, textAlign: "center" }}>
              This user is not following anyone..
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              Following
            </Typography>
          ))}

        <List sx={{ overflow: "auto", flexGrow: 1 }}>
          {currentUsers &&
            currentUsers.map((user: User) => (
              <UserItemList user={user} key={user.id} />
            ))}
        </List>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {users && users.length > usersPerPage && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(users.length / usersPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Box>
    </Card>
  );
};

export default FollowingUsersCard;
