"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [ID, setID] = useState('')

  const hasRedeemed = () =>{
    fetch(`/api/redeem/${ID}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if(data.error){
          console.log(data.error)
        } else {
          console.log(data.message)
        }
      })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Input placeholder="Input Staff ID " onChange={e=> setID(e.currentTarget.value)}/>
        <Button onClick={hasRedeemed}>Search</Button>
      </div>
    </main>
  );
}
