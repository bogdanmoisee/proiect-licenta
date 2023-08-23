import { Box, Card, List, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import UserItemList from "./UserItemList";
import {
  User,
  fetchAllUsersAsync,
  resetAllUsers,
  selectAllUsers,
} from "./userSlice";

const AllUsersCard = () => {
  const users = useAppSelector(selectAllUsers);
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
    if (currentUserId) {
      dispatch(fetchAllUsersAsync(currentUserId));
    }
  };

  useEffect(() => {
    dispatch(resetAllUsers());
    if (currentUserId) {
      dispatch(fetchAllUsersAsync(currentUserId));
    }
  }, [dispatch]);

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
      <List sx={{ overflow: "auto" }}>
        {currentUsers &&
          currentUsers.map((user: User) => (
            <UserItemList user={user} key={user.id} />
          ))}
      </List>

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

export default AllUsersCard;
