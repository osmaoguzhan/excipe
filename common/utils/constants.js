const Constants = {
  firstNameMin: 2,
  firstNameMax: 30,
  lastNameMin: 2,
  lastNameMax: 30,
  nicknameMin: 6,
  nicknameMax: 20,
  passwordMin: 6,
  passwordMax: 18,
  fridgeColumns: [
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
  ],
  urls: [
    "https://media.giphy.com/media/SZQBPO4NqHkh6wmdXk/giphy.gif",
    "https://media.giphy.com/media/10ADU4ag31l63C/giphy.gif",
    "https://media.giphy.com/media/5XLPWTWfj7h6M/giphy.gif",
    "https://media.giphy.com/media/xtgZt3jZelFqU/giphy.gif",
    "https://media.giphy.com/media/7fwBcr9lB0Fos/giphy.gif",
    "https://media.giphy.com/media/lGbz7CsaCj4Tm/giphy.gif",
    "https://media.giphy.com/media/3o7P4F86TAI9Kz7XYk/giphy.gif",
  ],
};

export default Constants;
