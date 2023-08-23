import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

const StatsTable = (props: any) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell align="center">
            <Typography variant="body1">Workouts</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Followers</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Following</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">
            <Typography variant="body1">{props.user.workouts}</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">{props.user.followers}</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">{props.user.following}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default StatsTable;
