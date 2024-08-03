'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import {firestore} from '@/firebase';
import {Box, Typography, Modal, Stack, TextField, Button} from '@mui/material';
import { deleteDoc, getDoc, getDocs, doc, query, setDoc, collection } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [prediction, setPrediction] = useState(null);

  const categories = {
    'apple': 'Fruit',
    'Apple': 'Fruit',
    'banana': 'Fruit',
    'Banana': 'Fruit',
    'carrot': 'Vegetable',
    'broccoli': 'Vegetable',
    'box': 'Object',
    'fish': 'Seafood',
    // Add more items and their categories as needed
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    makePrediction(inventoryList);
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {count} = docSnap.data()
      if (count == 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updateInventory()
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
    }
    else{
      await setDoc(docRef, {count: 1})
    }
    await updateInventory()
  }

  const makePrediction = (inventory) => {
    // Example prediction logic
    // For instance, predict the next item to be purchased based on inventory count
    const prediction = inventory.reduce((highest, item) =>
      item.count > highest.count ? item : highest
    , { name: 'None', count: 0 });

    setPrediction(prediction);
  };
  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
  <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" gap = {2}>
    <Modal open={open} onClose={handleClose}>
      <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: 'translate(-50%,-50%)',}}>
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}></Stack>
        <TextField variant="outlined" fullWidth value={itemName} onChange={(e)=>{setItemName(e.target.value)}}></TextField>
        <Button variant="outlined" onClick={()=>{
          addItem(itemName) 
          setItemName('') 
          handleClose()
          }}
          >
            Add
          </Button>
      </Box>
    </Modal>
    <Box flexGrow={1}></Box>  {/* Spacer */}
    <Button variant="contained" onClick={()=>{
      handleOpen()}}>
        Add New Item
    </Button>
    <Box border="1px solid #333">
      <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h2" color="#333">
          Inventory Images
        </Typography>
      </Box>
    <Stack width="800px" height="300px" spacing={2} overflow="auto">
      {
        inventory.map(({name, count })=>(
          <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="center" bgcolor="#f0f0f0" padding={5}>
            <Stack direction="row" spacing={30} alignItems="center">
            <Typography variant='h3' color='#333' textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)} ({categories[name.toLowerCase()] || 'Unknown'})
            </Typography>
            <Typography variant='h3' color='#333' textAlign="center">
              {count}
            </Typography>
            <Button variant="contained" onClick={()=>{
              removeItem(name)
            }}>
              Remove
            </Button>
            </Stack>
          </Box>
      ))}
    </Stack>
    </Box>
    {prediction && (
        <Box mt={2}>
          <Typography variant="h4">Predicted Next Purchase: </Typography>
          <Typography variant="h5">{prediction.name}</Typography>
        </Box>
      )}
    </Box>
  )
}
