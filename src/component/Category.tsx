import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MDBBtn, MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput
} from 'mdb-react-ui-kit';
import { addCategoryToDB, deleteCategoryfromDB, getCategory, updateCatecoryToDB } from '../auth';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import { Box } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';

const Category = () => {
  const [optid, setoptid] = useState("");
  const [Details, setDetails] = useState({ des: "", name:""});
  const [optSmModal, setOptSmModal] = useState(false);
  const [optdeModal, setOptdeModal] = useState(false);
  const [category, setCategory] = useState<any[]>([])
  const [added, setadded] = useState(0)
  const [optdeModal1, setOptdeModal1] = useState(false);
  const nameregex = /^[a-zA-Z.' ']{3,30}$/;
  const desregex = /^[a-zA-Z.' ']{10,100}$/;
  const [Error, setError] = useState({ name: "", description: ""});
  const toggleShow = () => setOptSmModal(!optSmModal);
  const toggleShow1 = () => { setOptdeModal(!optdeModal); };
  const toggleShow2 = () => { setOptdeModal1(!optdeModal1);};
  const [confirm, setConfirm] = useState({ name: false, des:false});
  
  
    

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
        setConfirm((prevState) => { return { ...prevState, "name": true } })
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
        setConfirm((prevState) => { return { ...prevState, "description": true } })
          return true;
      }
  }
}

  const addCategory = async (e: any) => {
    e.preventDefault()
    const formdata = new FormData(e.currentTarget)
    
    const categoryData = {
      name: formdata.get('name') as string,
      description: formdata.get('description') as string,
    }
    
    if(checkName(categoryData.name)&&
    checkDes(categoryData.description)){

      const result = await addCategoryToDB(categoryData)
      if (result.data.success === "true") {
        setOptSmModal(!optSmModal)
        setadded(added + 1)
        alert(result.data.messages)
        
      }
      else {
        console.error(result.data);
      }
    }
    else console.error("Invalid");
    
      
  }
  const UpdateCategory = async (e: any) => {
    e.preventDefault()
    const formdata = new FormData(e.currentTarget)
    const categoryData = {
      name: formdata.get('name'),
      description: formdata.get('description'),
    }

    const result = await updateCatecoryToDB(formdata,optid)
    
    if (result.data.success === "true") {
      setOptdeModal1(!optdeModal1)
      // alert(result.data.messages)
      setadded(added + 1)

    }
    else {
      console.error(result.data.error);
    }

  }
  useEffect(() => {

    getCategory().then((res => {
      setCategory(res.data)
    }))

  }, [added])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'category_name',
      headerName: 'Category Name',
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,

    },
    {
      field: 'Edit',
      headerName: 'Edit',
      width: 120,
      // editable: true,
      renderCell: (cellValues) => {
        return (
          <button type="button" className="btn btn-info" onClick={(evt) => {getUserDetails(evt, cellValues) }}color="primary"><a onClick={toggleShow2} > Update</a></button>


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
          <button type="button" className="btn btn-info" onClick={(evt) => { getUserDetails(evt, cellValues) }} color="primary"><a onClick={toggleShow1}> Delete Category</a></button>



        )
      }
    },
  ];
  const getUserDetails = (evt: SyntheticEvent, data: GridRenderCellParams) => {
    evt.preventDefault();
    setoptid(data.row.id);
    console.log(data.row)
    setDetails((prevState) => { return { ...prevState, "des": data.row.description } })
    setDetails((prevState) => { return { ...prevState, "name": data.row.category_name } })
  
  }
  const deleteCategory = async () => {


    const Result = deleteCategoryfromDB(+optid)
    .then((res => {
      console.log(res)
      if (res.data.success === 'true') 
      {
        alert(res.data.message + ": True")
        setOptdeModal(!optdeModal);
        setadded(added + 1)

      }
      else {
        alert(res.data.message)
        setOptdeModal(!optdeModal);
      }
    }))


  }

  return (
    <div>
     
      <div className="productBody"><button onClick={toggleShow} className='btn btn-warning m-2 p-2' style={{ width: "15rem" }}>Add Category</button></div>
      <>
        <MDBModal staticBackdrop show={optSmModal} tabIndex='-1' setShow={setOptSmModal}>
          <MDBModalDialog size='lg'>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Add Category</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <form onSubmit={addCategory} method="post">
                  <div className='m-1'>
                    <h5>Category Name</h5>
                    <MDBInput id='name' name='name' type='text' style={{ width: "15rem"  }}  onChange={()=>{setError((prevState) => { return { ...prevState, "name": "" } })}} />
                    <p className='text-danger p-2 m-2 ' >{Error.name}</p>
                  </div>
                  <div className='m-1 mb-3'>
                    <h5>Category Description</h5>
                    <textarea className="form-control"  name='description' id="textAreaExample" rows={4}  onChange={()=>{setError((prevState) => { return { ...prevState, "description": "" } })}} ></textarea>
                    <p className='text-danger p-2 m-2 ' >{Error.description}</p>
                  </div>
                  <MDBBtn className='btn btn-success' color='none' type='submit' style={{ width: "15rem" }}>Add</MDBBtn>
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

                <button onClick={deleteCategory} className="col-md-3 ms-2 btn btn-danger">Yes</button>
                <button onClick={toggleShow1} className="col-md-3 ms-2 btn btn-danger">No</button>

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
                <MDBModalTitle>Update Category</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleShow2}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <form onSubmit={UpdateCategory}>
                  <div className='m-1'>
                    <h5>Category Name</h5>
                    <input className="form-control"  defaultValue={Details.name} type="text" name="name" id="name" style={{ width: "15rem" }} />
                    <p className='text-danger p-2 m-2 ' >{Error.name}</p>
                  </div>
                  <div className='m-1 mb-3'>
                    <h5>Category Description</h5>
                    <textarea className="form-control" defaultValue={Details.des} name='description' id="textAreaExample" rows={4}></textarea>
                    <p className='text-danger p-2 m-2 ' >{Error.description}</p>
                  </div>
                  <button className='btn btn-primary' type="submit">Update</button>
                  {/* <MDBBtn className='btn btn-success' color='none' type='submit' style={{ width: "15rem" }}>Update</MDBBtn> */}
                </form>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
      <div className="table">
        <Box sx={{ height: 400, margin: "5%", width: '80%' }}>
          <DataGrid
            rows={category ? category : []}
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

export default Category