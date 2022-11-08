import { useState } from "react";
import Head from "next/head";
import * as _ from "lodash";
import Swal from "sweetalert2";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, ButtonGroup, Container, lighten } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import ModalForm from "@/components/forms/modalForm";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/utils/requireAuth";
import useArray from "@/hooks/useArray";
import { useLoading } from "@/contexts/loadingContext";
import Loading from "@/components/loading";
import { exclude } from "@/utils/helpers";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 250,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "name",
    headerName: "Ingredient",
    width: 300,
    editable: false,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "expiryDate",
    headerName: "Expiry Date",
    width: 275,
    editable: false,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Status",
    width: 275,
    editable: false,
    align: "center",
    headerAlign: "center",
  },
];

const Fridge = ({ ingredients, session }) => {
  const { isLoading, setLoading } = useLoading();
  const rows = useArray(ingredients);
  const [isOpen, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const getIngredients = async () => {
    const response = await (
      await fetch("/api/ingredient", {
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

  const addIngredient = async (data) => {
    setLoading(true);
    data.id = session._id;
    fetch("/api/ingredient", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const { message, data } = await res.json();
        Swal.fire({
          title: "Success!",
          text: message,
          icon: "success",
          confirmButtonText: "OK",
        });
        getIngredients();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setOpen(false);
        setLoading(false);
      });
  };

  const deleteItem = async () => {
    setLoading(true);
    let ids = selectedRows.map((item) => {
      return item["id"];
    });
    const response = await fetch("/api/ingredient", {
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
    <>
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
          style={{ height: "35em", width: "100%", marginTop: "10em" }}>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button startIcon={<Add />} onClick={() => setOpen(true)}>
              Add New Ingredient
            </Button>
            {selectedRows.length === 1 && (
              <Button startIcon={<Edit />} onClick={() => setOpen(true)}>
                Edit
              </Button>
            )}
            {selectedRows.length >= 1 && (
              <Button startIcon={<Delete />} onClick={deleteItem}>
                Delete
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
              columns={columns}
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
              onRowClick={(d) => {
                console.log(d);
              }}
            />
          </Box>
          <ModalForm
            open={isOpen}
            handleCustomSubmit={(d) => addIngredient(d)}
            handleClose={() => setOpen(false)}
            title={"Add New Ingredient"}
            buttonNames={{ cancel: "Cancel", custom: "Save" }}
          />
        </Container>
      )}
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, async (session) => {
    let ingredients = await prisma.ingredient.findMany({
      where: {
        userId: session._id,
      },
    });
    if (ingredients) {
      let today = new Date();
      ingredients.forEach((ingredient) => {
        let diff = moment(ingredient.expiryDate).diff(today, "days");
        ingredient.status = diff > 3 ? "Fresh" : diff > 0 ? "Stale" : "Expired";
      });
    }
    ingredients = exclude(ingredients, ["userId"]);
    return {
      props: {
        session: session,
        ingredients: ingredients,
      },
    };
  });
};

export default Fridge;
