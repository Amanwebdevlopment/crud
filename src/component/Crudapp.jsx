import React, { useState, useEffect, useRef } from 'react';
import "./crudapp.css";
import { IoIosArrowBack, IoIosArrowForward, IoIosEye, IoMdSearch } from "react-icons/io";
import { FaAngleDoubleLeft,  FaSort } from "react-icons/fa";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TbDownload } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { TfiFaceSad } from "react-icons/tfi";
import { IoFemale, IoMale } from 'react-icons/io5';
import { MdDelete, MdEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Swal from 'sweetalert2'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const CrudApp = () => {
  const [arr, setArr] = useState(() => {
    const data = localStorage.getItem("employList")
    if (data != null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  })
  const [selectAll, setSelectAll] = useState(false)
  const [flag,setFlag] = useState(true)
  const allChecked = (e) => {
    let newArr
    setSelectAll(e.target.checked)
    if (selectAll == true) {
      newArr = arr.map((item) => {
        return { ...item, selectUser: false }
      })
    } else {
      newArr = arr.map((item) => {
        return { ...item, selectUser: true }
      })
    }
    setArr(newArr)
  }
  useEffect(() => {
    localStorage.setItem("employList", JSON.stringify(arr))
  })
  const [values, setValues] = useState({
    "name": "",
    "email": "",
    "password": "",
    "confirmPassword": "",
    "userType": "",
    "gender": "",
    "selectUser": false
  })
  const inputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const addEmploy = (e) => {
    e.preventDefault()
    const updatedArr = [...arr, values];
    setArr(updatedArr);
    localStorage.setItem("employList", JSON.stringify(updatedArr));
    setValues({
      "name": "",
      "email": "",
      "password": "",
      "confirmPassword": "",
      "userType": "",
      "gender": "",
    })
    setModalDisplay('modal-close');
  }
  const genderHandler = (e) => {
    setValues({ ...values, gender: e.target.value });
  };
  const userPost = (e) => {
    setValues({ ...values, userType: e.target.value });
  };
  const [modalDisplay, setModalDisplay] = useState("modal-close")
  // const openAddModal = ()=>{
  //   setFlag
  // }
  const removeEmploy = (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let newArr = arr.filter((item, index) => index != uid)
        setArr(newArr)
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }
  const editEmploy = (uid)=>{
    const obj = arr[uid]
    setValues(obj)
    setFlag(false)
   setModalDisplay("modal-open")
   
  }
  const removeChecked = (id) => {
    let newArr = arr.map((item, index) => {
      if (index == id) {
        return { ...item, selectUser: !item.selectUser }
      } else {
        return item
      }
    })
    setArr(newArr)

  }
  const deleteAll = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        let newArr = arr.filter((item) => item.selectUser == false);
        if(newArr.length !== arr.length){
          setArr(newArr)
          setSelectAll(false)
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "please select at least 1 user for delete"
          });
        }
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });

  }
  const sortList = (val)=>{
   if ( val.item == 'name'){
    const sort = [...arr].sort((a,b)=>{ return a.name.localeCompare(b.name) });
    setArr(sort)
   }else if(val.item == 'employ type'){
    const sort = [...arr].sort((a,b)=>{ return a.userType.localeCompare(b.userType) });
    setArr(sort)
   }else if(val.item == 'email'){
    const sort = [...arr].sort((a,b)=>{ return a.email.localeCompare(b.email) });
    setArr(sort)
   }else if(val.item == 'password'){
    const sort = [...arr].sort((a,b)=>{ return a.password.localeCompare(b.password) });
    setArr(sort)
   }else if(val.item == 'gender'){
    const sort = [...arr].sort((a,b)=>{ return a.gender.localeCompare(b.gender) });
    setArr(sort)
   }
  }
  // pagination
  const [pageCount, setPagecount] = useState(1)
  const [pagePrev, setPagePrev] = useState(0)
  const [pageNext, setPageNext] = useState(5)
  useEffect(() => {
    pageCount
  })
  const nextPage = () => {
    if (pageNext < arr.length) {
      setPagecount(pageCount + 1)
      setPagePrev(pagePrev + 5);
      setPageNext(pageNext + 5);
    }
  };

  const backPage = () => {
    if (pagePrev > 0) {
      setPagecount(pageCount - 1)
      setPagePrev(pagePrev - 5);
      setPageNext(pageNext - 5);
    }
  };

  const lastPage = () => {
    const lastPageStart = Math.floor((arr.length - 1) / 5) * 5;
    setPagePrev(lastPageStart);
    setPageNext(arr.length);
  };

  const startPage = () => {
    setPagecount(1)
    setPagePrev(0);
    setPageNext(5);
  };
  // export to excel 
  const exportToExcel = () => {
    if (arr.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No data available to export!",
      });
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(arr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    saveAs(excelFile, "EmployeeList.xlsx");
  
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data exported successfully!",
    });
  };

  return (
    <div className='container'>
      <div className="crud-content">
        <div className="crud-top d-flex">
          <div className="heading-top">
            <h1 className='heading'>crud application</h1>
          </div>
          <div className='d-flex crud-action'>
            <div className='search-box'>
              <IoMdSearch className='search-icon' />
              <input type="text" className='search-input' placeholder='Search..' />
            </div>
            <div className="crud-action-btn">
              <button className='crud-top-btn importExcel-btn' onClick={exportToExcel}><TbDownload /></button>
              <button className='crud-top-btn'> <LiaSlidersHSolid /> filter</button>
              <button className='crud-top-btn deleteAll-btn' onClick={deleteAll}><RiDeleteBin6Line /> Delete all </button>
              <button className='crud-top-btn ' id='add-employ-btn' onClick={()=>{ setModalDisplay("modal-open"); setFlag(true);}} > <IoMdAdd /> add employ</button>
            </div>
          </div>
        </div>
        <div className="crud-user-list">
          <table className='crud-table'>
            <thead>
              <tr>
                <th className='crud-table-head'><input type="checkbox" checked={selectAll} onChange={allChecked} /> </th>
                {['#', 'name', 'employ type', 'email', 'password', 'gender'].map((item, index) => {
                  return (
                    <th className='crud-table-head' key={index}>{item} <FaSort className='sort-icon' onClick={()=>sortList({item})} /> </th>
                  )
                })}
                <th className='crud-table-head'> modify list </th>
              </tr>
            </thead>
            <tbody>
              {arr.length > 0 == false ?
                <tr className='empty-msg'>
                  <td> no record found <TfiFaceSad /></td>
                </tr>
                : arr.slice(pagePrev, pageNext).map((item, index) => <tr key={pagePrev + index} className='table-row'> 
                  <td className='crud-table-data'><input type="checkbox" checked={item.selectUser} onChange={() => removeChecked(index)} /></td>
                  <td className='crud-table-data'>{pagePrev + index + 1}</td>
                  <td className='crud-table-data'>{item.name}</td>
                  <td className='crud-table-data'>{item.userType}</td>
                  <td className='crud-table-data'>{item.email}</td>
                  <td className='crud-table-data'>{item.password}</td>
                  <td className='crud-table-data'>{item.gender}</td>
                  <td className='crud-table-data'>
                    <button className='table-manage-btn'><IoIosEye /></button>
                    <button className='table-manage-btn' onClick={() => removeEmploy(pagePrev + index)}><MdDelete /></button>
                    <button className='table-manage-btn' onClick={()=> editEmploy( pagePrev + index)}><MdEdit /></button>
                  </td>
                </tr>)

              }

            </tbody>
          </table>
          <div className="crud-bottom d-flex">
            <div className='d-flex'>
              <button className='bottom-slide-btn' style={pageCount > 1 ? { display: "block" } : { display: " none" }} onClick={startPage}><FaAngleDoubleLeft /></button>
              <button className='bottom-slide-btn' onClick={backPage}><IoIosArrowBack /></button>
            </div>
            <div>
              <span className='page-count'>{pageCount}</span>
            </div>
            <div>
              <button className='bottom-slide-btn' onClick={nextPage}><IoIosArrowForward /></button>
            </div>
          </div>
        </div>
        <div className={`modal ${modalDisplay}`} >
          <div className="modal-content" >
            <form action="post" onSubmit={addEmploy} >
              <div className="crud-form d-flex">
                {
                  flag ? <h2 className="modal-heading">add employ</h2> :  <h2 className="modal-heading">edit employ</h2>
                }
                <div className="form-input-box">
                  <label htmlFor="nm">
                    Name
                  </label>
                  <input type="text" onChange={inputHandler} value={values.name} name="name" className="form-input" placeholder="Employ Name" id="nm" />
                </div>
                <div className="form-input-box">
                  <label htmlFor="eEmail">
                    email
                  </label>
                  <input type="email" onChange={inputHandler} value={values.email} name="email" className="form-input" placeholder="Employ Mail" id="eEmail" />
                </div>
                <div className="form-input-box">
                  <label htmlFor="pwd">
                    password
                  </label>
                  <input type="password" onChange={inputHandler} value={values.password} name="password" className="form-input" placeholder="Password" id="pwd" />
                </div>
                <div className="form-input-box">
                  <label htmlFor="cPwd">
                    confirm password
                  </label>
                  <input type="password" onChange={inputHandler} value={values.confirmPassword} name="confirmPassword" className="form-input" placeholder="Confirm Password" id="cPwd" />
                </div>
                <div className="form-input-box">
                  <label htmlFor="gender">
                    gender
                  </label>
                  <div className='select-option'>
                    <IoMale />male : <input type="radio" onChange={genderHandler} checked={values.gender == 'male'} name="gender" value="male" className="form-input gender" />
                    <IoFemale />female : <input type="radio" name="gender" onChange={genderHandler} checked={values.gender == 'female'} value="female" className="form-input gender" />
                    other : <input type="radio" name="gender" value="other" onChange={genderHandler} checked={values.gender == 'other'} className="form-input gender" />
                  </div>
                </div>
                <div className="form-input-box">
                  <label htmlFor="userType">
                    user type
                  </label>
                  <div className='select-option'>
                    admin : <input type="radio" onChange={userPost} name="userType" value="admin" checked={values.userType == 'admin'} className="form-input gender" />
                    employ : <input type="radio" name="userType" onChange={userPost} value="employ" checked={values.userType == 'employ'} className="form-input gender" />
                  </div>
                </div>
                {flag ? <button type="submit" className="add-btn" >add</button> :<button type="submit" className="update-btn" >update</button>}
                <button className='btn-cancel' onClick={()=> setModalDisplay('modal-close')} type='reset'>cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
