import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
// import ApiService from "../Services/ApiService";
import * as _ from "lodash";
import Swal from "sweetalert2";
// import { useTranslation } from "react-i18next";
import ModalForm from "../components/forms/modalForm";
import { Add, Delete, Edit } from "@mui/icons-material";
import Constants from "../Utils/Constants";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "content",
    headerName: "Content",
    width: 250,
    editable: false,
  },
  {
    field: "status",
    headerName: "Status",
    width: 250,
    editable: false,
  },
];

const Fridge = () => {
  const [isLoading, setLoading] = useState(false);
  // const api = ApiService();
  const [rows, setRows] = useState([]);
  // const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const checkError = (err) => {
    if (!_.isNil(err?.response?.data?.message)) {
      Swal.fire({
        title: "Error",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const createSuccess = (res) => {
    Swal.fire({
      title: "Success",
      text: res.data.message,
      icon: "success",
      confirmButtonText: "Close",
    });
  };

  const getTodoList = () => {
    // api
    //   .getTodoList()
    //   .then((res) => {
    //     res.data.map((item, index) => {
    //       return (item.id = index + 1);
    //     });
    //     setRows(res.data);
    //   })
    //   .catch((err) => {
    //     checkError(err);
    //   })
    //   .finally(() => setLoading(false));
  };

  const addIngredient = (data) => {
    setLoading(true);
    console.log("====================================");
    console.log(data);
    console.log("====================================");
    setLoading(false);
    // let postData = {};
    // postData.content = data.content;
    // postData.status = Constants.statusList.TODO;
    // api
    //   .addTodoItem(postData)
    //   .then(async (res) => {
    //     setOpen(false);
    //     await getTodoList();
    //     createSuccess(res);
    //   })
    //   .catch((err) => {
    //     checkError(err);
    //     setLoading(false);
    //   });
  };

  const deleteItem = () => {
    setLoading(true);
    let ids = selectedRows.map((item) => {
      return item["_id"];
    });
    // api
    //   .deleteItem(ids)
    //   .then(async (res) => {
    //     setSelectedRows([]);
    //     await getTodoList();
    //     createSuccess(res);
    //   })
    //   .catch((err) => {
    //     checkError(err);
    //     setLoading(false);
    //   });
  };

  const init = useCallback(() => {
    setLoading(true);
    getTodoList();
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    init();
  }, [init]);

  return isLoading ? (
    <Box
      sx={{
        marginTop: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      {" "}
      <CircularProgress />
    </Box>
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
      <Box sx={{ height: 350, width: 1, mb: 2 }} style={{ paddingTop: 5 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          components={{}}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = rows.filter((row) => selectedIDs.has(row.id));
            setSelectedRows(selectedRows);
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
  );
};

export default Fridge;
