import { Badge, Box, Fab } from "@mui/material";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import Swal from "sweetalert2";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

const AnimatedBox = animated(Box);

const Notification = ({ expiredInfo }) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const bindDrag = useDrag(({ offset, event }) => {
    api({ x: offset[0], y: offset[1] });
  });
  const triggerModal = () => {
    Swal.fire({
      title: "Expired Ingredients",
      html: expiredInfo.map((item) => {
        if (item.daysLeft < 0) {
          return `<li>${item.name} expired ${Math.abs(
            (Math.round(item.daysLeft * 100) / 100).toFixed(0)
          )} days ago</li>`;
        }
      }),
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  return expiredInfo.length > 0 ? (
    <AnimatedBox component={"div"} {...bindDrag()} style={{ x, y }}>
      <Fab onClick={triggerModal} color={"primary"}>
        <Badge
          color='error'
          badgeContent={expiredInfo.filter((x) => x.daysLeft < 0).length}>
          <ThumbDownOffAltIcon />
        </Badge>
      </Fab>
    </AnimatedBox>
  ) : (
    <></>
  );
};

export default Notification;
