import React,{useEffect,useMemo} from 'react'
import {io} from "socket.io-client"

const App = () => {
  const socket = useMemo(() => io("http://localhost:4000"),[])
  const [inputvalue,setInputvalue] = React.useState("")
  const [room,setRoom] = React.useState("")
  const [messages,setMessages] = React.useState([])

  const sendmessage = () => {
   const data ={
    message:inputvalue,
    room:room
   }
   socket.emit("sendmessage",data)
    setInputvalue("")
  }

  useEffect(() => {
    socket.on("userConnected",(message)=>{
      console.log(message)
    })

    // socket.on("recivedmessage",(message)=>{
    //   console.log(message,"received message")
    //   setMessages(prevMessages => [...prevMessages,message])
    // })


    socket.on("roommessage",(message)=>{
      console.log(message,"received message")
      setMessages(prevMessages => [...prevMessages,message])
    })
    socket.on("userLeft",(message)=>{
      console.log(message,"received message")
      setMessages(prevMessages => [...prevMessages,message.message])
    })

  },[])

  return (
    <div>
      <input placeholder='enter message'
      value={inputvalue}
      onChange={(e)=>{
        setInputvalue(e.target.value)
      }}
      />
      <input placeholder='enter room name'
      value={room}
      onChange={(e)=>{
        setRoom(e.target.value)
      }}
      />
      <button onClick={sendmessage}>Send</button>
      {
        messages.map((message,index)=>(
          <div key={index}>{message}</div>
        ))
      }

      <input
      type='text'
      placeholder='enter room name'
      value={room}
      onChange={(e)=>{
        setRoom(e.target.value)
      }}
      />
      <button onClick={()=>socket.emit("leaveRoom",room)}>Leave Rooom</button>
    </div>
  )
}

export default App
