'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import Link from "next/link";  // Import Link
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello I'm Pat, the Pathway2Code assistant! How can I help you today?"
    }
  ])

  const [message, setMessage] = useState('')

  const sendMessage = async() => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''}
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if(done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
  <Box 
    width ="100vw"
    height ="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <Stack
      direction="column"
      width="800px"
      height="700px"
      border="1px solid dark gray"
      p={2}
      spacing={3}
      bgcolor="#202123" //chat box background
    >
      <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxHeight="100%"
      >
        {
          messages.map((message, index) => (
            <Box
              key = {index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
            <Box
              bgcolor={
                message.role === 'assistant' ? 'gray' : 'purple'
              }
              color="white"
              borderRadius={16}
              p={3}
            >
              {message.content}
            </Box>
            </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField 
          label="Ask Alli anything!"
          fullWidth 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} //message text field background #2e3133

          InputProps={{
            style: {
              color: 'white',
              backgroundColor: '#4d5156',
              borderColor: 'white'
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white'
            }
          }}
          sx= {{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
               borderColor: 'gray', // Change border color
            },
            '&:hover fieldset': {
              borderColor: 'white', // Change border color on hover
           },
          '&.Mui-focused fieldset': {
              borderColor: 'aquamarine', // Change border color when focused
          },
        },
        '& .MuiInputLabel-root': {
          color: 'white' // Change label color
        },
      }}
    />
        <Button //send message button
          variant="outlined"
          onClick={sendMessage}
          
          sx= {{
            color:"white",
            borderColor: "white",
            '&:hover': {
              borderColor: "#202123",
              backgroundColor: "aquamarine",
              color: "black",
            },
          }}
        >
          Send
        </Button>
      </Stack>
      <Box // Signup link box
        display="flex"
        justifyContent="center"
        mt={2}
      >
        <Link href="/SignUp" passHref>  {/* Create a link to the SignUp page */}
          <Button 
            variant="contained"
            sx= {{
              color: "black",
              backgroundColor: "aquamarine",
              '&:hover': {
                backgroundColor: "lightgreen",
              },
            }}
          >
            Sign Up
          </Button>
        </Link>
      </Box>
    </Stack>
  </Box>
  )
}