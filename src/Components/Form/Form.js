import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import Tabel from "../Table/Table"

const Form = (props) => {
  const [data, setData] = useState([])
  const [id, setId] = useState(null)

  useEffect(() => {
    const getData = () => {
      axios
        .get("http://localhost:3000/todos")
        .then((response) => {
          setData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getData()
  }, [])

  const { handleSubmit, register, errors, setValue } = useForm()
  const onSubmit = (values, e) => {
    props.AddTodos(values)
    if (id) {
      axios
        .put(`http://localhost:3000/todos/${id}`, values)
        .then((response) => {
          const index = data.findIndex((item) => {
            return item.id === id
          })
          let newArr = [...data]
          newArr[index] = response.data
          setData(newArr)
          setId(null)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      axios
        .post("http://localhost:3000/todos", values)
        .then((response) => {
          setData([...data, response.data])
        })
        .catch((error) => {
          console.log(error)
        })
    }
    e.target.reset()
  }

  const onRemove = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then((response) => {
        const newData = data.filter((item) => {
          if (item.id === id) return false
          return true
        })
        setData(newData)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onUpdate = (id) => {
    axios
      .get(`http://localhost:3000/todos/${id}`)
      .then((response) => {
        if (response.data) {
          setId(response.data.id)
          setValue("day", response.data.day, {
            shouldValidate: true,
            shouldDirty: true,
          })
          setValue("activities", response.data.activities, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='pt-4'>
      <div className='text-center'>
        <h2>Todo List</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label htmlFor='day'>Day :</label>
          <input
            type='text'
            name='day'
            className='form-control'
            ref={register({
              required: "Required",
            })}
            required
          />
          {errors.day && errors.day.message}
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Activities :</label>
          <input
            type='text'
            name='activities'
            className='form-control'
            ref={register({
              required: "Required",
            })}
            required
          />
          {errors.activities && errors.activities.message}
        </div>

        <button type='submit' className='btn btn-success'>
          {id ? "Update" : "Create"}
        </button>
      </form>
      <hr />
      <Tabel todo={data} remove={onRemove} update={onUpdate} />
    </div>
  )
}

export default Form
