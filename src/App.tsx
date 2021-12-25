
import React, { useEffect, useState, useRef } from 'react';
import "./App.css"

import { WebviewTag } from "electron"



//mui

import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



//icons

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { AnyAaaaRecord } from 'dns';



const App = () => {

  const electron = window.require('electron')

  const remote = electron.remote;
  
  const [open, setOpen] = React.useState(false);
  const [contentReady, setContentReady] = React.useState(false);

  const descriptionElementRef = React.useRef(null);

  const [cangoback, setCanGoBack] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cangoforward, setCanGoFoward] = useState(false)
  const [url, setUrl] = useState("https://www.google.com/")
  const [viewUrl, setViewUrl] = useState("https://www.google.com/")

  const [string, setString] = useState("")

  useEffect(() => {
    const webview: WebviewTag = document.getElementById("webview") as WebviewTag

    webview.addEventListener("did-finish-load", (e:any) => {
      console.log(e.target.value)
      setCanGoBack(webview.canGoBack())
      setCanGoFoward(webview.canGoForward())
      setContentReady(true)
    })
    webview.addEventListener('did-navigate', (e:any)=>{

      setContentReady(false)
    })

    
  }, [])

  const handleClose = () => {
    setOpen(false);
  };

  const goBack = () => {
    const webview: WebviewTag = document.getElementById("webview") as WebviewTag
    webview.goBack()
  }

  const goForward = () => {
    const webview: WebviewTag = document.getElementById("webview") as WebviewTag
    webview.goForward()

  }
  const focusWebView = (e: any) => {


    const webview: WebviewTag = document.getElementById("webview") as WebviewTag
    webview.focus()
    e.stopPropagation();
  }
  const handleSubmit = (e: any) => {

    e.preventDefault()
    setViewUrl(url)
  }
  const handleChange = (e: any) => {
    e.preventDefault()
    const value = e.target.value
    setUrl(value)
  }

  const focusMe = (e: any) => {

    e.target.focus()
    e.stopPropagation();
  }

  const getString = (e: any) => {
    const webview: WebviewTag = document.getElementById("webview") as WebviewTag
    webview.send(`getString`,"path")

    setLoading(true)
    webview.addEventListener('ipc-message', (event) => {
      setString(event.channel)
      setOpen(true)
      setLoading(false)
     
    })
  
  
  }

  const Loading   = () =>{

    return ( <Box sx={{ display: 'flex' }}>
    <CircularProgress  color="secondary" />
  </Box>)
  }
  const Taskbar = () => (
    <div style={{ backgroundColor: "#f2f2f2", paddingLeft: "1rem", maxHeight: "4rem", display: "flex", padding: "0.5rem" }} >
      <div >
        <IconButton disabled={!cangoback} onClick={goBack}>

          <ArrowBackIcon />
        </IconButton>

        <IconButton disabled={!cangoforward} onClick={goForward}>

          <ArrowForwardIcon />
        </IconButton>

      </div>

      <div style={{ width: "65%", marginLeft: "10%" }}>

        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
          onSubmit={handleSubmit}
        >

          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="URL"
            variant="standard"
            fullWidth
            
            autoFocus
            onChange={handleChange}
            defaultValue={url}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>



        </Paper>
      </div>

      <div style={{marginLeft : "5%", paddingTop : 5}}>
        <Button variant="contained" color="primary" onClick={getString}  disabled={!contentReady}>

          get String

          {loading && <Loading />}
        </Button>

      </div>



    </div>
  )

  const trueAsStr = 'true'
  const app = remote.app
  const dirname = app.getAppPath()
 
 
  return (
    <div className="App">



      <Taskbar />
      <webview id="webview" src={viewUrl} style={{ width: "100vw", height: "calc(100vh - 5rem )" }} allowpopups={true}
        preload={`file://${dirname}/build/preload.js`}
      ></webview>




<Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Content</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {string}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
