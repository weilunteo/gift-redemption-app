"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Lottie from "react-lottie"
import animationData from "../../public/gift.json"

export default function Home() {
  const [ID, setID] = useState('')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('')
  const animationURL = "../../public/gift.json";

  const hasRedeemed = () =>{
    fetch(`/api/redeem/${ID}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if(data.error){
          console.log(data.error)
          setMessage(data.error)
          setColor('bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative')
        } else {
          console.log(data.message)
          setMessage(data.message)
          setColor('bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative')
        }
      })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-2xl font-bold">Gift Redemption Portal</h1>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={280}
        width={280}
      />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex gap-x-4">
        <Input placeholder="Input Staff ID " onChange={e => setID(e.currentTarget.value)} />
        <Button onClick={hasRedeemed}>Search</Button>
      </div>
      <div className={`message mt-8 p-3 rounded ${color}`}>{message}</div>
    </main>
  );
}
