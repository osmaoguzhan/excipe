import { Badge, IconButton } from "@mui/material";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const Notification = ({ hidden }) => {
  const [expiredInfo, setExpiredInfo] = useState([]);
  const { data: session } = useSession();
  const triggerModal = () => {
    if (expiredInfo.length > 0) {
      Swal.fire({
        title: "Expired Ingredients",
        html: expiredInfo.map((item) => {
          if (item.daysLeft < 0) {
            return `<li>${item.name} expired ${Math.abs(
              item.daysLeft
            )} days ago</li>`;
          }
        }),
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const getExpiredItems = async () => {
    const { success, data } = await (
      await fetch("/api/ingredient", {
        headers: {
          userid: session._id,
        },
      })
    ).json();
    if (success) {
      setExpiredInfo(data);
    }
  };

  useEffect(() => {
    if (!hidden) getExpiredItems();
  }, []);

  return hidden ? (
    <></>
  ) : (
    <IconButton
      size='large'
      aria-label='account of current user'
      aria-controls='menu-appbar'
      aria-haspopup='true'
      color='inherit'
      onClick={triggerModal}>
      <Badge
        color='error'
        badgeContent={expiredInfo.filter((x) => x.daysLeft < 0).length}>
        <ThumbDownOffAltIcon />
      </Badge>
    </IconButton>
  );
};

export default Notification;
