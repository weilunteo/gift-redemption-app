// create api endpoint that takes in staff_pass_id 
// convert staff pass id to team name if exists
// search

import {sql} from '@vercel/postgres';
import { NextResponse} from 'next/server';

export async function POST(request: Request, { params }: any ): Promise<Response> {
  const staffPassId = params.staffPassId;
  // console.log(staffPassId)
  try{
    console.log("AM I HERE")
    const q = `SELECT team_name FROM Team WHERE staff_pass_id =  '${staffPassId}'`;
    console.log(sql)
    const result = await sql.query(q);
    console.log("AM I HERE 2")
    const teamName = result.rows[0]?.team_name;
    // console.log(teamName)

    if (!teamName) {
      return NextResponse.json({error: `Staff pass id ${staffPassId} not found`}, {status:404});
    }
    
    const q2 = `SELECT redemption_status FROM Redemption WHERE team_name = '${teamName}'`;
    const result2 = await sql.query(q2);
    // console.log(result2)

    if (result2.rows.length > 0) {
      return NextResponse.json({error: `${teamName} has already redeemed`}, {status:409});
    }
    else{
      const q3 = `INSERT INTO Redemption (team_name, redemption_status) VALUES ('${teamName}', 'TRUE')`;
      await sql.query(q3);
    
    }
    return NextResponse.json({message: `Team redemption for ${teamName} is still available`}, {status:200});
  }
  catch (error) {
    console.log(error)
    return NextResponse.json({error}, {status:500});
  }

}