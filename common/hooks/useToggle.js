import { useState } from "react";

const useToggle = (defaultValue) => {
  const [drawerState, setDrawerState] = useState(defaultValue);
  const toggleDrawer = (newValue) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState((currentState) =>
      typeof newValue === "boolean" ? newValue : !currentState
    );
  };
  return [drawerState, toggleDrawer];
};

export default useToggle;
