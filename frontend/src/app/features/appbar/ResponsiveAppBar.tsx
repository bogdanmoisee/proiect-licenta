import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { To, useNavigate } from "react-router-dom";
import { resetWorkout } from "../workouts/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { styled, alpha, ThemeProvider } from "@mui/material/styles";
import {
  Avatar,
  ClickAwayListener,
  Container,
  InputBase,
  List,
  Popper,
} from "@mui/material";
import {
  fetchAllUsersAsync,
  searchUsers,
  setSearchUsers,
} from "../users/userSlice";
import CircularLoader from "../../utils/CircularLoader";
import { globalStyles, theme } from "../../utils/Theme";
import { selectAccessToken } from "../sessions/sessionSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const accessToken = useAppSelector(selectAccessToken);
  const loading = useAppSelector((state) => state.session.loading);
  const searchedUsers = useAppSelector((state) => state.users.searchedUsers);

  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );

  const [search, setSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [previousSearch, setPreviousSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [popperWidth, setPopperWidth] = useState<number>();

  const inputRef = useRef();
  const searchRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        open &&
        popperRef.current &&
        !popperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  function handleNavigate(
    route: To,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event?.preventDefault();
    navigate(route);
  }

  const handleCreateWorkout = async (event: any) => {
    event?.preventDefault();
    dispatch(resetWorkout());
    handleNavigate("/create-workout", event);
  };

  useEffect(() => {
    if (searchRef.current) {
      setPopperWidth(searchRef.current.offsetWidth);
    }
  }, [search]);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchAllUsersAsync(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (search !== previousSearch) {
      setLoadingSearch(true);
      setPreviousSearch(search);
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(
        setTimeout(() => {
          dispatch(setSearchUsers(search));
          dispatch(searchUsers());
          setOpen(true);
          setLoadingSearch(false);
        }, 500)
      );
    }
  }, [search, previousSearch, searchTimeout]);

  const handleUserClick = (id: string) => {
    setOpen(false);
    navigate(`/profile/${id}`);
  };

  let sessionLinks;
  let searchBar;
  if (accessToken) {
    sessionLinks = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          onClick={(event) => handleCreateWorkout(event) as any}
          sx={{ m: 2, color: "white", display: "block" }}
        >
          Create Workout
        </Button>
        <Button
          onClick={(event) => handleNavigate("/my-workouts", event)}
          sx={{ m: 2, color: "white", display: "block" }}
        >
          My Workouts
        </Button>
      </Box>
    );
    searchBar = (
      <>
        <Search ref={searchRef}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
              if (inputRef.current) setAnchorEl(inputRef.current);
            }}
            onFocus={() => setOpen(true)}
            onMouseDown={(e) => {
              if (open) {
                e.preventDefault();
              }
            }}
          />
        </Search>
        {search !== "" && (
          <Popper
            ref={popperRef}
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ backgroundColor: "white", width: popperWidth }}
          >
            <List sx={{ backgroundColor: "#242526" }}>
              {loadingSearch && <CircularLoader />}
              {!loadingSearch && searchedUsers?.length == 0 && (
                <Typography
                  variant="h6"
                  sx={{ p: 1, color: "#fff", marginLeft: "10px" }}
                >
                  No results...
                </Typography>
              )}
              {!loadingSearch &&
                searchedUsers &&
                searchedUsers.map((user: any) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => {
                      handleUserClick(user.id);
                    }}
                    sx={{ backgroundColor: "#242526" }}
                  >
                    <Avatar src={user.avatar_url}></Avatar>
                    <Typography sx={{ marginLeft: "10px", color: "#fff" }}>
                      {user.username}
                    </Typography>
                  </MenuItem>
                ))}
            </List>
          </Popper>
        )}
      </>
    );
  } else if (!accessToken && !loading) {
    sessionLinks = (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={(event) => handleNavigate("/signup", event)}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Create account
        </Button>

        <Button
          onClick={(event) => handleNavigate("/login", event)}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Login
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <FitnessCenterIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 3,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  width: "220px",
                }}
              >
                MUSCLE APP
              </Typography>
              <FitnessCenterIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {sessionLinks}
              {searchBar}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;
