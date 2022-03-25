/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Button,
  Input,
  Label,
  Loader,
  Modal,
  Separator,
} from "./Components/Components";
import axios from "axios";
export const ProductList = () => {
  const [createIsVisible, setCreateIsVisible] = useState(false);
  const [deleteIsVisible, setDeleteIsVisible] = useState(false);
  const [editableId, setEditableId] = useState(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const getProducts = async (rno = undefined) => {
    const token = localStorage.getItem("token");
    await axios
      .get(
        rno
          ? `${process.env.REACT_APP_SERVER_URL}/listproducts/${
              products.length + 5
            }`
          : `${process.env.REACT_APP_SERVER_URL}/listproducts/5`,
        {
          headers: { authorization: token },
        }
      )
      .then((data) => {
        setProducts(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useMemo(async () => {
    await getProducts();
  }, []);

  const generateToken = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/generateToken`
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editProduct = (id) => {
    setEditableId(id);
    setCreateIsVisible(true);
  };
  const addProduct = () => {
    setEditableId(undefined);
    setCreateIsVisible(true);
  };
  const deleteModal = (id) => {
    setEditableId(id);
    setDeleteIsVisible(true);
  };

  return (
    <div css={{ padding: "20px" }}>
      <div css={{ float: "right" }}>
        <Button type="success" onClick={() => addProduct()}>
          +Add
        </Button>
        <Button type="warning" onClick={generateToken}>
          Generate Token
        </Button>
      </div>

      <table css={tableStyle}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Desc</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((data, key) => {
              return (
                <tr key={key}>
                  <td>{data.productName}</td>
                  <td>{data.productDescription}</td>
                  <td>
                    <Button type="info" onClick={() => editProduct(data._id)}>
                      Edit
                    </Button>
                    <Button type="danger" onClick={() => deleteModal(data._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No Products In DataBase Please Add Products</td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        css={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button type="info" onClick={() => getProducts(5)}>
          Load More
        </Button>
      </div>
      <AddEditModal
        visibility={createIsVisible}
        close={() => setCreateIsVisible(false)}
        setLoader={(value) => setIsProcessing(value)}
        refreshData={() => getProducts(products.length)}
        id={editableId}
      />
      <DeleteModal
        visibility={deleteIsVisible}
        close={() => setDeleteIsVisible(false)}
        setLoader={(value) => setIsProcessing(value)}
        refreshData={() => getProducts(products.length)}
        id={editableId}
      />
      <Loader isVisible={isProcessing} />
    </div>
  );
};

const tableStyle = () =>
  css({
    overflowX: "auto",
    borderCollapse: "collapse",
    borderSpacing: 0,
    width: "100%",
    border: "1px solid #ddd",
    "th,td": { textAlign: "left", padding: 8 },
    "tr:nth-of-type(even)": { backgroundColor: "#f2f2f2" },
  });

const initialState = {
  id: undefined,
  title: "",
  description: "",
  image: undefined,
  error: { titleError: "", descriptionError: "", imageError: "" },
};
const reducer = (state, action) => {
  switch (action.type) {
    case "change":
      if (action.key === "id") {
        return { ...state, id: action.value };
      }
      if (action.key === "file") {
        if (action.value && action.value !== "" && action.value !== null) {
          return {
            ...state,
            image: action.value,
            error: {
              ...state.error,
              imageError: "",
            },
          };
        } else {
          return {
            ...state,
            image: action.value,
            error: {
              ...state.error,
              imageError: "This is Required",
            },
          };
        }
      }
      if (action.key === "title") {
        if (action.value === "") {
          return {
            ...state,
            title: action.value,
            error: {
              ...state.error,
              titleError: "Title is required",
            },
          };
        } else {
          return {
            ...state,
            title: action.value,
            error: {
              ...state.error,
              titleError: "",
            },
          };
        }
      } else if (action.key === "description") {
        if (action.value === "") {
          return {
            ...state,
            description: action.value,
            error: {
              ...state.error,
              descriptionError: "Title is required",
            },
          };
        } else {
          return {
            ...state,
            description: action.value,
            error: {
              ...state.error,
              descriptionError: "",
            },
          };
        }
      }
    case "reset":
      return initialState;
    default:
      return state;
  }
};

// Modal for add edit products
const AddEditModal = ({
  visibility,
  close,
  setLoader,
  refreshData,
  id = undefined,
}) => {
  const [hasError, setHasError] = useState(false);
  const [resetImage, setResetImage] = useState();
  const [product, dispatch] = useReducer(reducer, initialState);
  const [imageFromServer, setImageFromServer] = useState("");
  const addProduct = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("productImage", product.image);
    data.append("productName", product.title);
    data.append("productDescription", product.description);
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/addproduct`,
      data: data,
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  };
  const getProductById = async () => {
    if (id) {
      dispatch({ action: "change", key: "id", value: id });
      const token = localStorage.getItem("token");
      await axios
        .get(`${process.env.REACT_APP_SERVER_URL}/product/${id}`, {
          headers: { authorization: token },
        })
        .then((res) => {
          dispatch({
            type: "change",
            key: "title",
            value: res.data.productName,
          });
          dispatch({
            type: "change",
            key: "description",
            value: res.data.productDescription,
          });
          setImageFromServer(res.data.productImage);
        })
        .catch((e) => {
          alert(e);
          close();
        });
    }
  };
  const updateProduct = async () => {
    const token = localStorage.getItem("token");
    let path = undefined;
    if (product.image) {
      const data = new FormData();
      data.append("updateImage", product.image);
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/productImageupdate`,
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      }).then((data) => {
       path=data.data
      });
    }
    return axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/product/${id}`,
      { productName: product.title, productDescription: product.description ,productImage:path},
      { headers: { authorization: token } }
    );
  };

  useEffect(() => {
    getProductById();
    setImageFromServer("");
  }, [id]);

  useEffect(() => {
    if (product.title !== "" && product.description !== "") {
      if (
        !id &&
        (product.image === undefined ||
          product.image === null ||
          product.image === "")
      ) {
        setHasError(true);
      } else {
        setHasError(false);
      }
    } else {
      setHasError(true);
    }
  }, [product]);

  const submit = async () => {
    if (hasError === false) {
      setLoader(true);
      if (!id) {
        await addProduct()
          .then(() => {
            alert("Product Created Successfully");
            dispatch({ type: "reset" });
            close();
            refreshData();
            setResetImage(Math.random().toString(36));
            setLoader(false);
          })
          .catch((e) => {
            setLoader(false);
            alert(e);
          });
      } else {
        updateProduct()
          .then(() => {
            alert("Product updated Successfully");
            dispatch({ type: "reset" });
            close();
            refreshData();
            setResetImage(Math.random().toString(36));
            setLoader(false);
          })
          .catch((e) => {
            alert(e);
            setLoader(false);
          });
      }
    }
  };

  return (
    <Modal
      isVisible={visibility}
      closeModal={() => {
        dispatch({ type: "reset" });
        setImageFromServer("")
        setResetImage(Math.random().toString(36));
        close();
      }}
    >
      <div css={{ padding: "5px" }}>
        <Label css={{ marginLeft: "5px", fontSize: 17, fontWeight: 500 }}>
          Create Product
        </Label>
        <Separator />
        {imageFromServer !== "" && (
          <div css={{ width: "100%", textAlign: "center" }}>
            <img
              css={{ width: "30%", height: "30%" }}
              src={process.env.REACT_APP_SERVER_URL + "/" + imageFromServer}
              alt="imageFromServer"
            />
          </div>
        )}
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            padding: "5%",
            gap: 10,
          }}
        >
          <Label>Title</Label>
          <Input
            placeholder="Enter Title"
            value={product.title}
            onChange={(e) => {
              dispatch({ type: "change", key: "title", value: e.target.value });
            }}
          />
          <span css={{ color: "red" }}>{product.error.titleError}</span>
          <Label>Description</Label>
          <Input
            placeholder="Enter Description"
            value={product.description}
            onChange={(e) => {
              dispatch({
                type: "change",
                key: "description",
                value: e.target.value,
              });
            }}
          />
          <span css={{ color: "red" }}>{product.error.descriptionError}</span>
          <Label>Image</Label>
          <Input
            key={resetImage}
            type="file"
            onChange={(e) => {
              dispatch({
                type: "change",
                key: "file",
                value: e.target.files[0],
              });
            }}
          />
        </div>
        <div css={{ float: "right", paddingBottom: "10px" }}>
          <Button type="success" onClick={submit} disabled={hasError}>
            {!id ? "Submit" : "Update"}
          </Button>
          <Button
            type="info"
            onClick={() => {
              setResetImage(Math.random().toString(36));
              setImageFromServer("")
              dispatch({ type: "reset" });
              close();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

//Modal for Delete Product
const DeleteModal = ({ visibility, close, setLoader, refreshData, id }) => {
  const deleteProduct = async () => {
    const token = localStorage.getItem("token");
    return axios.delete(`${process.env.REACT_APP_SERVER_URL}/product/${id}`, {
      headers: { authorization: token },
    });
  };
  const deleteConfirm = async () => {
    if (id) {
      setLoader(true);
      await deleteProduct()
        .then(() => {
          alert("Product Deleted Successfully");
          close();
          refreshData();
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          alert(e);
        });
    }
  };
  return (
    <Modal isVisible={visibility} closeModal={() => close()}>
      <div css={{ padding: "30px" }}>
        <p>Are you sure to delete this item?</p>
      </div>
      <div css={{ float: "right", padding: "20px" }}>
        <Button type="danger" onClick={() => deleteConfirm()}>
          Delete
        </Button>
        <Button type="info" onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
