import { useState } from "react";
import Head from "next/head";
import * as _ from "lodash";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  lighten,
  Fab,
} from "@mui/material";
import { Add, Delete, Edit, WbIncandescent } from "@mui/icons-material";
import ModalForm from "@/components/forms/modalForm";
import { requireAuth } from "@/utils/requireAuth";
import useArray from "@/hooks/useArray";
import { useLoading } from "@/contexts/loadingContext";
import Loading from "@/components/loading";
import Constants from "@/utils/constants";
import { useRouter } from "next/router";
import Notification from "@/components/notification";
import { absoluteUrl } from "@/utils/helpers";

const Fridge = ({ ingredients, session }) => {
  const { isLoading, setLoading } = useLoading();
  const rows = useArray(ingredients);
  const [modalTrigger, setModalTrigger] = useState({
    open: false,
    handleCustomSubmit: (d) => addIngredient(d),
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const router = useRouter();

  const getIngredients = async () => {
    const response = await (
      await fetch(absoluteUrl("/api/ingredient"), {
        headers: {
          userid: session._id,
        },
      })
    ).json();
    if (response.success) {
      rows.reset(response.data);
    } else {
      Swal.fire({
        title: "Error!",
        text: response.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const redirectToRecipe = () => {
    Swal.fire({
      title: "Warning!",
      text: "Once you click OK, you will be redirected to the recipe page. You may need to delete some ingredients to get a recipe.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({
          pathname: "/recipes",
          query: { ingredients: selectedRows.map((i) => i.name) },
        });
      }
    });
  };

  const updateIngredient = async (data) => {
    setLoading(true);
    const response = await (
      await fetch(absoluteUrl("/api/ingredient"), {
        headers: {
          "Content-Type": "application/json",
          userId: session._id,
        },
        method: "PUT",
        body: JSON.stringify(data),
      })
    ).json();
    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      getIngredients();
    } else {
      Swal.fire({
        title: "Error!",
        text: response.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setModalTrigger((prev) => ({ ...prev, open: false }));
    setLoading(false);
  };

  const addIngredient = async (data) => {
    setLoading(true);
    data.id = session._id;
    const response = await (
      await fetch(absoluteUrl("/api/ingredient"), {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    if (response.success) {
      Swal.fire({
        title: "Success!",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      getIngredients();
    } else {
      Swal.fire({
        title: "Error!",
        text: response.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setModalTrigger((prev) => ({ ...prev, open: false }));
    setLoading(false);
  };

  const deleteItem = async () => {
    setLoading(true);
    let ids = selectedRows.map((item) => {
      return item["id"];
    });
    const response = await fetch(absoluteUrl("/api/ingredient"), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        userId: session._id,
      },
      body: JSON.stringify(ids),
    });
    const data = await response.json();
    if (data?.success) {
      Swal.fire({
        title: "Success!",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      getIngredients();
      setSelectedRows([]);
    } else {
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setLoading(false);
  };

  return (
    <Box component={"div"} sx={{ overflowX: "clip" }}>
      <Head>
        <title>My Fridge</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {isLoading ? (
        <Loading />
      ) : (
        <Container
          maxWidth='lg'
          component={"main"}
          style={{ height: "35em", width: "100%", marginTop: "5em" }}>
          <ButtonGroup variant='text' aria-label='text button group'>
            {selectedRows.length === 0 && (
              <Button
                startIcon={<Add />}
                onClick={() =>
                  setModalTrigger({
                    ...modalTrigger,
                    open: true,
                    handleCustomSubmit: addIngredient,
                  })
                }>
                Add New Ingredient
              </Button>
            )}
            {selectedRows.length === 1 && (
              <Button
                startIcon={<Edit />}
                onClick={() => {
                  setModalTrigger({
                    open: true,
                    handleCustomSubmit: updateIngredient,
                  });
                }}>
                Edit
              </Button>
            )}
            {selectedRows.length >= 1 && (
              <Button startIcon={<Delete />} onClick={deleteItem}>
                Delete
              </Button>
            )}
            {selectedRows.length >= 1 && (
              <Button onClick={redirectToRecipe} startIcon={<WbIncandescent />}>
                Suggest
              </Button>
            )}
          </ButtonGroup>
          <Box
            sx={{
              height: "631px",
              width: "100%",
              mb: 2,
              paddingTop: 0.5,
              "& .theme-status-Fresh": {
                bgcolor: "#68cc7c",
                "&:hover": {
                  bgcolor: () => lighten("#68cc7c", 0.5),
                },
              },
              "& .theme-status-Expired": {
                bgcolor: "#ff4f4f",
                "&:hover": {
                  bgcolor: () => lighten("#ff4f4f", 0.5),
                },
              },
              "& .theme-status-Stale": {
                bgcolor: "#f7d272",
                "&:hover": {
                  bgcolor: () => lighten("#f7d272", 0.5),
                },
              },
            }}>
            <DataGrid
              getRowClassName={(params) => `theme-status-${params.row.status}`}
              rows={rows.value}
              columns={Constants.fridgeColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selected = rows.value.filter((row) =>
                  selectedIDs.has(row.id)
                );
                setSelectedRows(selected);
              }}
              selectionModel={selectedRows.map((item) => item["id"])}
              // onRowClick={(d) => {
              //   console.log(d);
              // }}
            />
          </Box>
          <ModalForm
            open={modalTrigger.open}
            handleCustomSubmit={modalTrigger.handleCustomSubmit}
            handleClose={() =>
              setModalTrigger((prev) => {
                return {
                  ...prev,
                  open: false,
                };
              })
            }
            id={selectedRows[0]?.id}
          />
        </Container>
      )}
      <Notification
        expiredInfo={rows.value.filter((x) => x.status === "Expired")}
      />
    </Box>
  );
};

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, async (session) => {
    const { success, data } = await (
      await fetch(absoluteUrl("/api/ingredient"), {
        headers: {
          userid: session._id,
        },
      })
    ).json();
    return {
      props: {
        session: session,
        ingredients: success ? data : null,
      },
    };
  });
};

export default Fridge;
