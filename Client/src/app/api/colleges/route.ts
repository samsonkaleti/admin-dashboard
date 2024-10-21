import { NextRequest, NextResponse } from 'next/server';

type Program = {
  name: string;
  specializations: string[];
  years: number[];
  regulations: {
    type: string;
    regulation: string;
    validYears: number[];
  }[];
};

type CollegeDetails = {
  address: string;
  contactNumber: string;
  email: string;
};

type CollegeData = {
  collegeName: string;
  regulatoryBody: string;
  domain: string;
  details: CollegeDetails[];
  programs: Program[];
};

const collegeData: CollegeData[] = [];

export async function POST(request: NextRequest) {
  const newCollege: CollegeData = await request.json();
  collegeData.push(newCollege);
  return NextResponse.json(newCollege, { status: 201 });
}

export async function GET() {
  return NextResponse.json(collegeData);
}