"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [ID, setID] = useState('')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('')

  const hasRedeemed = () =>{
    fetch(`/api/redeem/${ID}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if(data.error){
          console.log(data.error)
          setMessage(data.error)
          setColor('text-red-500')
        } else {
          console.log(data.message)
          setMessage(data.message)
          setColor('text-green-500')
        }
      })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-2xl font-bold">Gift Redemption 🎁</h1>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex gap-x-4">
        <Input placeholder="Input Staff ID " onChange={e => setID(e.currentTarget.value)} />
        <Button onClick={hasRedeemed}>Search</Button>
      </div>
      <div className={`message mt-4 ${color}`}>{message}</div>
    </main>
  );
}
