import React, { SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import {
    MDBBtn, MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBInput
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'
import { addProductToDB, deleteProductfromDB, getCategory, getProduct, updateProductToDB } from '../auth';
import { Row } from 'react-bootstrap';

const Product = () => {
    const Category_Data = {
        id: 0,
        description: "",
        category_name: "",
    }
    const [optid, setoptid] = useState("");
    const [Details, setDetails] = useState({ price: 0, quantity: 0, category: "", des: "", name: "" });
    const [optSmModal, setOptSmModal] = useState(false);
    const [optdeModal, setOptdeModal] = useState(false);
    const [optdeModal1, setOptdeModal1] = useState(false);
    const [category, setCategory] = useState<typeof Category_Data[]>([])
    const [users, setUsers] = useState<any>();
    const [added, setadded] = useState(0)
    const nameregex = /^[a-zA-Z.' ']{3,30}$/;
    const desregex = /^[a-zA-Z.' ']{10,100}$/;
    const [Error, setError] = useState({ name: "", description: "" });

    const toggleShow = () => { setOptSmModal(!optSmModal); };
    const toggleShow1 = () => { setOptdeModal(!optdeModal); };
    const toggleShow2 = () => { setOptdeModal1(!optdeModal1); };

    const checkName = (name: string) => {
        if (name === "") {

            setError((prevState) => { return { ...prevState, "name": "Name is Required" } })
            return false
        }
        else {
            if (nameregex.test(name) === false) {
                setError((prevState) => { return { ...prevState, "name": "Please Enter Valid Name (min 3 characters)" } })
                return false;
            }
            else {
                setError((prevState) => { return { ...prevState, "name": "" } })
                return true;
            }
        }
    }
    const checkDes = (des: string) => {
        if (des === "") {

            setError((prevState) => { return { ...prevState, "description": "Description is Required" } })
            return false
        }
        else {
            if (desregex.test(des) === false) {
                setError((prevState) => { return { ...prevState, "description": "Please Enter Valid Description (min 10 characters)" } })
                return false;
            }
            else {
                setError((prevState) => { return { ...prevState, "description": "" } })
                return true;
            }
        }
    }

    const addProduct = async (e: any) => {
        e.preventDefault()

        const formdata = new FormData(e.currentTarget)

        const productData = {
            name: formdata.get('name') as string,
            category: formdata.get('category'),
            description: formdata.get('description') as string,
            image: formdata.get('img'),
            price: formdata.get('price'),
            quantity: formdata.get('quantity'),
        }

        if (checkName(productData.name) && checkDes(productData.description)) {

            const result = await addProductToDB(formdata)
            if (result.data.success === "true") {
                setOptSmModal(!optSmModal)
                alert(result.data.messages)
                setadded(added + 1)
            }
            else {
                console.error(result.data.error);

            }
        }
        else {
            console.error("Invalid Input")
        }

    }
    const updateProduct = async (e: any) => {
        e.preventDefault()
        // console.log(Details)

        const formdata = new FormData(e.currentTarget)
        const productData = {
            name: formdata.get('name'),
            category: formdata.get('category'),
            description: formdata.get('description'),
            image: formdata,
            price: formdata.get('price'),
            quantity: formdata.get('quantity'),
        }
        const result = await updateProductToDB(formdata, optid)
        if (result.data.success === "true") {
            alert(result.data.messages)
            setadded(added + 1)
            setOptdeModal1(!optdeModal1)
        }
        else {
            console.error(result.data.error);

        }

    }

    useEffect(() => {

        getProduct().then((res => {
            setUsers(res.data)
        }))
        getCategory().then((res => {
            setCategory(res.data); console.log(res.data);
        }))

    }, [added])


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Product Name',
            width: 150,
        },
        {
            field: 'category',
            headerName: 'Category',
            renderCell: (cellValues) => {
                const found = category.find(obj => {
                    return obj.id == cellValues.row.category;
                });
                return (
                    <p>{found?.category_name}</p>
                )
            }


        },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,

        },
        {
            field: 'price',
            headerName: 'Price',

        },
        {
            field: 'quantity',
            headerName: 'Quantity',

        },
        {
            field: 'image',
            headerName: 'Image',
            renderCell: (cellValues) => {
                let imgPath = cellValues.row.image as string
                // console.log(imgPath)
                return (
                    <img src={imgPath} alt="no image" style={{ width: "50px" }} />


                )
            }

        },
        {
            field: 'Edit',
            headerName: 'Edit',
            width: 120,
            // editable: true,
            renderCell: (cellValues) => {

                return (
                    <button type="button" className="btn btn-info" onClick={(evt) => { ; getUserDetails(evt, cellValues) }}
                        color="primary"><a onClick={toggleShow2} > Update</a></button>

                )
            }
        },
        {
            field: 'Delete',
            headerName: 'Delete',
            width: 150,
            // editable: true,
            renderCell: (cellValues) => {



                return (
                    <button type="button" className="btn btn-info"
                        onClick={(evt) => { getUserDetails(evt, cellValues) }} color="primary"><a onClick={toggleShow1}>Delete Product</a></button>
                )
            }
        },
    ];
    const getUserDetails = (evt: SyntheticEvent, data: GridRenderCellParams) => {
        evt.preventDefault();
        setoptid(data.row.id);
        // console.log(data.row)
        setDetails((prevState) => { return { ...prevState, "des": data.row.description } })
        setDetails((prevState) => { return { ...prevState, "name": data.row.name } })
        setDetails((prevState) => { return { ...prevState, "price": data.row.price } })
        setDetails((prevState) => { return { ...prevState, "quantity": data.row.quantity } })
        setDetails((prevState) => { return { ...prevState, "category": data.row.category } })
    }
    const deleteProduct = async (e: any) => {

        const Result = deleteProductfromDB(+optid).then((res => {
            if (res.data.success === 'true') {
                // alert(res.data.message + ": True")
                setOptdeModal(!optdeModal);
                setadded(added + 1)

            }
            else {
                // alert(res.data.message)
                setOptdeModal(!optdeModal);
            }
        }))


    }






    return (

        <div>
            <div className="productBody"><button onClick={toggleShow} className='btn btn-warning m-2 p-2' style={{ width: "15rem" }}> Add Product </button></div>

            <>
                <MDBModal staticBackdrop show={optSmModal} tabIndex='-1' setShow={setOptSmModal}>
                    <MDBModalDialog size='lg'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Add Product</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <form onSubmit={addProduct} method="post">

                                    <MDBInput label='Product Name' id='name' name='name' type='text' onChange={() => { setError((prevState) => { return { ...prevState, "name": "" } }) }} />
                                    <p className='text-danger p-2 m-2 ' >{Error.name}</p>
                                    <MDBInput label='Product Description' id='des' name='description' onChange={() => { setError((prevState) => { return { ...prevState, "description": "" } }) }} type='text' />
                                    <p className='text-danger p-2 m-2 ' >{Error.description}</p>
                                    <select name='category' className="select form-control  form-control-lg">
                                        {category.map(el => <option key={el.id} value={el.id}>{el.category_name}</option>)}
                                    </select>
                                    <label className="form-label" htmlFor="form3Examplev5">Category : </label>
                                    <MDBInput label='Product Price' id='typeText' name='price' defaultValue={1} min={0} type='number' />
                                    <MDBInput label='Product Quantity' id='typeText' name='quantity' defaultValue={1} min={0} type='number' />
                                    <MDBInput label='Product Image' id='typeText' name='img' accept='.jpeg,.png,.gif' type='file' required />
                                    <MDBBtn className='btn btn-primary' color='none' type='submit'>Add</MDBBtn>
                                </form>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </>
            <>
                <MDBModal staticBackdrop show={optdeModal1} tabIndex='-1' setShow={setOptdeModal1}>
                    <MDBModalDialog size='lg'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Update Product</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow2}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <form onSubmit={updateProduct} method="post">
                                    <MDBInput id='id' name='id' type='hidden' />
                                    <input type="hidden" name="id" />

                                    <h5>Product Name</h5>
                                    <input className="form-control" type="text" name="name" id="name" defaultValue={Details.name} required />

                                    <h5>Product Description</h5>
                                    <input className="form-control" type="text" name="description" defaultValue={Details.name} id="des" required />

                                    <h5>Category</h5>
                                    <select name='category' defaultValue={Details.category} className="select form-control  form-control-lg">
                                        {category.map(el => <option key={el.id} value={el.id}>{el.category_name}</option>)}
                                    </select>
                                    <h5>Price</h5>
                                    <input className="form-control" type="number" name="price" id="price" min={0} defaultValue={Details.price} required />

                                    <h5>Product Quantity</h5>
                                    <input className="form-control" type="number" name="quantity" id="quantity" min={0} defaultValue={Details.price} required />

                                    <MDBInput label='Product Image' id='typeText' name='img' accept='.jpeg,.png,.gif' type='file' required />
                                    {/* <MDBBtn className='btn btn-primary' color='none' type='submit'>Update</MDBBtn> */}
                                    <button className='btn btn-primary' type="submit">Update</button>
                                </form>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </>
            <>
                <MDBModal staticBackdrop show={optdeModal} tabIndex='-1' setShow={setOptdeModal}>
                    <MDBModalDialog size='lg'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Delete</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow1}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>

                                <button onClick={deleteProduct} className="col-md-3 ms-2 btn btn-danger">Yes</button>
                                <button onClick={toggleShow1} className="col-md-3 ms-2 btn btn-danger">No</button>

                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </>
            <div className="table">
                <Box sx={{ height: 400, margin: "5%", width: '80%' }}>
                    <DataGrid
                        rows={users ? users : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        </div>
    )
}

export default Product




