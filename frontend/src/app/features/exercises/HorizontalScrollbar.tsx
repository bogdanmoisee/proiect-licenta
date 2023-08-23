import React, { useContext } from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Box, Typography } from '@mui/material';

import RightArrowIcon from '../../assets/icons/right-arrow.png';
import LeftArrowIcon from '../../assets/icons/left-arrow.png';
import BodyPart from './BodyPart';

const LeftArrow = () => {
  const { scrollPrev } = useContext(VisibilityContext);

  return (
    <Typography onClick={() => scrollPrev()} className="right-arrow">
      <img src={LeftArrowIcon} alt="right-arrow" />
    </Typography>
  );
};

const RightArrow = () => {
  const { scrollNext } = useContext(VisibilityContext);

  return (
    <Typography onClick={() => scrollNext()} className="left-arrow">
      <img src={RightArrowIcon} alt="right-arrow" />
    </Typography>
  );
};



const HorizontalScrollbar = (props: any) => {
  const bodyPartsData = [ "all", "back", "cardio", "chest", "lower arms", "lower legs", "shoulders", "upper arms", "upper legs", "waist" ];
  
  return (
    <Box sx={{zIndex: 3, position: 'relative'}}>
      <ScrollMenu >
        {
          bodyPartsData.map((item) => (
            <Box
              key={item}
              title={item}
              m="0 40px"
            >
              <BodyPart 
                item={item}
                setCurrentPage={props.setCurrentPage}
              />
            </Box>
          ))
        }
      </ScrollMenu>
    </Box>
  )
}

export default HorizontalScrollbar