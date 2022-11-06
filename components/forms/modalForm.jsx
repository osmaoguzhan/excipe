import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../inputs/formInput";
import moment from "moment/moment";

const ModalForm = (props) => {
  const {
    open,
    handleCustomSubmit,
    handleClose,
    title,
    buttonNames: { cancel, custom },
  } = props;
  const { handleSubmit, control, reset } = useForm();
  const [date, setDate] = useState();

  const handleCloseExtra = () => {
    handleClose();
    reset(
      {},
      {
        keepValues: false,
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={"10px"}>
          <Grid item>
            <FormInput
              label={"Ingredient"}
              name={"name"}
              style={{ width: "30em" }}
              multiline={true}
              control={control}
            />
          </Grid>
          <Grid item>
            <FormLabel>Expiration date</FormLabel>
            <FormInput
              name={"expiryDate"}
              type={"date"}
              control={control}
              value={date}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseExtra}>{cancel}</Button>
        <Button onClick={handleSubmit((d) => handleCustomSubmit(d))}>
          {custom}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;
