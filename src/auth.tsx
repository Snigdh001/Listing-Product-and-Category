import axios from "axios";

const baseurl = "http://localhost/snigdh_ci4/api/"

const loginResponse = {
    status: 0,
    error: "",
    messages: {
        id: "",
        success: '',
        message: "",
    }

}
const add_update = {
    status: '',
    success: '',
    error: "",
    messages: '',
    imgStatus: 0,
}
const del = {
    id: 0,
    message: '',
    error: "",
    success: '',
}
 



const loginUser = (data: object) => {
    return axios.post<typeof loginResponse>(baseurl + 'login', data)
}
const addProductToDB = (data: any) => {
    return axios.post<typeof add_update>(baseurl + 'addProduct', data)
}
const addCategoryToDB = (data: any) => {
    return axios.post<typeof add_update>(baseurl + 'addCategory', data)
}
const updateProductToDB = (data: any, id: any) => {
    return axios.post<any>(baseurl + 'updateProduct', data, { headers: { 'id': id } })
}
const updateCatecoryToDB = (data: any, id: any) => {
    return axios.post<any>(baseurl + 'updateCategory', data, { headers: { 'id': id } })
}
const getCategory = () => {
    return axios.post<[]>(baseurl + 'getCategory')
}
const getProduct = () => {
    return axios.post<[]>(baseurl + 'getProduct')
}
const deleteProductfromDB = (id: number) => {

    return axios.delete<typeof del>(baseurl + `deleteProduct/${id}`);
}
const deleteCategoryfromDB = (id: number) => {

    return axios.delete<typeof del>(baseurl + `deleteCategory/${id}`)
}

export { loginUser, addProductToDB, addCategoryToDB, getProduct, getCategory, deleteProductfromDB, deleteCategoryfromDB, updateProductToDB, updateCatecoryToDB, };