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
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import moment from "moment/moment";

const ModalForm = (props) => {
  const { open, handleCustomSubmit, handleClose, id } = props;
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  useEffect(() => {
    const getIngredientById = async (id) => {
      const response = await (
        await fetch(`/api/ingredient/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: session._id,
          },
        })
      ).json();
      if (response.success) {
        reset({
          name: response.data.name,
          expiryDate: response.data.expiryDate,
        });
      }
    };

    if (open && id) {
      getIngredientById(id);
    } else {
      reset({ expiryDate: moment().toISOString().slice(0, 10) });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{id ? "Edit Ingredient" : "Add New Ingredient"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={"10px"}>
          <Grid item>
            <FormInput
              label={"Ingredient"}
              name={"name"}
              style={{ width: "30em" }}
              control={control}
              validation={{
                required: {
                  value: true,
                  message: "Ingredient name is required",
                },
              }}
              errors={errors}
            />
          </Grid>
          <Grid item>
            <FormLabel>Expiration date</FormLabel>
            <FormInput
              name={"expiryDate"}
              type={"date"}
              control={control}
              validation={{
                required: {
                  value: true,
                  message: "Expiration date is required",
                },
              }}
              errors={errors}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>{"Cancel"}</Button>
        <Button
          onClick={handleSubmit((d) => {
            if (id) {
              d.id = id;
            }
            handleCustomSubmit(d);
          })}>
          {id ? "Edit" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;
