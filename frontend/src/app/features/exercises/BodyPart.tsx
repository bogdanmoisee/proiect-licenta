import { Stack, Typography } from "@mui/material";
import Icon from "../../assets/icons/equipment.png";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeBodyPart, searchExercises } from "./exerciseSlice";

const BodyPart = (props: any) => {
  const dispatch = useAppDispatch();
  const bodyPart = useAppSelector((state) => state.exercises.bodyPart);

  const setBodyPart = async (item: string) => {
    props.setCurrentPage(1);
    dispatch(changeBodyPart(item));
    dispatch(searchExercises({}));
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="bodyPart-card"
      sx={
        bodyPart === props.item
          ? {
              borderTop: "4px solid #1976d2",
              background: "#242526",
              borderBottomLeftRadius: "20px",
              width: "170px",
              height: "182px",
              cursor: "pointer",
              gap: "47px",
              opacity: 0.9,
            }
          : {
              background: "#242526",
              borderBottomLeftRadius: "20px",
              width: "170px",
              height: "182px",
              cursor: "pointer",
              gap: "47px",
              opacity: 0.9,
            }
      }
      onClick={() => setBodyPart(props.item)}
    >
      <img
        src={Icon}
        alt="dumbbell"
        style={{ width: "40px", height: "40px", color: "white" }}
      />
      <Typography
        fontSize="16px"
        fontWeight="bold"
        color="#fff"
        textTransform="uppercase"
      >
        {props.item}
      </Typography>
    </Stack>
  );
};

export default BodyPart;
